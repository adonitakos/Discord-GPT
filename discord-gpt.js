// Import environment variables
require('dotenv').config()

// ========= OpenAI Functionality ========= \\
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}); // <--- OpenAI configuration ends here

const openai = new OpenAIApi(configuration);

const gptQuery = async(queryPrompt) => {
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: queryPrompt }],
    }).then(response => {
        let res = response["data"]["choices"][0]["message"]["content"];
        return res
    }); // <--- .then(response) ends here
    return response;
};  // <--- gptQuery() async function ends here

// async function gptQuery(query) { 
//   const openai = new OpenAIApi(configuration);
//   const response = await openai.createCompletion({
//     model: "text-davinci-003",
//     prompt: query,
//     max_tokens: 2048,
//     temperature: 1.0,
//   }).then(response => {
//       let res = response.data.choices[0].text
//       return res; // <-- return the value of res
//   }) // <--- .then(response) ends here
//   return response
// } // <--- gptQuery() function ends here

// =============== Discord Bot Functionality =============== \\

const { Client, Events, GatewayIntentBits, SlashCommandBuilder, SlashCommandStringOption } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});

client.once(Events.ClientReady, client => {
  console.log(`Logged in as ${client.user.tag}!`);
  
  const ping = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong!');

  const hello = new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Greets the user back!');

  const info = new SlashCommandBuilder()
    .setName('info')
    .setDescription('Provides information about this bot');

  const gpt_query = new SlashCommandBuilder()
    .setName('gpt_query')
    .setDescription('Query from GPT-3.5 model')
    .addStringOption(option => 
      option.setName('query')
        .setDescription('What you will input to be queried'));

  const echo = new SlashCommandBuilder()
    .setName('echo')
    .setDescription('Replies with your input!')
    .addStringOption(option =>
      option.setName('input')
        .setDescription('The input to echo back'));


  // const pingCommand = ping.toJSON();
  client.application.commands.create(ping);
  client.application.commands.create(hello);
  client.application.commands.create(info);
  client.application.commands.create(echo);
  client.application.commands.create(gpt_query);

}); // <--- client.once() ends here

client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isChatInputCommand()) return;
  
    if(interaction.commandName === 'ping') {
      interaction.reply('PONG!');
    }

    if(interaction.commandName === 'hello') {
      interaction.reply(`Hello ${interaction.user.username}! 😀`)
    }
    
    if(interaction.commandName === 'info') {
      const information = "I am a discord.js bot created by Adoni Takos, using the OpenAI library & API. My purpose is to enable users to have ChatGPT-like functionality right in their Discord text channels! 🙂";
      interaction.reply(information);
    }

    if(interaction.commandName === 'echo') {
      const input = interaction.options.getString('input');
      console.log(input);
      interaction.reply(input);
    }

    if(interaction.commandName === 'gpt_query') {
      const result = await gptQuery(interaction.options.getString('query'));
      console.log(result);
      interaction.reply(result);
    }
  
    console.log(interaction);
    
  }); // <--- client.on() ends here


// =================== Starting the bot! =================== \\
client.login(process.env.DISCORD_KEY);
const keepAlive = require('./server');
keepAlive();



// ===== Code that might need to be re-used later ===== \\

client.on('messageCreate', async message => {
  if(message.content.startsWith('$')) {
    let userQuery = message.content.slice(1)
    const result = await gptQuery(userQuery);
    console.log(result);
    message.reply(result);
  } // <--- if(statement) ends here
}) // <--- client.on(messageCreate) ends here


// $ ping command
// client.on('messageCreate', message => {
//     if (message.content == '$ping') {
//       message.reply('Pong!');
//     }
// }); // <--- ping-pong function ends here


// const clientId = '1050671337049423932'

// const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_KEY);

// (async () => {
//   try {
//     console.log('Started refreshing application (/) commands.');

//     await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

//     console.log('Successfully reloaded application (/) commands.');
//   } catch (error) {
//     console.error(error);
//   }
// })();


// client.on('ready', () => {
//   console.log(`Logged in as ${client.user.tag}!`);
// }); // <--- client ready function ends here

// client.on('interactionCreate', async interaction => {
//   if (!interaction.isChatInputCommand()) return;

//   if (interaction.commandName === 'ping') {
//     await interaction.reply('Pong!');
//   }

//   if (interaction.commandName === 'add') {
//     const num1 = interaction.options.get('first-number').value;
//     const num2 = interaction.options.get('second-number').value;
//     console.log(`The numbers received were: ${num1} and ${num2}`);
//     // interaction.reply(`The sum is ${num1 + num2}`);
    
//   }

//   if (interaction.commandName === 'gpt_query') {
//     let userQuery = interaction.options.get('query');
//     const result = await gptQuery(userQuery);
//     await interaction.reply(result);
//   }
  
// }); // <--- interactionCreate ends here


// ==== Needed when DELETING all the application commands ==== \\

// const { Client, Events, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
// const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});


// const { REST, Routes } = require('discord.js');
// const clientId = '1050671337049423932'
// const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_KEY);

// client.on('ready', () => {
//   console.log(`Logged in as ${client.user.tag}!`);
// }); // <--- client ready function ends here

// // for global commands
// rest.put(Routes.applicationCommands(clientId), { body: [] })
// 	.then(() => console.log('Successfully deleted all application commands.'))
// 	.catch(console.error);