#!/usr/bin/env node

import "dotenv/config";
import { generateEnv } from "../generator/generator.js";
import { cliArguments, getArgument, printArguments } from "./arguments.js";
import { loadOverrides } from "./overrides.js";

(async () => {
    const args = process.argv.slice(2);

    const { longName, shortName } = cliArguments.help;

    const help = args.includes(longName) ?? args.includes(shortName);

    if (help) {
        printArguments();
    }

    const token = process.env.ENV_GEN_AZURE_TOKEN;

    if (!token) {
        console.error("Missing required environment variable: ENV_GEN_AZURE_TOKEN");
        process.exit(1);
    }

    const organisation = getArgument(args, "organisation");
    const project = getArgument(args, "project");
    const groupName = getArgument(args, "group");

    if (!organisation) {
        console.error(`Missing required argument: ${cliArguments.organisation.longName}`);
        process.exit(1);
    }
    if (!project) {
        console.error(`Missing required argument: ${cliArguments.project.longName}`);
        process.exit(1);
    }
    if (!groupName) {
        console.error(`Missing required argument: ${cliArguments.group.longName}`);
        process.exit(1);
    }

    const filename = getArgument(args, "filename");
    const overridesPath = getArgument(args, "overrides");

    const overrides = await loadOverrides(overridesPath);

    await generateEnv({
        azure: {
            token,
            organisation,
            project,
            groupName,
        },
        filename,
        overrides,
    });

    process.exit(0);
})();
