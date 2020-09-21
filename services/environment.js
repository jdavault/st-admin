import getConfig from 'next/config'

const {publicRuntimeConfig} = getConfig() || {};

const {
    REACT_APP_API_PREPEND = 'd'
} = publicRuntimeConfig || process.env;

export const environment = {
    authEndPoint: '',
    apiEndPoint: `https://api.storagetreasures.com/${REACT_APP_API_PREPEND}/`,
};
