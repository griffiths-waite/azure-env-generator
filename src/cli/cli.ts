import { generateEnv } from "../generator/generator.js";
import { cliArguments, getArgument, printArguments } from "./arguments.js";
import { loadOverrides } from "./overrides.js";

export const cli = async () => {
    const args = process.argv.slice(2);

    const { longName, shortName } = cliArguments.help;

    const help = args.includes(longName) ?? args.includes(shortName);

    if (help) {
        printArguments();
    }

    const token = process.env.AZURE_ENV_GENERATOR_TOKEN;

    if (!token) {
        throw new Error("Missing required environment variable: AZURE_ENV_GENERATOR_TOKEN");
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
};
