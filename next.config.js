require('dotenv').config();
const withLess = require('@zeit/next-less');
const withCSS = require('@zeit/next-css');
const withImages = require('next-images');
const {withCookies} = require('react-cookie');
const withPlugins = require('next-compose-plugins');

const REACT_APP = /^REACT_APP_/i;
const publicRuntimeConfig = Object.keys(process.env).filter((k) => REACT_APP.test(k))
  .reduce(
    (env, key) => {
      env[key] = process.env[key];
      return env;
    },
    {
      // Useful for determining whether we’re running in production mode.
      // Most importantly, it switches React into the correct mode.
      // NODE_ENV: process.env.NODE_ENV || 'development',
      // Useful for resolving the correct path to static assets in `public`.
      // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
      // This should only be used as an escape hatch. Normally you would put
      // images into the `src` and `import` them in code to get their paths.
    },
  );

// const prod = process.env.NODE_ENV === 'production';
module.exports = withPlugins([
  withLess,
  withCSS,
  withCookies,
  withImages,
], {
  webpack: (config) => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty',
    };

    config.module.rules.push({
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000,
          name: '[name].[ext]',
        },
      },
    });

    const originalEntry = config.entry;
    config.entry = async () => {
      const entries = await originalEntry();

      if (
        entries['main.js']
                && !entries['main.js'].includes('./utils/polyfills.js')
      ) {
        entries['main.js'].unshift('./utils/polyfills.js');
      }

      return entries;
    };

    return config;
  },
  publicRuntimeConfig,
});
