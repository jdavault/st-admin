/**
 Figure out how to read the .end file. For now lets use hard coded variables
 **/
import getConfig from 'next/config';

const {publicRuntimeConfig} = getConfig() || {};

const {
  REACT_APP_DEV = false,

  REACT_APP_PUBLIC_URL = undefined,
  REACT_APP_COOKIE_DOMAIN = undefined,

  REACT_APP_COGNITO_REGION, // : region = false,
  REACT_APP_COGNITO_USER_POOL_ID, // : userPoolId = false,
  REACT_APP_COGNITO_APP_CLIENT_ID, // : userPoolWebClientId = false,
} = publicRuntimeConfig || {};

export const APP_CONFIG = {
  DEV: REACT_APP_DEV, // Basically enables the thingamabob

  // eslint-disable-next-line
    APP_URL: REACT_APP_PUBLIC_URL, // || location.protocol + '//' + location.host + '/',

  VALIDATION: {
    ZIPCODE: /(\d{5})|(^[ABCEGHJKLMNPRSTVXYabceghjklmnprstvxy]{1}\d{1}[A-Za-z]{1} *\d{1}[A-Za-z]{1}\d{1}$)/,
    API_FORMAT_PHONE: /\(\d{3}\)\s\d{3}-\d{4}/,
    // format of the phone number updated. saving this in case we go back.
    FORMAT_PHONE: /\(\d{3}\)\s\d{3}-\d{4}/,
  },

  // using react-input-mask link in the readme.md file
  MASK: {
    ZIPCODE: {
      237: '99999', // US
      37: 'a9a 9a9', // CAD
    },

    PHONE: '(999) 999-9999',
  },

  COOKIE_DOMAIN: REACT_APP_COOKIE_DOMAIN || REACT_APP_PUBLIC_URL,

  Auth: {
    authenticationFlowType: 'USER_PASSWORD_AUTH',
    mandatorySignIn: false,
    region: REACT_APP_COGNITO_REGION,
    userPoolId: REACT_APP_COGNITO_USER_POOL_ID,
    userPoolWebClientId: REACT_APP_COGNITO_APP_CLIENT_ID,
    cookieStorage: {
      // required
      domain: REACT_APP_COOKIE_DOMAIN || REACT_APP_PUBLIC_URL,
      secure: true,
    },
  },

  env: publicRuntimeConfig,
};
