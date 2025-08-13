export type Query = Record<string, string | string[] | number | number[] | undefined | undefined[]>;

export type Params = Record<string, string | number | boolean | undefined>;

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
