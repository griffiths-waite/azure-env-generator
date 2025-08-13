import "dotenv/config";

export const environmentVariables = [
    "ENV_GEN_AZURE_TOKEN",
    "ENV_GEN_AZURE_ORGANISATION",
    "ENV_GEN_AZURE_PROJECT",
    "ENV_GEN_AZURE_VARIABLE_GROUP_NAME",
] as const;

const getConfig = () => {
    const missing = environmentVariables.filter((variable) => !process.env[variable]);

    if (missing.length > 0) {
        throw new Error(`Missing environment variables: ${missing.join(", ")}.`);
    }

    const [token, organisation, project, groupName] = environmentVariables;

    return {
        token: process.env[token],
        organisation: process.env[organisation],
        project: process.env[project],
        groupName: process.env[groupName],
    };
};

export const config = getConfig();
