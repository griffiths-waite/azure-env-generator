import fs from "fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as azureClient from "../azure/client.js";
import { EnvGeneratorConfig, VariableGroups } from "../types";
import { generateEnv } from "./generator";

describe("generateEnv", () => {
    const mockFs = {
        existsSync: vi.spyOn(fs, "existsSync"),
        readFileSync: vi.spyOn(fs, "readFileSync"),
        writeFileSync: vi.spyOn(fs, "writeFileSync"),
    };

    const mockBaseFetch = vi.spyOn(azureClient, "baseFetch");

    const baseConfig = {
        azure: {
            token: "mocked_token",
            organisation: "mocked_organisation",
            project: "mocked_project",
            groupName: "mocked_variable_group",
        },
    } satisfies EnvGeneratorConfig;

    const variableGroups = {
        count: 1,
        value: [
            {
                id: 1,
                name: "mocked_variable_group",
                type: "Vsts",
                variables: {
                    IS_NOT_SECRET: { value: "this variable is not secret" },
                    IS_SECRET: { value: null, isSecret: true },
                },
            },
        ],
    } satisfies VariableGroups;

    beforeEach(() => {
        vi.clearAllMocks();

        mockFs.existsSync.mockReturnValue(false);
        mockFs.readFileSync.mockReturnValue("");
        mockFs.writeFileSync.mockReturnValue(undefined);

        mockBaseFetch.mockResolvedValue(variableGroups);
    });

    it("writes variables to .env", async () => {
        await generateEnv({ ...baseConfig });

        const expected = [
            "# mocked_variable_group Environment Variables",
            "IS_NOT_SECRET=this variable is not secret",
            "IS_SECRET=",
        ].join("\n");

        expect(mockFs.writeFileSync).toHaveBeenCalledWith(".env", expected, "utf8");
    });

    it("writes secret variable if it exists in current .env", async () => {
        mockFs.existsSync.mockReturnValue(true);
        mockFs.readFileSync.mockReturnValue("IS_SECRET=this variable is secret");

        await generateEnv({ ...baseConfig });

        const expected = [
            "# mocked_variable_group Environment Variables",
            "IS_NOT_SECRET=this variable is not secret",
            "IS_SECRET=this variable is secret",
        ].join("\n");

        expect(mockFs.writeFileSync).toHaveBeenCalledWith(".env", expected, "utf8");
    });

    it("uses override in place of variable group value when provided", async () => {
        await generateEnv({ ...baseConfig, overrides: { IS_NOT_SECRET: "this is an override" } });

        const expected = [
            "# mocked_variable_group Environment Variables",
            "IS_NOT_SECRET=this is an override",
            "IS_SECRET=",
        ].join("\n");

        expect(mockFs.writeFileSync).toHaveBeenCalledWith(".env", expected, "utf8");
    });

    it("uses override for new value when provided", async () => {
        await generateEnv({ ...baseConfig, overrides: { NEW_VALUE: "this is an override" } });

        const expected = [
            "# mocked_variable_group Environment Variables",
            "IS_NOT_SECRET=this variable is not secret",
            "NEW_VALUE=this is an override",
            "IS_SECRET=",
        ].join("\n");

        expect(mockFs.writeFileSync).toHaveBeenCalledWith(".env", expected, "utf8");
    });

    it("writes variables to configured filename", async () => {
        await generateEnv({ ...baseConfig, filename: ".env.custom" });

        const expected = [
            "# mocked_variable_group Environment Variables",
            "IS_NOT_SECRET=this variable is not secret",
            "IS_SECRET=",
        ].join("\n");

        expect(mockFs.writeFileSync).toHaveBeenCalledWith(".env.custom", expected, "utf8");
    });
});
