const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

const setAccessToken = (token: string) => {
  localStorage.setItem('access_token', token);
};

const getRefreshToken = () => {
  return localStorage.getItem('refresh_token');
};

const setRefreshToken = (token: string) => {
  localStorage.setItem('refresh_token', token);
};

const setToken = (accessToken: string, refreshToken: string) => {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
};

const getToken = () => {
  return {
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
  };
};

const clearToken = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export {
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  setRefreshToken,
  setToken,
  getToken,
  clearToken,
};
