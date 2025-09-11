import { getAccessToken } from './tokenUtils';
const validateAuth = async (delay = 1000) => {
  const ak = getAccessToken();
  await new Promise(resolve => setTimeout(resolve, delay));
  if (!ak) {
    return false;
  }

  // maybe server validate token here
  //await new Promise(resolve => setTimeout(resolve, 3000));

  return true;
};

export default { validateAuth };
