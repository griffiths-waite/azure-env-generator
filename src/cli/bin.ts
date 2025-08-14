#!/usr/bin/env node

import "dotenv/config";
import { cli } from "./cli.js";

cli().then(() => {
    process.exit(0);
});
