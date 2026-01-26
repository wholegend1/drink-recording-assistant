// postcss.config.mjs
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {}, // 注意這裡變了
    autoprefixer: {},
  },
};

export default config;
