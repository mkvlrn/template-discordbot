// biome-ignore lint/correctness/noNodejsModules: this is a backend script
import fs from "node:fs/promises";
// biome-ignore lint/correctness/noNodejsModules: this is a backend script
import { resolve } from "node:path";
import swc from "@swc/core";
import tsConfig from "../tsconfig.json" assert { type: "json" };

const REGEX_SRC = /^src\//;
const REGEX_TS = /\.ts$/;
const REGEX_OUTPUT_PATH = /\/[^/]+$/;
const OUT = "./build";

const { paths } = tsConfig.compilerOptions;
const baseUrl = resolve(process.cwd(), tsConfig.compilerOptions.baseUrl);

// clean up old output
await fs.rm(OUT, { recursive: true, force: true });

// get all entry points
const files: string[] = [];
for await (const file of fs.glob("src/**/*.ts")) {
  files.push(file);
}

// transform files
await Promise.all(
  files.map(async (file) => {
    const { code } = await swc.transformFile(file, {
      jsc: {
        baseUrl,
        paths,
        parser: { syntax: "typescript", decorators: true, dynamicImport: true },
        target: "esnext",
        transform: {
          decoratorMetadata: true,
        },
      },
      module: {
        type: "es6",
        strict: true,
      },
    });

    const outputPath = `${OUT}/${file.replace(REGEX_SRC, "").replace(REGEX_TS, ".js")}`;
    await fs.mkdir(outputPath.replace(REGEX_OUTPUT_PATH, ""), { recursive: true });
    await fs.writeFile(outputPath, code);
  }),
);
