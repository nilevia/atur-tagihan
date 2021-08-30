// tidak dibutuhkan pada version 9.4
module.exports = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_API_FLAGR_URL: process.env.NEXT_PUBLIC_API_FLAGR_URL,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },
};

// try version 9.3 next
// const withImages = require('next-images');
// const Dotenv = require("dotenv-webpack");
//
// module.exports = withImages();
// module.exports = {
//   webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
//     config.plugins.push(new Dotenv({ silent: true }));
//     return config;
//   }
// };

// using runtime
// module.exports = {
//   // serverRuntimeConfig: {
//   //   // Will only be available on the server side
//   // },
//   publicRuntimeConfig: {
//     // Will be available on both server and client
//     NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
//     NEXT_PUBLIC_API_FLAGR_URL: process.env.NEXT_PUBLIC_API_FLAGR_URL,
//   },
// };
