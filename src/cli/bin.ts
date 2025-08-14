#!/usr/bin/env node

import { cli } from "./cli.js";

cli().then(() => {
    process.exit(0);
});
