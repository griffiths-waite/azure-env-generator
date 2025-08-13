/**
 * Configuration for the environment variable generator.
 */
export interface EnvGeneratorConfig {
    /**
     * Azure configuration for fetching variable groups.
     */
    azure: AzureConfig;
    /**
     * Optional overrides for environment variables.
     *
     * This can be used to override the values from the Azure variable group or to add variables that are not specified in the group.
     *
     *  If a variable override is set to null, it will be fetched from the existing .env file if it exists.
     */
    overrides?: Overrides;
    /**
     * The filename to write the generated environment variables to.
     *
     * @default ".env"
     */
    filename?: string;
}

export interface AzureConfig {
    /**
     * The personal access token used to authenticate the request.
     *
     * The token must have the 'Variable Groups (Read)' scope.
     */
    token: string;
    /**
     * The organisation that contains the variable group.
     */
    organisation: string;
    /**
     * The project that contains the variable group.
     */
    project: string;
    /**
     * The name of the variable group to fetch.
     */
    groupName: string;
}

export interface FetchOptions extends RequestInit {
    query?: Query;
    params?: Params;
}

export interface VariableGroups {
    count: number;
    value: {
        id: number;
        name: string;
        description?: string;
        type: string;
        variables: Record<
            string,
            {
                value: string | null;
                isSecret?: boolean;
            }
        >;
    }[];
}

type Query = Record<string, string | string[] | number | number[] | undefined | undefined[]>;

type Params = Record<string, string | number | boolean | undefined>;

type Overrides = Record<string, string | null>;
