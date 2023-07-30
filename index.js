#!/usr/bin/env node

import inquirer from "inquirer";
import chalkAnimation from "chalk-animation";
import { createSpinner } from "nanospinner";
import fs from "fs";
import { writeFile, readFile, mkdir } from "fs/promises";

const exec = (await import('child_process')).exec;

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

let prompt;

async function getType() {
    const answers = await inquirer.prompt({
        name: 'prompt',
        type: "list",
        choices: [
            "Express with Typescript",
            "DiscordBot using Typescript",
        ],
        message: "What do you want to generate?"
    });

    prompt = answers.prompt;
}

async function callFunc() {
    switch (prompt) {
        case "Express with Typescript":
            await expressWithTs();
            break;
        case "DiscordBot using Typescript":
            await discordTs();
            break;
    }
}

async function expressWithTs() {
    let projectName;

    async function getName() {
        const answers = await inquirer.prompt({
            name: "proj_name",
            type: "input",
            message: "What should the project be called?",
            default() {
                return 'untitled';
            }
        });

        projectName = answers.proj_name;
    }

    async function setupFolders() {
        const spinner = createSpinner('Setting up folder structure...').start();

        try {
            if (fs.existsSync(`./${projectName}`)) {
                spinner.error({ text: "That directory seems to already exist!" })
                process.exit(1);
            }

            await sleep();

            fs.mkdirSync(`./${projectName}`);
            fs.mkdirSync(`./${projectName}/src`);

            spinner.success({ text: 'Successfully setup folder structure' });
        } catch (err) {
            spinner.error({ text: `Error: ${err}` });
            process.exit(1);
        }
    }

    async function initPackages() {
        const spinner = createSpinner('Initialising node project...').start();

        await sleep();
        exec('npm init -y', { cwd: `./${projectName}` }, (err, stdout, stderr) => {   
            if (err !== null) {
                console.log(err);
                spinner.error({ text: "An error occured while initialising the project!" });
                process.exit(1);
            }
        });

        spinner.success({ text: 'Successfully initalised the packages!' });
    }

    async function installPackages() {
        const spinner = createSpinner('Installing all dependencies...').start();

        await sleep();

        exec('npm i express dotenv ; npm i -D @types/node @types/express typescript rimraf nodemon', { cwd: `./${projectName}` }, (err, stdout, stderr) => {   
            if (err !== null) {
                console.log(err);
                spinner.error({ text: "An error occured while installing dev dependencies!" });
                process.exit(1);
            }
        });

        spinner.success({ text: "Successfully installed all dependencies"});
    }

    // TODO: index.ts
    async function addFiles() {
        const spinner = createSpinner('Adding important files...').start();

        await sleep();

        await writeFile(`./${projectName}/src/index.ts`, `
    import express from 'express';
    import 'dotenv/config';

    const app = express();

    app.set('json spaces', 2);
    app.use( express.json() );

    app.listen(process.env.PORT, () => {
        console.log('The server is up and running on Port 8085!');
    });
        `).catch(err => {
            spinner.error({ text: `Error while adding index: ${err}` });
            process.exit(1);
        });

        await writeFile(`./${projectName}/.env`, "PORT=8085").catch(err => {
            spinner.error({ text: `Error while adding .env: ${err}` });
            process.exit(1);
        });

        spinner.success({ text: "Successfully added the files!" });
    }

    async function initTypescript() {
        const spinner = createSpinner('Initialising typescript...').start();

        await sleep();

        try {
            await writeFile(`./${projectName}/tsconfig.json`, `
    {
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
    }
            `).then(() => {});
        } catch (err) {
            spinner.error({ text: `Error while initialising typescript: ${err}` });
            process.exit(1);
        }

        spinner.success({ text: "Successfully initialised typescript!" });
    }

    async function finalEdits() {
        const spinner = createSpinner('Doing final touches...').start();

        await sleep();

        try {
            const filePath = `./${projectName}/package.json`;
            const jsonData = await readFile(filePath, 'utf8');
            const packageJson = await JSON.parse(jsonData);

            packageJson.scripts = {
                build: "rimraf ./dist/ && tsc",
                predev: "npm run build",
                dev: "tsc -w & nodemon ./dist/index.js",
                prestart: "npm run build",
                start: "node ./dist/index.js"
            }

            packageJson['type'] = "module";
            packageJson['main'] = "./dist/index.js";

            await writeFile(`./${projectName}/package.json`, JSON.stringify(packageJson, null, 2));
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

    const rainbowTitle = chalkAnimation.rainbow (
        'Successfully setup expressjs using typescript!',
    );

    await sleep(3000);

    rainbowTitle.stop();
}

async function discordTs() {
    let projectName;

    async function getName() {
        const answers = await inquirer.prompt({
            name: "proj_name",
            type: "input",
            message: "What should the project be called?",
            default() {
                return 'untitled';
            }
        });

        projectName = answers.proj_name;
    }

    async function setupFolders() {
        const spinner = createSpinner('Setting up folder structure...').start();

        try {
            if (fs.existsSync(`./${projectName}`)) {
                spinner.error({ text: "That directory seems to already exist!" })
                process.exit(1);
            }

            await sleep();

            fs.mkdirSync(`./${projectName}`);
            fs.mkdirSync(`./${projectName}/src`);

            spinner.success({ text: 'Successfully setup folder structure' });
        } catch (err) {
            spinner.error({ text: `Error: ${err}` });
            process.exit(1);
        }
    }

    async function initPackages() {
        const spinner = createSpinner('Initialising node project...').start();

        await sleep();
        exec('npm init -y', { cwd: `./${projectName}` }, (err, stdout, stderr) => {   
            if (err !== null) {
                console.log(err);
                spinner.error({ text: "An error occured while initialising the project!" });
                process.exit(1);
            }
        });

        spinner.success({ text: 'Successfully initalised the packages!' });
    }

    async function installPackages() {
        const spinner = createSpinner('Installing all dependencies...').start();

        await sleep();

        exec('npm i discord.js dotenv ; npm i -D @types/node typescript rimraf nodemon', { cwd: `./${projectName}` }, (err, stdout, stderr) => {   
            if (err !== null) {
                console.log(err);
                spinner.error({ text: "An error occured while installing dependencies!" });
                process.exit(1);
            }
        });

        spinner.success({ text: "Successfully installed all dependencies"});
    }

    async function addFiles() {
        const spinner = createSpinner('Adding important files & folders...').start();

        await sleep();

        // src/index.ts
        await writeFile(`./${projectName}/src/index.ts`, `
import 'dotenv/config';
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
})();
        `).catch(err => {
            spinner.error({ text: `Error while adding index: ${err}` });
            process.exit(1);
        });

        // .env
        await writeFile(`./${projectName}/.env`, "TOKEN=PUT YOUR TOKEN HERE\nCLIENT_ID=PUT YOUR BOT ID HERE").catch(err => {
            spinner.error({ text: `Error while adding .env: ${err}` });
            process.exit(1);
        });

        // handlers
        await mkdir(`./${projectName}/src/handlers`).then(async () => {
            // command handler
            await writeFile(`./${projectName}/src/handlers/handleCommands.ts`, `import { REST } from '@discordjs/rest';
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
            };
            `)

            // event handler
            await writeFile(`./${projectName}/src/handlers/handleEvents.ts`, `
import { ExtendedClient } from "../structures/Client.js";

export default async (client: ExtendedClient, eventFiles: any) => {
    for (const file of eventFiles) {
        const event = await import(\`../events/\${file}\`);
        if (event.default?.once) {
            client.once(event.default?.name, (...args) => event.default?.execute(...args, client));
        } else {
            client.on(event.default?.name, (...args) => event.default?.execute(...args, client));
        }
    }
}
            `)
        }).catch(err => {
            spinner.error({ text: `Error while adding handlers: ${err}` });
            process.exit(1);
        });

        // commands
        await mkdir(`./${projectName}/src/commands`).then(async () => {
            // command folders
            await mkdir(`./${projectName}/src/commands/Dev`);
            await mkdir(`./${projectName}/src/commands/Feature`);
            await mkdir(`./${projectName}/src/commands/Fun`);
            await mkdir(`./${projectName}/src/commands/Misc`).then(async () => {
                await writeFile(`./${projectName}/src/commands/Misc/ping.ts`, `
import { SlashCommandBuilder, messageLink } from "discord.js";
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

export default ping;
                `)
            });
        }).catch(err => {
            spinner.error({ text: `Error while adding commands: ${err}`});
            process.exit(1);
        });

        // events
        await mkdir(`./${projectName}/src/events`).then(async () => {
            await writeFile(`./${projectName}/src/events/interactionCreate.ts`, `
import { Interaction } from 'discord.js';
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

export default interactionCreate;
            `)

            await writeFile(`./${projectName}/src/events/ready.ts`, `
import { Client } from "discord.js"
import { Event } from "../structures/Event.js"
import 'dotenv/config'

const ready: Event = {
    name: 'ready',
    once: true,

    async execute(c: Client) {
        console.log(\`Ready! Logged in as \${c.user.tag}\`);
    }
}

export default ready;
            `)
        }).catch(err => {
            spinner.error({ text: `Error while adding events: ${err}`});
            process.exit(1);
        });

        // Structures
        await mkdir(`./${projectName}/src/structures`).then(async () => {
            // Command Struct
            await writeFile(`./${projectName}/src/structures/Command.ts`, `import { Client, CommandInteraction, Interaction, SlashCommandBuilder } from "discord.js";

            export interface Command {
                data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup" | "addBooleanOption" | "addUserOption" | "addChannelOption" | "addRoleOption" | "addAttachmentOption" | "addMentionableOption" | "addStringOption" | "addIntegerOption" | "addNumberOption">;
                execute(interaction: CommandInteraction, client: Client): any;
            }
            `);

            // Event Struct
            await writeFile(`./${projectName}/src/structures/Event.ts`, `export interface Event {
                name: string,
                once?: boolean,
                execute(...args: any): any;
            }`);

            // Client (ExtendedClient) Struct
            await writeFile(`./${projectName}/src/structures/Client.ts`, `import { Client } from 'discord.js';

            export class ExtendedClient extends Client {
              commandArray: any[];
              commands: Map<string, any>;
            }`);
        }).catch(err => {
            spinner.error({ text: `Error while adding events: ${err}`});
            process.exit(1);
        });

        spinner.success({ text: "Successfully added the files and folders!" });
    }

    async function initTypescript() {
        const spinner = createSpinner('Initialising typescript...').start();

        await sleep();

        try {
            await writeFile(`./${projectName}/tsconfig.json`, `
    {
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
    }
            `).then(() => {});
        } catch (err) {
            spinner.error({ text: `Error while initialising typescript: ${err}` });
            process.exit(1);
        }

        spinner.success({ text: "Successfully initialised typescript!" });
    }

    async function finalEdits() {
        const spinner = createSpinner('Doing final touches...').start();

        await sleep();

        try {
            const filePath = `./${projectName}/package.json`;
            const jsonData = await readFile(filePath, 'utf8');
            const packageJson = await JSON.parse(jsonData);

            packageJson.scripts = {
                build: "rimraf ./dist/ && tsc",
                predev: "npm run build",
                dev: "tsc -w & nodemon ./dist/index.js",
                prestart: "npm run build",
                start: "node ./dist/index.js"
            }

            packageJson['type'] = "module";
            packageJson['main'] = "./dist/index.js";

            await writeFile(`./${projectName}/package.json`, JSON.stringify(packageJson, null, 2));
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

    const rainbowTitle = chalkAnimation.rainbow (
        'Successfully setup a discord bot using typescript!',
    );

    await sleep(3000);

    rainbowTitle.stop();
}

await getType();
await callFunc();

process.exit(0);