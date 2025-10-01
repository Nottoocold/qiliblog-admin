export const serializeParams = (params: Record<string, unknown>): URLSearchParams => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  return searchParams;
};

export const buildUrlWithParams = (baseUrl: string, params: Record<string, unknown>): string => {
  const searchParams = serializeParams(params);
  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};
