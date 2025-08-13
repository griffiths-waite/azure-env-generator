import { generateEnv } from "./generator.js";

(async () => {
    await generateEnv({});
    process.exit(0);
})();
