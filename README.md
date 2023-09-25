# Cacti CLI

A Command Line Interface created in JavaScript for the ease of creation of Discord bots, Express servers, and regular projects.

## Installation

To use Cacti CLI, you'll need to have Node.js and npm installed. If you don't have them installed, you can download and install them from [nodejs.org](https://nodejs.org/).

Once you have Node.js and npm installed, you can install Cacti CLI globally using the following command:

```bash
npm install -g cacti-cli@latest
```

## How to Run

Running the Cacti CLI is easy. Just open your terminal and execute the following command:

```bash
npx cacti-cli
```

The CLI will guide you through the process of generating different types of projects. Here's how it works:

1. Choose the type of project you want to generate:

    - `ExpressJS Server`
    - `Discord Bot`
    - `Any NodeJS Project`

2. Answer whether you want to use `TypeScript` (Y/n).

3. Enter the name you want for your project.

Once you've provided all the necessary information, the CLI will proceed to set up your project based on your selections.

## Example: Creating a Discord Bot (TypeScript and JavaScript)

To create a Discord bot project, run the following command:

```bash
npx cacti-cli
```

Select "Discord Bot" as the project type and answer the prompts. You can choose to use TypeScript (Y/n), select the framework and then enter the name of your project.

The CLI will set up your Discord bot project, whether in TypeScript or JavaScript, according to your selections.

## Contributing

Contributions to Cacti CLI are welcome! If you encounter any issues, have suggestions, or want to contribute improvements, feel free to open issues and pull requests in this repository.

## License

This project is open source and available under the `MIT License`.
