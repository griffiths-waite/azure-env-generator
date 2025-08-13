import fs from "fs";
import { baseFetch } from "./azure-client.js";
import { config, environmentVariables } from "./config.js";
import { VariableGroups } from "./types.js";
import { getExistingEnvValue, getExistingEnvVariables } from "./utils.js";

/**
 * Generates a .env file using the Azure variable group specified in the configuration. Variables marked as secrets in
 * Azure will be fetched from the existing .env file if they exist.
 *
 * @param overrides - An object containing environment variable overrides. This can be used to override the values from
 * the Azure variable group or to add variables not specified in Azure. If a value is set to null, it will use the
 * existing value from the .env file.
 *
 * Required environment variables:
 * - `ENV_GEN_AZURE_TOKEN`: The Azure DevOps personal access token. Requires the 'Variable Groups (Read)' scope.
 * - `ENV_GEN_AZURE_ORGANISATION`: The Azure DevOps organisation name.
 * - `ENV_GEN_AZURE_PROJECT`: The Azure DevOps project name.
 * - `ENV_GEN_AZURE_VARIABLE_GROUP_NAME`: The name of the Azure variable group to use.
 */
export const generateEnv = async (overrides: Record<string, string | null> = {}) => {
    const variableGroups = await baseFetch<VariableGroups>("distributedtask/variablegroups", {
        query: { api_version: "7.2-preview.2", groupName: config.groupName },
    });

    const [variableGroup] = variableGroups.value;

    if (!variableGroup) {
        throw new Error(`No variable group found with name: ${config.groupName}`);
    }

    const existingVariables = getExistingEnvVariables();

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

    env.unshift(`# ${config.groupName} Environment Variables`);
    env.push("\n# Env - Gen Package Environment Variables");

    // Add environment variables from the package config
    environmentVariables.forEach((key) => {
        const variable = getExistingEnvValue(existingVariables, key.toUpperCase());
        env.push(`${key.toUpperCase()}=${variable}`);
    });

    fs.writeFileSync(".env", env.join("\n"), "utf8");

    console.log("Successfully created .env file");
};
