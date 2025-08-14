import path from "path";
import { pathToFileURL } from "url";

export const loadOverrides = async (filePath?: string) => {
    if (!filePath) {
        return undefined;
    }

    try {
        const resolvedPath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);

        const fileUrl = pathToFileURL(resolvedPath).href;

        const overrides = await import(fileUrl, { with: { type: "json" } });

        return overrides.default;
    } catch (err) {
        console.error(`Failed to load overrides from ${filePath}`);

        process.exit(1);
    }
};
