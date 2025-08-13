import { beforeEach, describe, expect, it, vi } from "vitest";
import { AzureConfig, VariableGroups } from "../types";
import { baseFetch, formatUrl } from "./client";

describe("formatUrl", () => {
    it("should format url", () => {
        const fullUrl = formatUrl("https://example.com/api/", "endpoint", {});

        expect(fullUrl).toBe("https://example.com/api/endpoint");
    });

    it("should handle url with leading slash", () => {
        const fullUrl = formatUrl("https://example.com/api/", "/endpoint", {});

        expect(fullUrl).toBe("https://example.com/api/endpoint");
    });

    it("should handle base url without leading slash", () => {
        const fullUrl = formatUrl("https://example.com/api", "endpoint", {});

        expect(fullUrl).toBe("https://example.com/api/endpoint");
    });

    it("should handle path parameter", () => {
        const fullUrl = formatUrl("https://example.com/api", "endpoint/:id", { params: { id: 123 } });

        expect(fullUrl).toBe("https://example.com/api/endpoint/123");
    });

    it("should handle query parameter", () => {
        const fullUrl = formatUrl("https://example.com/api", "endpoint", { query: { search: "test" } });

        expect(fullUrl).toBe("https://example.com/api/endpoint?search=test");
    });

    it("should handle multiple query parameters", () => {
        const fullUrl = formatUrl("https://example.com/api", "endpoint", {
            query: { search: "test", other: "random" },
        });

        expect(fullUrl).toBe("https://example.com/api/endpoint?search=test&other=random");
    });
});

describe("baseFetch", () => {
    const mockFetch = vi.spyOn(global, "fetch");

    const config = {
        token: "mocked_token",
        organisation: "mocked_organisation",
        project: "mocked_project",
        groupName: "mocked_variable_group",
    } satisfies AzureConfig;

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

        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => variableGroups,
        } as Response);
    });

    it("should fetch data and return json response", async () => {
        const response = await baseFetch(config, "/mocked-endpoint", {
            method: "GET",
            query: { api_version: "1.0", groupName: config.groupName },
        });

        expect(mockFetch).toHaveBeenCalledWith(
            "https://dev.azure.com/mocked_organisation/mocked_project/_apis/mocked-endpoint?api_version=1.0&groupName=mocked_variable_group",
            {
                method: "GET",
                headers: {
                    Authorization: expect.any(String),
                },
                query: { api_version: "1.0", groupName: config.groupName },
            },
        );

        expect(response).toEqual(variableGroups);
    });
});
