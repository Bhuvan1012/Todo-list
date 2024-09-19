const path = require('path');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  // Your other webpack config...
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  plugins: [
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          // Cache API requests
          urlPattern: new RegExp('https://dummyjson.com/todos'),
          handler: 'NetworkFirst', // Try network first, fallback to cache if offline
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 50, // Limit the number of cached responses
              maxAgeSeconds: 60 * 60 * 24, // Cache for 1 day
            },
          },
        },
        {
          // Cache assets (like CSS, JS, etc.)
          urlPattern: /\.(?:js|css|html)$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'assets-cache',
          },
        },
        {
          // Cache images
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'image-cache',
            expiration: {
              maxEntries: 20, // Limit number of images cached
              maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
            },
          },
        },
      ],
    }),
  ],
};
