# azure-env-generator

Developer tool for generating .env files from Azure Variable Groups.

## Installation

```bash
npm install azure-env-generator
```

## Usage

You can use the generator either programmatically or via the CLI.

### Programmatic

To use the generator programmatically, you can import it and call the `generateEnv` function:

```typescript
import { generateEnv } from "azure-env-generator";

await generateEnv({
    azure: {
        token: "personal_access_token",
        organisation: "my_org",
        project: "my_project",
        groupName: "my_variable_group",
    },
    filename: ".env",
    overrides: {
        VARIABLE_NAME: "override_value",
    },
});
```

This will generate a `.env` file like this example:

```bash
VARIABLE_NAME=override_value
VARIABLE_FROM_GROUP=value_from_group
SECRET_VARIABLE=
```

Note that any secret variables will be left empty in the generated file. You can set them manually in the .env file and they will be persisted in future runs.

### CLI

Before using the CLI command, you must set the environment variable `AZURE_ENV_GENERATOR_TOKEN` with an Azure Personal Access Token (PAT).

This token must have the `Variable Groups (read)` permission.

The easiest way to set this variable is to create a `.env` file in the root of your project:

```bash
AZURE_ENV_GENERATOR_TOKEN=personal_access_token
```

Then to use the generator via the CLI, you can run the following command:

```bash
npm azure-env-generator --organisation my_org --project my_project --group my_variable_group
```

The full list of options are available via the `--help` flag:

```bash
npm azure-env-generator --help
```

### Configuration Options

You can configure the generator with the following options:

- `azure.token`: Your Azure Personal Access Token (PAT).
- `azure.organisation`: The organisation that contains the variable group.
- `azure.project`: The project that contains the variable group.
- `azure.groupName`: The name of the variable group to fetch.
- `filename`: The filename to write the generated environment variables to (default is `.env`).
- `overrides`: An object containing variable overrides or additional variables. If a variable is set to `null`, it will be fetched from the existing env file if it exists.

### Contributing

Contributions are welcome! Please open an issue or a pull request on GitHub.
