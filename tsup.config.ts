import { defineConfig } from "tsup";

export default defineConfig({
    dts: true,
    clean: true,
    sourcemap: true,
    outDir: "dist",
    format: ["esm", "cjs"],
    external: ["fs", "url"],
    entry: ["./src/index.ts", "./src/cli/bin.ts"],
});
