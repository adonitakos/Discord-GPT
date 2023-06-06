// Import environment variables
require('dotenv').config();

// ========= OpenAI Functionality ========= \\

const { Configuration, OpenAIApi } = require("openai");

const OPENAIAPI_KEY = `${process.env.OPENAIAPI_KEY}`;
const ORG_KEY = `${process.env.ORG_KEY}`;

const configuration  = new Configuration ({
    organization: ORG_KEY,
    apiKey: OPENAIAPI_KEY,
});

const openai = new OpenAIApi(configuration);

const gptQuery = async(message) => {

    const completion = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [
            {role: "user", content: `${message}`},
        ]
    }); // <--- completion await function ends here

    return completion.data.choices[0].message;

} // <--- gptQuery() async function ends here

// =============== Discord Bot Functionality =============== \\

const { Client, Events, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});

client.on(Events.ClientReady, client => {
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
    .setDescription('Query from GPT model')
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
      console.log("========================");
      console.log(result);
      console.log("========================");
      interaction.reply(result);
    }
  
    console.log(interaction);
    
  }); // <--- client.on() ends here


// =================== Starting the bot! =================== \\
client.login(process.env.DISCORD_KEY);
const keepAlive = require('./server');
keepAlive();

// ===== Commands that use $ ===== \\

// $ gptQuery command
client.on('messageCreate', async message => {
  if(message.content.startsWith('$')) {
    let userQuery = message.content.slice(1)
    const result = await gptQuery(userQuery);
    console.log(result);
    message.reply(result);
  } // <--- if(statement) ends here
}) // <--- client.on(messageCreate) ends here


// $ ping command
client.on('messageCreate', message => {
    if (message.content == '!ping') {
      message.reply('Pong!');
    }
}); // <--- ping-pong function ends here
