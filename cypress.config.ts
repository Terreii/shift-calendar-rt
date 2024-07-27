import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: `http://localhost:${process.env.port || 5173}`,
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
