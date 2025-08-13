import { AzureConfig, FetchOptions } from "../types.js";

export const formatUrl = (baseUrl: string, url: string, options: FetchOptions): string => {
    const { query, params } = options;

    const fullUrl = new URL(url, baseUrl);

    Object.entries(query ?? {}).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((_value) => _value && fullUrl.searchParams.append(key, String(_value)));
        } else if (value) {
            fullUrl.searchParams.append(key, String(value));
        }
    });

    Object.entries(params ?? {}).forEach(([key, value]) => {
        if (value) {
            fullUrl.pathname = fullUrl.pathname.replace(`:${key}`, String(value));
        }
    });

    return fullUrl.toString();
};

export const baseFetch = async <ResponseType>(config: AzureConfig, url: string, options: FetchOptions) => {
    const baseUrl = `https://dev.azure.com/${config.organisation}/${config.project}/_apis/`;

    const fullUrl = formatUrl(baseUrl, url, options);

    const response = await fetch(fullUrl, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Basic ${Buffer.from(`:${config.token}`).toString("base64")}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch response from ${fullUrl}`);
    }

    return (await response.json()) as ResponseType;
};
