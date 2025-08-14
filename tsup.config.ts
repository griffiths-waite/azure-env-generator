import { defineConfig } from "tsup";

export default defineConfig({
    dts: true,
    clean: true,
    sourcemap: true,
    outDir: "dist",
    format: ["esm", "cjs"],
    entry: ["./src/index.ts", "./src/cli/bin.ts"],
});
