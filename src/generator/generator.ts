import fs from "fs";
import { baseFetch } from "../azure/client.js";
import { cliTokenKey } from "../cli/cli.js";
import { EnvGeneratorConfig, VariableGroups } from "../types.js";
import { getExistingEnvValue, getExistingEnvVariables } from "./utils.js";

/**
 * Generates a .env file using the Azure variable group specified in the configuration.
 *
 * Variables marked as secrets in Azure are fetched from the existing .env file if they are defined.
 *
 * @param config - Configuration for the environment variable generator.
 */
export const generateEnv = async (config: EnvGeneratorConfig) => {
    const overrides = config.overrides ?? {};
    const filename = config.filename ?? ".env";

    const variableGroups = await baseFetch<VariableGroups>(config.azure, "distributedtask/variablegroups", {
        method: "GET",
        query: { api_version: "7.2-preview.2", groupName: config.azure.groupName },
    });

    const [variableGroup] = variableGroups.value;

    if (!variableGroup) {
        throw new Error(`No variable group found with name: ${config.azure.groupName}`);
    }

    const existingVariables = getExistingEnvVariables(filename);

    // Add variable group entries
    const env = Object.entries(variableGroup.variables).map(([_key, { value, isSecret }]) => {
        const key = _key.toUpperCase();

        let variable = value;

        if (isSecret) {
            variable = getExistingEnvValue(existingVariables, key);
        }

        if (overrides[key] === null) {
            variable = getExistingEnvValue(existingVariables, key);
        }

        if (overrides[key]) {
            variable = overrides[key];
        }

        return `${key}=${variable}`;
    });

    // Add missing overrides
    Object.entries(overrides).forEach(([_key, value]) => {
        const key = _key.toUpperCase();

        if (!env.some((line) => line.startsWith(key + "="))) {
            let variable = value;

            if (value === null) {
                variable = getExistingEnvValue(existingVariables, key);
            }

            env.push(`${key}=${variable}`);
        }
    });

    // Add CLI token variable if needed
    const cliToken = getExistingEnvValue(existingVariables, cliTokenKey);

    if (cliToken && !env.some((line) => line.startsWith(cliTokenKey + "="))) {
        env.push(`${cliTokenKey}=${cliToken}`);
    }

    env.sort((a, b) => {
        const aValue = a.split("=")[1];
        const bValue = b.split("=")[1];

        if (!aValue && bValue) {
            return 1;
        }

        if (aValue && !bValue) {
            return -1;
        }

        return a.localeCompare(b);
    });

    env.unshift(`# ${config.azure.groupName} Environment Variables`);

    fs.writeFileSync(filename, env.join("\n"), "utf8");

    console.log(`Successfully created ${filename} file`);
};
