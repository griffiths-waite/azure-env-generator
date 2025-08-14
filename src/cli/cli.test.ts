import { beforeEach, describe, expect, it, vi } from "vitest";
import * as generator from "../generator/generator.js";
import { cli } from "./cli";
import * as overrides from "./overrides.js";

const originalArgv = process.argv.slice();

const runWithArgs = (args: string[]) => {
    process.argv = ["node", "cli.js", ...args];
    return cli();
};

describe("cli", () => {
    const generateEnvMock = vi.spyOn(generator, "generateEnv").mockResolvedValue(undefined);
    const overridesMock = vi.spyOn(overrides, "loadOverrides").mockResolvedValue(undefined);

    beforeEach(() => {
        vi.clearAllMocks();
        process.argv = originalArgv.slice();
        process.env.AZURE_ENV_GENERATOR_TOKEN = "test_token";
    });

    it("calls generateEnv when required arguments (short) are provided", async () => {
        await runWithArgs(["-o", "test_org", "-p", "test_project", "-g", "test_group"]);

        expect(generateEnvMock).toHaveBeenCalledWith({
            azure: {
                token: "test_token",
                organisation: "test_org",
                project: "test_project",
                groupName: "test_group",
            },
        });
    });

    it("calls generateEnv when required arguments (long) are provided", async () => {
        await runWithArgs(["--organisation", "test_org", "--project", "test_project", "--group", "test_group"]);

        expect(generateEnvMock).toHaveBeenCalledWith({
            azure: {
                token: "test_token",
                organisation: "test_org",
                project: "test_project",
                groupName: "test_group",
            },
        });
    });

    it("throws error when organisation argument not provided", async () => {
        const promise = runWithArgs(["--project", "test_project", "--group", "test_group"]);

        await expect(promise).rejects.toThrow("Missing required argument: --organisation");
    });

    it("throws error when project argument not provided", async () => {
        const promise = runWithArgs(["--organisation", "test_org", "--group", "test_group"]);

        await expect(promise).rejects.toThrow("Missing required argument: --project");
    });

    it("throws error when group argument not provided", async () => {
        const promise = runWithArgs(["--organisation", "test_org", "--project", "test_project"]);

        await expect(promise).rejects.toThrow("Missing required argument: --group");
    });

    it("throws error when token environment variable not provided", async () => {
        process.env.AZURE_ENV_GENERATOR_TOKEN = "";

        const promise = runWithArgs(["-o", "test_org", "-p", "test_project", "-g", "test_group"]);

        await expect(promise).rejects.toThrow("Missing required environment variable: AZURE_ENV_GENERATOR_TOKEN");
    });

    it("does not call generateEnvwhen help argument (short) provided", async () => {
        await runWithArgs(["-h"]);

        expect(generateEnvMock).not.toHaveBeenCalled();
    });

    it("does not call generateEnvwhen help argument (long) provided", async () => {
        await runWithArgs(["--help"]);

        expect(generateEnvMock).not.toHaveBeenCalled();
    });

    it("sets filename option if argument provided", async () => {
        await runWithArgs(["-o", "test_org", "-p", "test_project", "-g", "test_group", "-f", ".env.local"]);

        expect(generateEnvMock).toHaveBeenCalledWith({
            azure: {
                token: "test_token",
                organisation: "test_org",
                project: "test_project",
                groupName: "test_group",
            },
            filename: ".env.local",
        });
    });

    it("sets overrides option if argument provided", async () => {
        overridesMock.mockResolvedValueOnce({ TEST: "override_value" });

        await runWithArgs(["-o", "test_org", "-p", "test_project", "-g", "test_group", "-o", ".env.overrides.json"]);

        expect(generateEnvMock).toHaveBeenCalledWith({
            azure: {
                token: "test_token",
                organisation: "test_org",
                project: "test_project",
                groupName: "test_group",
            },
            overrides: { TEST: "override_value" },
        });
    });
});
