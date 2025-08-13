import fs from "fs";

export const getExistingEnvVariables = () => {
    const envExists = fs.existsSync(".env");

    if (!envExists) {
        return [];
    }

    const env = fs.readFileSync(".env", "utf8");

    return env.split("\n");
};

export const getExistingEnvValue = (variables: string[], key: string) => {
    const prefix = key.toUpperCase() + "=";

    const existingVariable = variables.find((line) => line.startsWith(prefix));

    if (!existingVariable) {
        return "";
    }

    return existingVariable.substring(prefix.length);
};
