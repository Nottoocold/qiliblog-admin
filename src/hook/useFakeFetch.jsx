import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

let cache = new Map();

function useFakeFetch(URL) {
  let location = useLocation();
  let cacheKey = location.key + URL;
  let cached = cache.get(cacheKey);

  let [data, setData] = useState(() => {
    // initialize from the cache
    return cached || null;
  });

  let [state, setState] = useState(() => {
    // avoid the fetch if cached
    return cached ? "done" : "loading";
  });

  useEffect(() => {
    if (state === "loading") {
      let controller = new AbortController();
      fetch(URL, { signal: controller.signal })
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText);
          return res.json();
        })
        .then((data) => {
          if (controller.signal.aborted) return;
          // set the cache
          cache.set(cacheKey, data);
          setData(data);
          setState("done");
        });
      return () => controller.abort();
    }
  }, [state, cacheKey]);

  useEffect(() => {
    setState("loading");
  }, [URL]);

  return data;
}
