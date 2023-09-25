#!/usr/bin/env node

import inquirer from "inquirer";
import chalkAnimation from "chalk-animation";
import { createSpinner } from "nanospinner";
import fs from "fs";
import { writeFile, readFile, mkdir } from "fs/promises";

const exec = (await import("child_process")).exec;

const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

let prompt;
let language;
let wrapper;

async function getType() {
    const _prompt = await inquirer.prompt({
        name: "prompt",
        type: "list",
        choices: [
            "ExpressJS Backend Server",
            "Discord Bot",
            "Any NodeJS Project",
        ],
        message: "What do you want to generate?",
    });

    const _language = await inquirer.prompt({
        name: "language",
        type: "confirm",
        message: "Do you want to use typescript?",
    });

    prompt = _prompt.prompt;
    language = _language.language;
}

async function callFunc() {
    switch (prompt) {
        case "ExpressJS Backend Server":
            if (language) {
                await expressWithTs();
            } else {
                await expressWithJS();
            }
            break;
        case "Discord Bot":
            const _wrapper = await inquirer.prompt({
                name: "wrapper",
                type: "list",
                choices: ["Discord.js", "Oceanic.js"],
                message: "What is the framework you want to use?",
            });

            wrapper = _wrapper.wrapper === "Discord.js" ? true : false;

            if (wrapper) {
                if (language) await discordTs();
                else await discordJS();
            } else {
                if (language) await oceanicTs();
                else await oceanicJS();
            }
            break;
        case "Any NodeJS Project":
            if (language) {
                await anyNode();
            } else {
                await anyNodeJS();
            }
            break;
    }
}

// typescript main EXPRESS-SERVER
async function expressWithTs() {
    let projectName;

    async function getName() {
        const answers = await inquirer.prompt({
            name: "proj_name",
            type: "input",
            message: "What should the project be called?",
            default() {
                return "untitled";
            },
        });

        projectName = answers.proj_name;
    }

    async function setupFolders() {
        const spinner = createSpinner("Setting up folder structure...").start();

        try {
            if (fs.existsSync(`./${projectName}`)) {
                spinner.error({
                    text: "That directory seems to already exist!",
                });
                process.exit(1);
            }

            await sleep();

            fs.mkdirSync(`./${projectName}`);
            fs.mkdirSync(`./${projectName}/src`);

            spinner.success({ text: "Successfully setup folder structure" });
        } catch (err) {
            spinner.error({ text: `Error: ${err}` });
            process.exit(1);
        }
    }

    async function initPackages() {
        const spinner = createSpinner("Initialising node project...").start();

        await sleep();
        exec(
            "npm init -y",
            { cwd: `./${projectName}` },
            (err, stdout, stderr) => {
                if (err !== null) {
                    console.log(err);
                    spinner.error({
                        text: "An error occured while initialising the project!",
                    });
                    process.exit(1);
                }
            }
        );

        spinner.success({ text: "Successfully initalised the packages!" });
    }

    async function installPackages() {
        const spinner = createSpinner("Installing all dependencies...").start();

        await sleep();

        exec(
            "npm i express dotenv ; npm i -D @types/node @types/express typescript rimraf nodemon",
            { cwd: `./${projectName}` },
            (err, stdout, stderr) => {
                if (err !== null) {
                    console.log(err);
                    spinner.error({
                        text: "An error occured while installing dev dependencies!",
                    });
                    process.exit(1);
                }
            }
        );

        spinner.success({ text: "Successfully installed all dependencies" });
    }

    async function addFiles() {
        const spinner = createSpinner("Adding important files...").start();

        await sleep();

        await writeFile(
            `./${projectName}/src/index.ts`,
            `import express from 'express';
import 'dotenv/config';

const app = express();

app.set('json spaces', 2);
app.use( express.json() );

app.listen(process.env.PORT, () => {
    console.log(\`The server is up and running on Port \${process.env.PORT}!\`);
});`
        ).catch((err) => {
            spinner.error({ text: `Error while adding index: ${err}` });
            process.exit(1);
        });

        await writeFile(`./${projectName}/.env`, "PORT=8085").catch((err) => {
            spinner.error({ text: `Error while adding .env: ${err}` });
            process.exit(1);
        });

        spinner.success({ text: "Successfully added the files!" });
    }

    async function initTypescript() {
        const spinner = createSpinner("Initialising typescript...").start();

        await sleep();

        try {
            await writeFile(
                `./${projectName}/tsconfig.json`,
                `{
    "compilerOptions": {
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "target": "ES2020",
        "sourceMap": true,
        "outDir": "dist",
        "resolveJsonModule": true,
        "esModuleInterop": true,
    },
    "include": ["src/**/*"]
}`
            ).then(() => {});
        } catch (err) {
            spinner.error({
                text: `Error while initialising typescript: ${err}`,
            });
            process.exit(1);
        }

        spinner.success({ text: "Successfully initialised typescript!" });
    }

    async function finalEdits() {
        const spinner = createSpinner("Doing final touches...").start();

        await sleep();

        try {
            const filePath = `./${projectName}/package.json`;
            const jsonData = await readFile(filePath, "utf8");
            const packageJson = await JSON.parse(jsonData);

            packageJson.scripts = {
                build: "rimraf ./dist/ && tsc",
                predev: "npm run build",
                dev: "tsc -w & nodemon ./dist/index.js",
                prestart: "npm run build",
                start: "node ./dist/index.js",
            };

            packageJson["type"] = "module";
            packageJson["main"] = "./dist/index.js";

            await writeFile(
                `./${projectName}/package.json`,
                JSON.stringify(packageJson, null, 2)
            );
        } catch (err) {
            spinner.error({ text: `Error while doing final touches: ${err}` });
            process.exit(1);
        }

        spinner.success({ text: "Successfully completed final edits!" });
    }

    await getName();
    await setupFolders();
    await initPackages();
    await installPackages();
    await addFiles();
    await initTypescript();
    await finalEdits();

    const rainbowTitle = chalkAnimation.rainbow(
        "Successfully setup expressjs using typescript!"
    );

    await sleep(3000);

    rainbowTitle.stop();
}

// javascript main EXPRESS-SERVER
async function expressWithJS() {
    let projectName;

    async function getName() {
        const answers = await inquirer.prompt({
            name: "proj_name",
            type: "input",
            message: "What should the project be called?",
            default() {
                return "untitled";
            },
        });

        projectName = answers.proj_name;
    }

    async function setupFolders() {
        const spinner = createSpinner("Setting up folder structure...").start();

        try {
            if (fs.existsSync(`./${projectName}`)) {
                spinner.error({
                    text: "That directory seems to already exist!",
                });
                process.exit(1);
            }

            await sleep();

            fs.mkdirSync(`./${projectName}`);
            fs.mkdirSync(`./${projectName}/src`);

            spinner.success({ text: "Successfully setup folder structure" });
        } catch (err) {
            spinner.error({ text: `Error: ${err}` });
            process.exit(1);
        }
    }

    async function initPackages() {
        const spinner = createSpinner("Initialising node project...").start();

        await sleep();
        exec(
            "npm init -y",
            { cwd: `./${projectName}` },
            (err, stdout, stderr) => {
                if (err !== null) {
                    console.log(err);
                    spinner.error({
                        text: "An error occured while initialising the project!",
                    });
                    process.exit(1);
                }
            }
        );

        spinner.success({ text: "Successfully initalised the packages!" });
    }

    async function installPackages() {
        const spinner = createSpinner("Installing all dependencies...").start();

        await sleep();

        exec(
            "npm i express dotenv",
            { cwd: `./${projectName}` },
            (err, stdout, stderr) => {
                if (err !== null) {
                    console.log(err);
                    spinner.error({
                        text: "An error occured while installing dev dependencies!",
                    });
                    process.exit(1);
                }
            }
        );

        spinner.success({ text: "Successfully installed all dependencies" });
    }

    async function addFiles() {
        const spinner = createSpinner("Adding important files...").start();

        await sleep();

        await writeFile(
            `./${projectName}/src/index.js`,
            `import express from 'express';
import 'dotenv/config';

const app = express();

app.set('json spaces', 2);
app.use( express.json() );

app.listen(process.env.PORT, () => {
    console.log(\`The server is up and running on Port \${process.env.PORT}!\`);
});`
        ).catch((err) => {
            spinner.error({ text: `Error while adding index: ${err}` });
            process.exit(1);
        });

        await writeFile(`./${projectName}/.env`, "PORT=8085").catch((err) => {
            spinner.error({ text: `Error while adding .env: ${err}` });
            process.exit(1);
        });

        spinner.success({ text: "Successfully added the files!" });
    }

    async function finalEdits() {
        const spinner = createSpinner("Doing final touches...").start();

        await sleep();

        try {
            const filePath = `./${projectName}/package.json`;
            const jsonData = await readFile(filePath, "utf8");
            const packageJson = await JSON.parse(jsonData);

            packageJson["type"] = "module";
            packageJson["main"] = "./src/index.js";

            await writeFile(
                `./${projectName}/package.json`,
                JSON.stringify(packageJson, null, 2)
            );
        } catch (err) {
            spinner.error({ text: `Error while doing final touches: ${err}` });
            process.exit(1);
        }

        spinner.success({ text: "Successfully completed final edits!" });
    }

    await getName();
    await setupFolders();
    await initPackages();
    await installPackages();
    await addFiles();
    await finalEdits();

    const rainbowTitle = chalkAnimation.rainbow(
        "Successfully setup an ExpressJS Server!"
    );

    await sleep(3000);

    rainbowTitle.stop();
}

// typescript discordjs discord bot
async function discordTs() {
    let projectName;

    async function getName() {
        const answers = await inquirer.prompt({
            name: "proj_name",
            type: "input",
            message: "What should the project be called?",
            default() {
                return "untitled";
            },
        });

        projectName = answers.proj_name;
    }

    async function setupFolders() {
        const spinner = createSpinner("Setting up folder structure...").start();

        try {
            if (fs.existsSync(`./${projectName}`)) {
                spinner.error({
                    text: "That directory seems to already exist!",
                });
                process.exit(1);
            }

            await sleep();

            fs.mkdirSync(`./${projectName}`);
            fs.mkdirSync(`./${projectName}/src`);

            spinner.success({ text: "Successfully setup folder structure" });
        } catch (err) {
            spinner.error({ text: `Error: ${err}` });
            process.exit(1);
        }
    }

    async function initPackages() {
        const spinner = createSpinner("Initialising node project...").start();

        await sleep();
        exec(
            "npm init -y",
            { cwd: `./${projectName}` },
            (err, stdout, stderr) => {
                if (err !== null) {
                    console.log(err);
                    spinner.error({
                        text: "An error occured while initialising the project!",
                    });
                    process.exit(1);
                }
            }
        );

        spinner.success({ text: "Successfully initalised the packages!" });
    }

    async function installPackages() {
        const spinner = createSpinner("Installing all dependencies...").start();

        await sleep();

        exec(
            "npm i discord.js dotenv ; npm i -D @types/node typescript rimraf nodemon",
            { cwd: `./${projectName}` },
            (err, stdout, stderr) => {
                if (err !== null) {
                    console.log(err);
                    spinner.error({
                        text: "An error occured while installing dependencies!",
                    });
                    process.exit(1);
                }
            }
        );

        spinner.success({ text: "Successfully installed all dependencies" });
    }

    async function addFiles() {
        const spinner = createSpinner(
            "Adding important files & folders..."
        ).start();

        await sleep();

        // src/index.ts
        await writeFile(
            `./${projectName}/src/index.ts`,
            `import 'dotenv/config';
import { GatewayIntentBits } from 'discord.js';
import { ExtendedClient } from './structures/Client.js';
import handleEvents from './handlers/handleEvents.js';
import handleCommands from './handlers/handleCommands.js';
import fs from "fs";

const client = new ExtendedClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
    ],
});

const eventPath = new URL('./events', import.meta.url).pathname;
const commandPath = new URL('./commands', import.meta.url).pathname;

const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync(commandPath);

client.commands = new Map();

(async () => {
    await handleEvents(client, eventFiles);
    await handleCommands(client, commandFolders, commandPath);

    client.login(process.env.TOKEN);
})();`
        ).catch((err) => {
            spinner.error({ text: `Error while adding index: ${err}` });
            process.exit(1);
        });

        // .env
        await writeFile(
            `./${projectName}/.env`,
            "TOKEN=PUT YOUR TOKEN HERE\nCLIENT_ID=PUT YOUR BOT ID HERE"
        ).catch((err) => {
            spinner.error({ text: `Error while adding .env: ${err}` });
            process.exit(1);
        });

        // handlers
        await mkdir(`./${projectName}/src/handlers`)
            .then(async () => {
                // command handler
                await writeFile(
                    `./${projectName}/src/handlers/handleCommands.ts`,
                    `import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import 'dotenv/config';
import fs from 'fs';
import { ExtendedClient } from '../structures/Client.js';

export default async (client: ExtendedClient, commandFolders: string[], path: string) => {
    client.commandArray = [];
    for (const commandFolder of commandFolders) {
        const commandFiles = fs.readdirSync(\`\${path}/\${commandFolder}\`).filter(file => {
            return file.endsWith('.js');
        });
        
        for (const file of commandFiles) {
            const command = await import(\`../commands/\${commandFolder}/\${file}\`);
            if (!command.default?.data) continue;
            if (!command.default?.execute) continue;

            client.commands.set(command.default?.data.name, command);
            client.commandArray.push(command.default?.data.toJSON());
        }
    }

    const rest = new REST({
        version: '10'
    }).setToken(process.env.TOKEN);

    (async () => {
        console.log(\`Started refreshing \${client.commandArray.length} application (/) commands.\`);
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID), {
                body: client.commandArray
            },
        ).catch((err: Error) => {
            console.error(err.message);
        });

        console.log(\`Successfully reloaded \${client.commandArray.length} application (/) commands.\`);
    })();
};`
                );

                // event handler
                await writeFile(
                    `./${projectName}/src/handlers/handleEvents.ts`,
                    `import { ExtendedClient } from "../structures/Client.js";

export default async (client: ExtendedClient, eventFiles: any) => {
    for (const file of eventFiles) {
        const event = await import(\`../events/\${file}\`);
        if (event.default?.once) {
            client.once(event.default?.name, (...args) => event.default?.execute(...args, client));
        } else {
            client.on(event.default?.name, (...args) => event.default?.execute(...args, client));
        }
    }
}`
                );
            })
            .catch((err) => {
                spinner.error({ text: `Error while adding handlers: ${err}` });
                process.exit(1);
            });

        // commands
        await mkdir(`./${projectName}/src/commands`)
            .then(async () => {
                // command folders
                await mkdir(`./${projectName}/src/commands/Dev`);
                await mkdir(`./${projectName}/src/commands/Feature`);
                await mkdir(`./${projectName}/src/commands/Fun`);
                await mkdir(`./${projectName}/src/commands/Misc`).then(
                    async () => {
                        await writeFile(
                            `./${projectName}/src/commands/Misc/ping.ts`,
                            `import { SlashCommandBuilder, messageLink } from "discord.js";
import { Command } from "../../structures/Command.js";
const wait = (await import('node:timers/promises')).setTimeout;

const ping: Command = {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Checks the bot latency."),

    async execute(interaction, client) {
        const msg = await interaction.reply({ content: \`Pong... 🏓\`, ephemeral: true, fetchReply: true });
        wait(2000);
        await interaction.editReply(\`API Latency: \${client.ws.ping}ms.\\nClient Latency: \${msg.createdTimestamp - interaction.createdTimestamp}ms.\`)
    }
}

export default ping;`
                        );
                    }
                );
            })
            .catch((err) => {
                spinner.error({ text: `Error while adding commands: ${err}` });
                process.exit(1);
            });

        // events
        await mkdir(`./${projectName}/src/events`)
            .then(async () => {
                await writeFile(
                    `./${projectName}/src/events/interactionCreate.ts`,
                    `import { Interaction } from 'discord.js';
import { Event } from '../structures/Event.js';
import { Command } from '../structures/Command.js';

const interactionCreate: Event = {
    name: 'interactionCreate',
    async execute(interaction: Interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return await interaction.reply({
            content: "Sorry, that is an outdated command! Please refresh your discord to get the latest commands.",
            ephemeral: true
        });
        
        try{
            await command.default?.execute(interaction, client);
        } catch (err) {
            console.log(err);
            await interaction.reply({
                content: 'There was an error while executing this command!', 
                ephemeral: true
            });
        } 
    }
};

export default interactionCreate;`
                );

                await writeFile(
                    `./${projectName}/src/events/ready.ts`,
                    `import { Client } from "discord.js"
import { Event } from "../structures/Event.js"
import 'dotenv/config'

const ready: Event = {
    name: 'ready',
    once: true,

    async execute(c: Client) {
        console.log(\`Ready! Logged in as \${c.user.tag}\`);
    }
}

export default ready;`
                );
            })
            .catch((err) => {
                spinner.error({ text: `Error while adding events: ${err}` });
                process.exit(1);
            });

        // Structures
        await mkdir(`./${projectName}/src/structures`)
            .then(async () => {
                // Command Struct
                await writeFile(
                    `./${projectName}/src/structures/Command.ts`,
                    `import { Client, CommandInteraction, Interaction, SlashCommandBuilder } from "discord.js";

export interface Command {
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup" | "addBooleanOption" | "addUserOption" | "addChannelOption" | "addRoleOption" | "addAttachmentOption" | "addMentionableOption" | "addStringOption" | "addIntegerOption" | "addNumberOption">;
    execute(interaction: CommandInteraction, client: Client): any;
}`
                );

                // Event Struct
                await writeFile(
                    `./${projectName}/src/structures/Event.ts`,
                    `export interface Event {
    name: string,
    once?: boolean,
    execute(...args: any): any;
}`
                );

                // Client (ExtendedClient) Struct
                await writeFile(
                    `./${projectName}/src/structures/Client.ts`,
                    `import { Client } from 'discord.js';

export class ExtendedClient extends Client {
    commandArray: any[];
    commands: Map<string, any>;
}`
                );
            })
            .catch((err) => {
                spinner.error({ text: `Error while adding events: ${err}` });
                process.exit(1);
            });

        spinner.success({ text: "Successfully added the files and folders!" });
    }

    async function initTypescript() {
        const spinner = createSpinner("Initialising typescript...").start();

        await sleep();

        try {
            await writeFile(
                `./${projectName}/tsconfig.json`,
                `{
    "compilerOptions": {
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "target": "ES2020",
        "sourceMap": true,
        "outDir": "dist",
        "resolveJsonModule": true,
        "esModuleInterop": true,
    },
    "include": ["src/**/*"]
}`
            ).then(() => {});
        } catch (err) {
            spinner.error({
                text: `Error while initialising typescript: ${err}`,
            });
            process.exit(1);
        }

        spinner.success({ text: "Successfully initialised typescript!" });
    }

    async function finalEdits() {
        const spinner = createSpinner("Doing final touches...").start();

        await sleep();

        try {
            const filePath = `./${projectName}/package.json`;
            const jsonData = await readFile(filePath, "utf8");
            const packageJson = await JSON.parse(jsonData);

            packageJson.scripts = {
                build: "rimraf ./dist/ && tsc",
                predev: "npm run build",
                dev: "tsc -w & nodemon ./dist/index.js",
                prestart: "npm run build",
                start: "node ./dist/index.js",
            };

            packageJson["type"] = "module";
            packageJson["main"] = "./dist/index.js";

            await writeFile(
                `./${projectName}/package.json`,
                JSON.stringify(packageJson, null, 2)
            );
        } catch (err) {
            spinner.error({ text: `Error while doing final touches: ${err}` });
            process.exit(1);
        }

        spinner.success({ text: "Successfully completed final edits!" });
    }

    await getName();
    await setupFolders();
    await initPackages();
    await installPackages();
    await addFiles();
    await initTypescript();
    await finalEdits();

    const rainbowTitle = chalkAnimation.rainbow(
        "Successfully setup a discord bot using typescript!"
    );

    await sleep(3000);

    rainbowTitle.stop();
}

// javascript discordjs discord bot
async function discordJS() {
    let projectName;

    async function getName() {
        const answers = await inquirer.prompt({
            name: "proj_name",
            type: "input",
            message: "What should the project be called?",
            default() {
                return "untitled";
            },
        });

        projectName = answers.proj_name;
    }

    async function setupFolders() {
        const spinner = createSpinner("Setting up folder structure...").start();

        try {
            if (fs.existsSync(`./${projectName}`)) {
                spinner.error({
                    text: "That directory seems to already exist!",
                });
                process.exit(1);
            }

            await sleep();

            fs.mkdirSync(`./${projectName}`);
            fs.mkdirSync(`./${projectName}/src`);

            spinner.success({ text: "Successfully setup folder structure" });
        } catch (err) {
            spinner.error({ text: `Error: ${err}` });
            process.exit(1);
        }
    }

    async function initPackages() {
        const spinner = createSpinner("Initialising node project...").start();

        await sleep();
        exec(
            "npm init -y",
            { cwd: `./${projectName}` },
            (err, stdout, stderr) => {
                if (err !== null) {
                    console.log(err);
                    spinner.error({
                        text: "An error occured while initialising the project!",
                    });
                    process.exit(1);
                }
            }
        );

        spinner.success({ text: "Successfully initalised the packages!" });
    }

    async function installPackages() {
        const spinner = createSpinner("Installing all dependencies...").start();

        await sleep();

        exec(
            "npm i discord.js dotenv",
            { cwd: `./${projectName}` },
            (err, stdout, stderr) => {
                if (err !== null) {
                    console.log(err);
                    spinner.error({
                        text: "An error occured while installing dependencies!",
                    });
                    process.exit(1);
                }
            }
        );

        spinner.success({ text: "Successfully installed all dependencies" });
    }

    async function addFiles() {
        const spinner = createSpinner(
            "Adding important files & folders..."
        ).start();

        await sleep();

        // src/index.js
        await writeFile(
            `./${projectName}/src/index.js`,
            `const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection } = require(\`discord.js\`);
const fs = require('fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] }); 

client.commands = new Collection();

require('dotenv').config();

const handlers = fs.readdirSync("./src/handlers").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
    for (handler of handlers) {
        require(\`./handlers/\${handler}\`)(client);
    }
    
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.TOKEN)
})();`
        ).catch((err) => {
            spinner.error({ text: `Error while adding index: ${err}` });
            process.exit(1);
        });

        // .env
        await writeFile(
            `./${projectName}/.env`,
            "TOKEN=PUT YOUR TOKEN HERE\nCLIENT_ID=PUT YOUR BOT ID HERE"
        ).catch((err) => {
            spinner.error({ text: `Error while adding .env: ${err}` });
            process.exit(1);
        });

        // handlers
        await mkdir(`./${projectName}/src/handlers`)
            .then(async () => {
                // command handler
                await writeFile(
                    `./${projectName}/src/handlers/handleCommands.js`,
                    `const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
require("dotenv").config();

const clientId = process.env.CLIENT_ID;

module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {
        client.commandArray = [];
        for (folder of commandFolders) {
            const commandFiles = fs.readdirSync(\`\${path}/\${folder}\`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(\`../commands/\${folder}/\${file}\`);
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());
            }
        }

        const rest = new REST({
            version: '9'
        }).setToken(process.env.TOKEN);

        (async () => {
            try {
                console.log(\`Started refreshing \${client.commandArray.length} application (/) commands.\`);

                await rest.put(
                    Routes.applicationCommands(clientId), {
                        body: client.commandArray
                    },
                );

                console.log(\`Successfully reloaded \${client.commandArray.length} application (/) commands.\`);
            } catch (error) {
                console.error(error);
            }
        })();
    };
};`
                );

                // event handler
                await writeFile(
                    `./${projectName}/src/handlers/handleEvents.js`,
                    `module.exports = (client) => {
    client.handleEvents = async (eventFiles, path) => {
        for (const file of eventFiles) {
            const event = require(\`../events/\${file}\`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    };
}`
                );
            })
            .catch((err) => {
                spinner.error({ text: `Error while adding handlers: ${err}` });
                process.exit(1);
            });

        // commands
        await mkdir(`./${projectName}/src/commands`)
            .then(async () => {
                // command folders
                await mkdir(`./${projectName}/src/commands/Dev`);
                await mkdir(`./${projectName}/src/commands/Feature`);
                await mkdir(`./${projectName}/src/commands/Fun`);
                await mkdir(`./${projectName}/src/commands/Misc`).then(
                    async () => {
                        await writeFile(
                            `./${projectName}/src/commands/Misc/ping.js`,
                            `const { SlashCommandBuilder } = require("discord.js");
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription("Checks the bot's ping"),

    async execute(interaction, client) {
        const msg = await interaction.reply({ content: \`Checking ping...\`, fetchReply: true });
        await wait(2000);
        await interaction.editReply(\`Client Ping: \${msg.createdTimestamp - interaction.createdTimestamp}ms\nWebsocket Heartbeat: \${client.ws.ping}ms\`);
    }
}`
                        );
                    }
                );
            })
            .catch((err) => {
                spinner.error({ text: `Error while adding commands: ${err}` });
                process.exit(1);
            });

        // events
        await mkdir(`./${projectName}/src/events`)
            .then(async () => {
                await writeFile(
                    `./${projectName}/src/events/interactionCreate.js`,
                    `module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return
        
        try{


            await command.execute(interaction, client);
        } catch (error) {
            console.log(error);
            await interaction.reply({
                content: 'There was an error while executing this command!', 
                ephemeral: true
            });
        } 

    },
    


};`
                );

                await writeFile(
                    `./${projectName}/src/events/ready.js`,
                    `module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(\`Ready! Logged in as \${client.user.tag}\`);

        async function pickPresence () {
            const option = Math.floor(Math.random() * statusArray.length);

            try {
                await client.user.setPresence({
                    activities: [
                        {
                            name: statusArray[option].content,
                            type: statusArray[option].type,

                        },
                    
                    ],

                    status: statusArray[option].status
                })
            } catch (error) {
                console.error(error);
            }
        }
    },
};`
                );
            })
            .catch((err) => {
                spinner.error({ text: `Error while adding events: ${err}` });
                process.exit(1);
            });

        spinner.success({ text: "Successfully added the files and folders!" });
    }

    async function finalEdits() {
        const spinner = createSpinner("Doing final touches...").start();

        await sleep();

        try {
            const filePath = `./${projectName}/package.json`;
            const jsonData = await readFile(filePath, "utf8");
            const packageJson = await JSON.parse(jsonData);

            packageJson["main"] = "./src/index.js";

            await writeFile(
                `./${projectName}/package.json`,
                JSON.stringify(packageJson, null, 2)
            );
        } catch (err) {
            spinner.error({ text: `Error while doing final touches: ${err}` });
            process.exit(1);
        }

        spinner.success({ text: "Successfully completed final edits!" });
    }

    await getName();
    await setupFolders();
    await initPackages();
    await installPackages();
    await addFiles();
    await finalEdits();

    const rainbowTitle = chalkAnimation.rainbow(
        "Successfully setup a discord bot using Javascript!"
    );

    await sleep(3000);

    rainbowTitle.stop();
}

// typescript oceanicjs discord bot
async function oceanicTs() {
    let projectName;

    async function getName() {
        const answers = await inquirer.prompt({
            name: "proj_name",
            type: "input",
            message: "What should the project be called?",
            default() {
                return "untitled";
            },
        });

        projectName = answers.proj_name;
    }

    async function setupFolders() {
        const spinner = createSpinner("Setting up folder structure...").start();

        try {
            if (fs.existsSync(`./${projectName}`)) {
                spinner.error({
                    text: "That directory seems to already exist!",
                });
                process.exit(1);
            }

            await sleep();

            fs.mkdirSync(`./${projectName}`);
            fs.mkdirSync(`./${projectName}/src`);

            spinner.success({ text: "Successfully setup folder structure" });
        } catch (err) {
            spinner.error({ text: `Error: ${err}` });
            process.exit(1);
        }
    }

    async function initPackages() {
        const spinner = createSpinner("Initialising node project...").start();

        await sleep();
        exec(
            "npm init -y",
            { cwd: `./${projectName}` },
            (err, stdout, stderr) => {
                if (err !== null) {
                    console.log(err);
                    spinner.error({
                        text: "An error occured while initialising the project!",
                    });
                    process.exit(1);
                }
            }
        );

        spinner.success({ text: "Successfully initalised the packages!" });
    }

    async function installPackages() {
        const spinner = createSpinner("Installing all dependencies...").start();

        await sleep();

        exec(
            "npm i oceanic.js dotenv better-sqlite3 ; npm i -D @types/better-sqlite3 @types/node typescript rimraf nodemon",
            { cwd: `./${projectName}` },
            (err, stdout, stderr) => {
                if (err !== null) {
                    console.log(err);
                    spinner.error({
                        text: "An error occured while installing dependencies!",
                    });
                    process.exit(1);
                }
            }
        );

        spinner.success({ text: "Successfully installed all dependencies" });
    }

    async function addFiles() {
        const spinner = createSpinner(
            "Adding important files & folders..."
        ).start();

        await sleep();

        // src/index.ts
        await writeFile(
            `./${projectName}/src/index.ts`,
            `import 'dotenv/config';
import { ExtendedClient } from './structures/Client.js';
import handleEvents from './handlers/handleEvents.js';
import handleCommands from './handlers/handleCommands.js';
import fs from "fs";
import BetterSqlite3 from "better-sqlite3";

const client = new ExtendedClient({
    auth: \`Bot \${process.env.TOKEN}\`,
    gateway: {
        intents: 3276799,
    },
});

const db = new BetterSqlite3("bot.db");
client.db = db;

db.prepare("CREATE TABLE IF NOT EXISTS exampleTable ( col1 TEXT, col2 INTEGER )").run();
// consider learning sql language to improve this db.

const eventPath = new URL('./events', import.meta.url).pathname;
const commandPath = new URL('./commands', import.meta.url).pathname;

const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync(commandPath);

client.commands = new Map();

await handleEvents(client, eventFiles);
await handleCommands(client, commandFolders, commandPath);

client.connect();
`
        ).catch((err) => {
            spinner.error({ text: `Error while adding index: ${err}` });
            process.exit(1);
        });

        // .env
        await writeFile(
            `./${projectName}/.env`,
            "TOKEN=PUT YOUR TOKEN HERE\nCLIENT_ID=PUT YOUR BOT ID HERE"
        ).catch((err) => {
            spinner.error({ text: `Error while adding .env: ${err}` });
            process.exit(1);
        });

        // handlers
        await mkdir(`./${projectName}/src/handlers`)
            .then(async () => {
                // command handler
                await writeFile(
                    `./${projectName}/src/handlers/handleCommands.ts`,
                    `import "dotenv/config";
import fs from "fs";
import { ExtendedClient } from "../structures/Client.js";
import { ApplicationCommandTypes } from "oceanic.js";

export default async (
    client: ExtendedClient,
    commandFolders: string[],
    path: string
) => {
    client.commandArray = [];
    for (const commandFolder of commandFolders) {
        const commandFiles = fs
            .readdirSync(\`\${path}/\${commandFolder}\`)
            .filter((file) => {
                return file.endsWith(".js");
            });

        for (const file of commandFiles) {
            const command = await import(
                \`../commands/\${commandFolder}/\${file}\`
            );
            if (!command.default?.data) continue;
            if (!command.default?.execute) continue;

            client.commands.set(command.default?.data.name, command);
            client.commandArray.push(command.default?.data);
        }
    }

    (async () => {
        console.log(
            \`Started refreshing \${client.commandArray.length} application (/) commands.\`
        );

        await client.restMode();

        await client.application.bulkEditGlobalCommands(client.commandArray)

        console.log(
            \`Successfully reloaded \${client.commandArray.length} application (/) commands.\`
        );
    })();
};
                    `
                );

                // event handler
                await writeFile(
                    `./${projectName}/src/handlers/handleEvents.ts`,
                    `import { ExtendedClient } from "../structures/Client.js";

export default async (client: ExtendedClient, eventFiles: any) => {
    for (const file of eventFiles) {
        const event = await import(\`../events/\${file}\`);
        if (event.default?.once) {
            client.once(event.default?.name, (...args) => event.default?.execute(...args, client));
        } else {
            client.on(event.default?.name, (...args) => event.default?.execute(...args, client));
        }
    }
}`
                );
            })
            .catch((err) => {
                spinner.error({ text: `Error while adding handlers: ${err}` });
                process.exit(1);
            });

        // commands
        await mkdir(`./${projectName}/src/commands`)
            .then(async () => {
                // command folders
                await mkdir(`./${projectName}/src/commands/Dev`);
                await mkdir(`./${projectName}/src/commands/Feature`);
                await mkdir(`./${projectName}/src/commands/Fun`);
                await mkdir(`./${projectName}/src/commands/Misc`).then(
                    async () => {
                        await writeFile(
                            `./${projectName}/src/commands/Misc/ping.ts`,
                            `import { ApplicationCommandTypes } from "oceanic.js";
import { Command } from "../../structures/Command.js";
const ping: Command = {
data: {
    name: "ping",
    description: "A simple ping pong command.",
    type: ApplicationCommandTypes.CHAT_INPUT,
},

async execute(interaction, client) {
    await interaction.createMessage({ embeds: [{
        color: 0x00ff00,
        title: "Pong! 🏓",
        description: "The bot is online!",
        footer: {
            text: "made by notcacti",
        },
        timestamp: new Date().toISOString(),
    }]});
},
}

export default ping`
                        );
                    }
                );
            })
            .catch((err) => {
                spinner.error({ text: `Error while adding commands: ${err}` });
                process.exit(1);
            });

        // events
        await mkdir(`./${projectName}/src/events`)
            .then(async () => {
                await writeFile(
                    `./${projectName}/src/events/interactionCreate.ts`,
                    `import { InteractionTypes, CommandInteraction, MessageFlags } from 'oceanic.js';
import { Event } from '../structures/Event.js';

const interactionCreate: Event = {
    name: 'interactionCreate',
    async execute(interaction: CommandInteraction, client) {
        if (interaction.type !== InteractionTypes.APPLICATION_COMMAND) return;

        const command = client.commands.get(interaction.data.name);

        if (!command) return await interaction.createMessage({
            content: "Sorry, that is an outdated command! Please refresh your discord to get the latest commands.",
            flags: MessageFlags.EPHEMERAL,
        });
        
        try{
            await command.default?.execute(interaction, client);
        } catch (err) {
            console.log(err);
            await interaction.createMessage({
                content: 'There was an error while executing this command!', 
                flags: MessageFlags.EPHEMERAL,
            });
        } 
    }
};

export default interactionCreate;`
                );

                await writeFile(
                    `./${projectName}/src/events/ready.ts`,
                    `import { Event } from "../structures/Event.js";
import { ExtendedClient } from "../structures/Client.js";
import { ActivityTypes } from "oceanic.js";
import "dotenv/config";

const ready: Event = {
    name: "ready",
    once: true,

    async execute(client: ExtendedClient) {
        console.log(
            \`Ready! Logged in as \${client.user.tag}\`
        );
    },
};

export default ready;`
                );

                await writeFile(
                    `./${projectName}/src/events/error.ts`,
                    `import { Event } from "../structures/Event.js";

const error: Event = {
    name: "error",
    
    async execute(e) {
        console.error("Client Error:", e);
        return;
    },
}

export default error;`
                );
            })
            .catch((err) => {
                spinner.error({ text: `Error while adding events: ${err}` });
                process.exit(1);
            });

        // Structures
        await mkdir(`./${projectName}/src/structures`)
            .then(async () => {
                // Command Struct
                await writeFile(
                    `./${projectName}/src/structures/Command.ts`,
                    `import {
    CommandInteraction,
    CreateApplicationCommandOptions,
} from "oceanic.js";
import { ExtendedClient } from "./Client.js";

export interface Command {
    data: CreateApplicationCommandOptions;
    execute(interaction: CommandInteraction, client: ExtendedClient): any;
}`
                );

                // Event Struct
                await writeFile(
                    `./${projectName}/src/structures/Event.ts`,
                    `import { ClientEvents } from "oceanic.js";

export interface Event {
    name: keyof ClientEvents,
    once?: boolean,
    execute(...args: any): any;
}`
                );

                // Client (ExtendedClient) Struct
                await writeFile(
                    `./${projectName}/src/structures/Client.ts`,
                    `import { Client } from "oceanic.js";
import BetterSqlite3 from "better-sqlite3";

export class ExtendedClient extends Client {
    commandArray: any[];
    commands: Map<string, any>;
    db: BetterSqlite3.Database;
}`
                );
            })
            .catch((err) => {
                spinner.error({ text: `Error while adding events: ${err}` });
                process.exit(1);
            });

        spinner.success({ text: "Successfully added the files and folders!" });
    }

    async function initTypescript() {
        const spinner = createSpinner("Initialising typescript...").start();

        await sleep();

        try {
            await writeFile(
                `./${projectName}/tsconfig.json`,
                `{
"compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2020",
    "outDir": "dist",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "strict": true,
    "strictPropertyInitialization": false,
    "strictNullChecks": false
},
"include": ["src/**/*"]
}`
            ).then(() => {});
        } catch (err) {
            spinner.error({
                text: `Error while initialising typescript: ${err}`,
            });
            process.exit(1);
        }

        spinner.success({ text: "Successfully initialised typescript!" });
    }

    async function finalEdits() {
        const spinner = createSpinner("Doing final touches...").start();

        await sleep();

        try {
            const filePath = `./${projectName}/package.json`;
            const jsonData = await readFile(filePath, "utf8");
            const packageJson = await JSON.parse(jsonData);

            packageJson.scripts = {
                build: "rimraf ./dist/ && tsc",
                predev: "npm run build",
                dev: "tsc -w & nodemon ./dist/index.js",
                prestart: "npm run build",
                start: "node ./dist/index.js",
            };

            packageJson["type"] = "module";
            packageJson["main"] = "./dist/index.js";

            await writeFile(
                `./${projectName}/package.json`,
                JSON.stringify(packageJson, null, 2)
            );
        } catch (err) {
            spinner.error({ text: `Error while doing final touches: ${err}` });
            process.exit(1);
        }

        spinner.success({ text: "Successfully completed final edits!" });
    }

    await getName();
    await setupFolders();
    await initPackages();
    await installPackages();
    await addFiles();
    await initTypescript();
    await finalEdits();

    const rainbowTitle = chalkAnimation.rainbow(
        "Successfully setup a discord bot (oceanic.js) using typescript!"
    );

    await sleep(3000);

    rainbowTitle.stop();
}

// javascript oceanicjs discord bot
async function oceanicJS() {
    let projectName;

    async function getName() {
        const answers = await inquirer.prompt({
            name: "proj_name",
            type: "input",
            message: "What should the project be called?",
            default() {
                return "untitled";
            },
        });

        projectName = answers.proj_name;
    }

    async function setupFolders() {
        const spinner = createSpinner("Setting up folder structure...").start();

        try {
            if (fs.existsSync(`./${projectName}`)) {
                spinner.error({
                    text: "That directory seems to already exist!",
                });
                process.exit(1);
            }

            await sleep();

            fs.mkdirSync(`./${projectName}`);
            fs.mkdirSync(`./${projectName}/src`);

            spinner.success({ text: "Successfully setup folder structure" });
        } catch (err) {
            spinner.error({ text: `Error: ${err}` });
            process.exit(1);
        }
    }

    async function initPackages() {
        const spinner = createSpinner("Initialising node project...").start();

        await sleep();
        exec(
            "npm init -y",
            { cwd: `./${projectName}` },
            (err, stdout, stderr) => {
                if (err !== null) {
                    console.log(err);
                    spinner.error({
                        text: "An error occured while initialising the project!",
                    });
                    process.exit(1);
                }
            }
        );

        spinner.success({ text: "Successfully initalised the packages!" });
    }

    async function installPackages() {
        const spinner = createSpinner("Installing all dependencies...").start();

        await sleep();

        exec(
            "npm i oceanic.js dotenv better-sqlite3 ; npm i -D nodemon",
            { cwd: `./${projectName}` },
            (err, stdout, stderr) => {
                if (err !== null) {
                    console.log(err);
                    spinner.error({
                        text: "An error occured while installing dependencies!",
                    });
                    process.exit(1);
                }
            }
        );

        spinner.success({ text: "Successfully installed all dependencies" });
    }

    async function addFiles() {
        const spinner = createSpinner(
            "Adding important files & folders..."
        ).start();

        await sleep();

        // src/index.js
        await writeFile(
            `./${projectName}/src/index.js`,
            `import 'dotenv/config';
import handleEvents from './handlers/handleEvents.js';
import handleCommands from './handlers/handleCommands.js';
import fs from "fs";
import BetterSqlite3 from "better-sqlite3";
import { Client } from "oceanic.js";

const client = new Client({
    auth: \`Bot \${process.env.TOKEN}\`,
    gateway: {
        intents: 3276799,
    },
});

const db = new BetterSqlite3("bot.db");
client.db = db;

db.prepare("CREATE TABLE IF NOT EXISTS exampleTable ( col1 TEXT, col2 INTEGER )").run();
// consider learning sql language to improve this db.

const eventPath = new URL('./events', import.meta.url).pathname;
const commandPath = new URL('./commands', import.meta.url).pathname;

const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync(commandPath);

client.commands = new Map();

await handleEvents(client, eventFiles);
await handleCommands(client, commandFolders, commandPath);

client.connect();
`
        ).catch((err) => {
            spinner.error({ text: `Error while adding index: ${err}` });
            process.exit(1);
        });

        // .env
        await writeFile(
            `./${projectName}/.env`,
            "TOKEN=PUT YOUR TOKEN HERE\nCLIENT_ID=PUT YOUR BOT ID HERE"
        ).catch((err) => {
            spinner.error({ text: `Error while adding .env: ${err}` });
            process.exit(1);
        });

        // handlers
        await mkdir(`./${projectName}/src/handlers`)
            .then(async () => {
                // command handler
                await writeFile(
                    `./${projectName}/src/handlers/handleCommands.js`,
                    `import "dotenv/config";
import fs from "fs";
import { ApplicationCommandTypes, Client } from "oceanic.js";

export default async (
    client,
    commandFolders,
    path
) => {
    client.commandArray = [];
    for (const commandFolder of commandFolders) {
        const commandFiles = fs
            .readdirSync(\`\${path}/\${commandFolder}\`)
            .filter((file) => {
                return file.endsWith(".js");
            });

        for (const file of commandFiles) {
            const command = await import(
                \`../commands/\${commandFolder}/\${file}\`
            );
            if (!command.default?.data) continue;
            if (!command.default?.execute) continue;

            client.commands.set(command.default?.data.name, command);
            client.commandArray.push(command.default?.data);
        }
    }

    (async () => {
        console.log(
            \`Started refreshing \${client.commandArray.length} application (/) commands.\`
        );

        await client.restMode();

        await client.application.bulkEditGlobalCommands(client.commandArray)

        console.log(
            \`Successfully reloaded \${client.commandArray.length} application (/) commands.\`
        );
    })();
};
                    `
                );

                // event handler
                await writeFile(
                    `./${projectName}/src/handlers/handleEvents.js`,
                    `import { Client } from "oceanic.js";

export default async (client, eventFiles) => {
    for (const file of eventFiles) {
        const event = await import(\`../events/\${file}\`);
        if (event.default?.once) {
            client.once(event.default?.name, (...args) => event.default?.execute(...args, client));
        } else {
            client.on(event.default?.name, (...args) => event.default?.execute(...args, client));
        }
    }
}`
                );
            })
            .catch((err) => {
                spinner.error({ text: `Error while adding handlers: ${err}` });
                process.exit(1);
            });

        // commands
        await mkdir(`./${projectName}/src/commands`)
            .then(async () => {
                // command folders
                await mkdir(`./${projectName}/src/commands/Dev`);
                await mkdir(`./${projectName}/src/commands/Feature`);
                await mkdir(`./${projectName}/src/commands/Fun`);
                await mkdir(`./${projectName}/src/commands/Misc`).then(
                    async () => {
                        await writeFile(
                            `./${projectName}/src/commands/Misc/ping.js`,
                            `import { ApplicationCommandTypes } from "oceanic.js";
const ping = {
    data: {
        name: "ping",
        description: "A simple ping pong command.",
        type: ApplicationCommandTypes.CHAT_INPUT,
    },

    async execute(interaction, client) {
        await interaction.createMessage({ embeds: [{
            color: 0x00ff00,
            title: "Pong! 🏓",
            description: "The bot is online!",
            footer: {
                text: "made by notcacti",
            },
            timestamp: new Date().toISOString(),
        }]});
    },
}

export default ping`
                        );
                    }
                );
            })
            .catch((err) => {
                spinner.error({ text: `Error while adding commands: ${err}` });
                process.exit(1);
            });

        // events
        await mkdir(`./${projectName}/src/events`)
            .then(async () => {
                await writeFile(
                    `./${projectName}/src/events/interactionCreate.js`,
                    `import { InteractionTypes, CommandInteraction, MessageFlags } from 'oceanic.js';
const interactionCreate = {
    name: 'interactionCreate',
    async execute(interaction: CommandInteraction, client) {
        if (interaction.type !== InteractionTypes.APPLICATION_COMMAND) return;

        const command = client.commands.get(interaction.data.name);

        if (!command) return await interaction.createMessage({
            content: "Sorry, that is an outdated command! Please refresh your discord to get the latest commands.",
            flags: MessageFlags.EPHEMERAL,
        });
        
        try{
            await command.default?.execute(interaction, client);
        } catch (err) {
            console.log(err);
            await interaction.createMessage({
                content: 'There was an error while executing this command!', 
                flags: MessageFlags.EPHEMERAL,
            });
        } 
    }
};

export default interactionCreate;`
                );

                await writeFile(
                    `./${projectName}/src/events/ready.js`,
                    `import { Client } from "oceanic.js";
import { ActivityTypes } from "oceanic.js";
import "dotenv/config";

const ready = {
    name: "ready",
    once: true,

    async execute(client) {
        console.log(
            \`Ready! Logged in as \${client.user.tag}\`
        );
    },
};

export default ready;`
                );

                await writeFile(
                    `./${projectName}/src/events/error.js`,
                    `const error = {
    name: "error",
    
    async execute(e) {
        console.error("Client Error:", e);
        return;
    },
}

export default error;`
                );
            })
            .catch((err) => {
                spinner.error({ text: `Error while adding events: ${err}` });
                process.exit(1);
            });

        spinner.success({ text: "Successfully added the files and folders!" });
    }

    async function finalEdits() {
        const spinner = createSpinner("Doing final touches...").start();

        await sleep();

        try {
            const filePath = `./${projectName}/package.json`;
            const jsonData = await readFile(filePath, "utf8");
            const packageJson = await JSON.parse(jsonData);

            packageJson.scripts = {
                dev: "nodemon src/index.js",
                start: "node src/index.js",
            };

            packageJson["type"] = "module";
            packageJson["main"] = "src/index.js";

            await writeFile(
                `./${projectName}/package.json`,
                JSON.stringify(packageJson, null, 2)
            );
        } catch (err) {
            spinner.error({ text: `Error while doing final touches: ${err}` });
            process.exit(1);
        }

        spinner.success({ text: "Successfully completed final edits!" });
    }

    await getName();
    await setupFolders();
    await initPackages();
    await installPackages();
    await addFiles();
    await finalEdits();

    const rainbowTitle = chalkAnimation.rainbow(
        "Successfully setup a discord bot (oceanic.js) using javascript!"
    );

    await sleep(3000);

    rainbowTitle.stop();
}

// typescript main any node project
async function anyNode() {
    let projectName;

    async function getName() {
        const answers = await inquirer.prompt({
            name: "proj_name",
            type: "input",
            message: "What should the project be called?",
            default() {
                return "untitled";
            },
        });

        projectName = answers.proj_name;
    }

    async function setupFolders() {
        const spinner = createSpinner("Setting up folder structure...").start();

        try {
            if (fs.existsSync(`./${projectName}`)) {
                spinner.error({
                    text: "That directory seems to already exist!",
                });
                process.exit(1);
            }

            await sleep();

            fs.mkdirSync(`./${projectName}`);
            fs.mkdirSync(`./${projectName}/src`);

            spinner.success({ text: "Successfully setup folder structure" });
        } catch (err) {
            spinner.error({ text: `Error: ${err}` });
            process.exit(1);
        }
    }

    async function initPackages() {
        const spinner = createSpinner("Initialising node project...").start();

        await sleep();
        exec(
            "npm init -y",
            { cwd: `./${projectName}` },
            (err, stdout, stderr) => {
                if (err !== null) {
                    console.log(err);
                    spinner.error({
                        text: "An error occured while initialising the project!",
                    });
                    process.exit(1);
                }
            }
        );

        spinner.success({ text: "Successfully initalised the project!" });
    }

    async function installPackages() {
        const spinner = createSpinner("Installing all dependencies...").start();

        await sleep();

        exec(
            "npm i -D @types/node typescript rimraf nodemon",
            { cwd: `./${projectName}` },
            (err, stdout, stderr) => {
                if (err !== null) {
                    console.log(err);
                    spinner.error({
                        text: "An error occured while installing dev dependencies!",
                    });
                    process.exit(1);
                }
            }
        );

        spinner.success({ text: "Successfully installed all dependencies" });
    }

    async function initTypescript() {
        const spinner = createSpinner("Initialising typescript...").start();

        await sleep();

        try {
            await writeFile(
                `./${projectName}/tsconfig.json`,
                `{
    "compilerOptions": {
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "target": "ES2020",
        "sourceMap": true,
        "outDir": "dist",
        "resolveJsonModule": true,
        "esModuleInterop": true,
    },
    "include": ["src/**/*"]
}`
            ).then(() => {});
        } catch (err) {
            spinner.error({
                text: `Error while initialising typescript: ${err}`,
            });
            process.exit(1);
        }

        spinner.success({ text: "Successfully initialised typescript!" });
    }

    async function finalEdits() {
        const spinner = createSpinner("Doing final touches...").start();

        await sleep();

        try {
            const filePath = `./${projectName}/package.json`;
            const jsonData = await readFile(filePath, "utf8");
            const packageJson = await JSON.parse(jsonData);

            packageJson.scripts = {
                build: "rimraf ./dist/ && tsc",
                predev: "npm run build",
                dev: "tsc -w & nodemon ./dist/index.js",
                prestart: "npm run build",
                start: "node ./dist/index.js",
            };

            packageJson["type"] = "module";
            packageJson["main"] = "./dist/index.js";

            await writeFile(
                `./${projectName}/package.json`,
                JSON.stringify(packageJson, null, 2)
            );

            await writeFile(
                `./${projectName}/src/index.ts`,
                `// run "npm start" to start (or) "npm run dev" for hot reloads.\nconsole.log('Hello, World!');`
            );
        } catch (err) {
            spinner.error({ text: `Error while doing final touches: ${err}` });
            process.exit(1);
        }

        spinner.success({ text: "Successfully completed final edits!" });
    }

    await getName();
    await setupFolders();
    await initPackages();
    await installPackages();
    await initTypescript();
    await finalEdits();

    const rainbowTitle = chalkAnimation.rainbow(
        "Successfully setup a NodeJS Project using typescript!"
    );

    await sleep(3000);

    rainbowTitle.stop();
}

// javascript main any node project
async function anyNodeJS() {
    let projectName;

    async function getName() {
        const answers = await inquirer.prompt({
            name: "proj_name",
            type: "input",
            message: "What should the project be called?",
            default() {
                return "untitled";
            },
        });

        projectName = answers.proj_name;
    }

    async function setupFolders() {
        const spinner = createSpinner("Setting up folder structure...").start();

        try {
            if (fs.existsSync(`./${projectName}`)) {
                spinner.error({
                    text: "That directory seems to already exist!",
                });
                process.exit(1);
            }

            await sleep();

            fs.mkdirSync(`./${projectName}`);
            fs.mkdirSync(`./${projectName}/src`);

            spinner.success({ text: "Successfully setup folder structure" });
        } catch (err) {
            spinner.error({ text: `Error: ${err}` });
            process.exit(1);
        }
    }

    async function initPackages() {
        const spinner = createSpinner("Initialising node project...").start();

        await sleep();
        exec(
            "npm init -y",
            { cwd: `./${projectName}` },
            (err, stdout, stderr) => {
                if (err !== null) {
                    console.log(err);
                    spinner.error({
                        text: "An error occured while initialising the project!",
                    });
                    process.exit(1);
                }
            }
        );

        spinner.success({ text: "Successfully initalised the project!" });
    }

    async function finalEdits() {
        const spinner = createSpinner("Doing final touches...").start();

        await sleep();

        try {
            const filePath = `./${projectName}/package.json`;
            const jsonData = await readFile(filePath, "utf8");
            const packageJson = await JSON.parse(jsonData);

            packageJson["main"] = "./src/index.js";

            await writeFile(
                `./${projectName}/package.json`,
                JSON.stringify(packageJson, null, 2)
            );

            await writeFile(
                `./${projectName}/src/index.js`,
                `console.log('Hello, World!');`
            );
        } catch (err) {
            spinner.error({ text: `Error while doing final touches: ${err}` });
            process.exit(1);
        }

        spinner.success({ text: "Successfully completed final edits!" });
    }

    await getName();
    await setupFolders();
    await initPackages();
    await finalEdits();

    const rainbowTitle = chalkAnimation.rainbow(
        "Successfully setup a NodeJS Project using Javascript!"
    );

    await sleep(3000);

    rainbowTitle.stop();
}

await getType();
await callFunc();

process.exit(0);
