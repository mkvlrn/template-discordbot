import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/main.ts", "./src/commands/**/*.ts"],
  fixedExtension: false,
  outDir: "./build",
  sourcemap: true,
  unbundle: true,
});
