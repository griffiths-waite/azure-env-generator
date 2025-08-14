import { CliArgument } from "../types";

export const cliArguments = {
    help: {
        longName: "--help",
        shortName: "-h",
        description: "Display help information.",
        required: false,
    },
    organisation: {
        longName: "--organisation",
        shortName: "-o",
        description: "The organisation that contains the variable group.",
        required: true,
    },
    project: {
        longName: "--project",
        shortName: "-p",
        description: "The project that contains the variable group.",
        required: true,
    },
    group: {
        longName: "--group",
        shortName: "-g",
        description: "The name of the variable group to fetch.",
        required: true,
    },
    filename: {
        longName: "--filename",
        shortName: "-f",
        description: "The filename to write the generated environment variables to.",
        required: false,
    },
    overrides: {
        longName: "--overrides",
        shortName: "-x",
        description: "Path to a JSON file of optional overrides for environment variables.",
        required: false,
    },
} as const satisfies Record<string, CliArgument>;

export const getArgument = (args: string[], argName: keyof typeof cliArguments) => {
    const { longName, shortName } = cliArguments[argName];

    const longIndex = args.indexOf(longName);

    if (longIndex > -1) {
        const value = args[longIndex + 1];

        if (value && !value.startsWith("-")) {
            return value;
        }
    }

    const shortIndex = args.indexOf(shortName);

    if (shortIndex > -1) {
        const value = args[shortIndex + 1];

        if (value && !value.startsWith("-")) {
            return value;
        }
    }

    return undefined;
};

export const printArguments = () => {
    console.log("Usage: azure-env-generator [options]");

    console.log("\nOptions:");

    Object.entries(cliArguments).forEach(([_, arg]) => {
        console.log(`  ${arg.shortName}, ${arg.longName}  ${arg.description}${arg.required ? " (required)" : ""}`);
    });

    process.exit(0);
};
