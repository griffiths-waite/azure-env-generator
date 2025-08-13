import fs from "fs";

export const getExistingEnvVariables = (filename: string) => {
    const envExists = fs.existsSync(filename);

    if (!envExists) {
        return [];
    }

    const env = fs.readFileSync(filename, "utf8");

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
