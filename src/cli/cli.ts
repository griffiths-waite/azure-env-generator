import "dotenv/config.js";
import { generateEnv } from "../generator/generator.js";
import { cliArguments, getArgument, printArguments } from "./arguments.js";
import { loadOverrides } from "./overrides.js";

export const cliTokenKey = "AZURE_ENV_GENERATOR_TOKEN" as const;

export const cli = async () => {
    const args = process.argv.slice(2);

    const { longName, shortName } = cliArguments.help;

    const help = args.includes(longName) || args.includes(shortName);

    if (help) {
        return printArguments();
    }

    const token = process.env[cliTokenKey];

    if (!token) {
        throw new Error(`Missing required environment variable: ${cliTokenKey}`);
    }

    const organisation = getArgument(args, "organisation");
    const project = getArgument(args, "project");
    const groupName = getArgument(args, "group");

    if (!organisation) {
        throw new Error(`Missing required argument: ${cliArguments.organisation.longName}`);
    }
    if (!project) {
        throw new Error(`Missing required argument: ${cliArguments.project.longName}`);
    }
    if (!groupName) {
        throw new Error(`Missing required argument: ${cliArguments.group.longName}`);
    }

    const filename = getArgument(args, "filename");
    const overridesPath = getArgument(args, "overrides");

    const overrides = await loadOverrides(overridesPath);

    return await generateEnv({
        azure: {
            token,
            organisation,
            project,
            groupName,
        },
        filename,
        overrides,
    });
};
