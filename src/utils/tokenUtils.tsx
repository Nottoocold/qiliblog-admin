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

const setToken = (token: string, refreshToken: string) => {
  setAccessToken(token);
  setRefreshToken(refreshToken);
};

const clearToken = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export default {
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  setRefreshToken,
  setToken,
  clearToken,
};
