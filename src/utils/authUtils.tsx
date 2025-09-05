import tokenUtils from './tokenUtils';
const validateAuth = async () => {
  const ak = tokenUtils.getAccessToken();
  if (!ak) {
    return false;
  }

  // maybe server validate token here
  //await new Promise(resolve => setTimeout(resolve, 3000));

  return true;
};

export default { validateAuth };
