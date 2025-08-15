#!/usr/bin/env node

import { cli } from "./cli.js";

// Disable warning message for importing JSON modules
process.removeAllListeners("warning");

cli().then(() => {
    process.exit(0);
});
