import * as utils from './tokenUtils';
const validateAuth = async () => {
  const ak = utils.getAccessToken();
  if (!ak) {
    return false;
  }

  // maybe server validate token here
  //await new Promise(resolve => setTimeout(resolve, 3000));

  return true;
};

export { validateAuth };
