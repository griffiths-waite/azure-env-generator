// This file is for testing the package locally. Do no push changes to this file to the repository.

import "dotenv/config";
import { generateEnv } from "../generator/generator.js";

(async () => {
    const token = process.env.ENV_GEN_AZURE_TOKEN;
    const organisation = process.env.ENV_GEN_AZURE_ORGANISATION;
    const project = process.env.ENV_GEN_AZURE_PROJECT;
    const groupName = process.env.ENV_GEN_AZURE_VARIABLE_GROUP_NAME;

    if (!token) {
        console.error("Missing required environment variable: ENV_GEN_AZURE_TOKEN");
        process.exit(1);
    }
    if (!organisation) {
        console.error("Missing required environment variable: ENV_GEN_AZURE_ORGANISATION");
        process.exit(1);
    }
    if (!project) {
        console.error("Missing required environment variable: ENV_GEN_AZURE_PROJECT");
        process.exit(1);
    }
    if (!groupName) {
        console.error("Missing required environment variable: ENV_GEN_AZURE_VARIABLE_GROUP_NAME");
        process.exit(1);
    }

    await generateEnv({
        azure: {
            token,
            organisation,
            project,
            groupName,
        },
        filename: ".env.generated",
    });
    process.exit(0);
})();
