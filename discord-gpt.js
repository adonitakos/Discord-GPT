require('dotenv').config()

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}); // <--- OpenAI configuration ends here

async function queryGPT(query) { 
  const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: query,
    max_tokens: 2048,
    temperature: 1.0,
  }).then(response => {
      let res = response.data.choices[0].text
      return res; // <-- return the value of res
  }) // <--- .then(response) ends here
  return response
} // <--- queryGPT() function ends here

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
}) // <--- client ready function ends here

client.on('messageCreate', message => {
    if (message.content == '!ping') {
      message.reply('Pong!');
    }
}); // <--- ping-pong function ends here

client.on('messageCreate', async message => {
  if(message.content.startsWith('!')) {
    let userQuery = message.content.slice(1)
    const result = await queryGPT(userQuery);
    message.reply(result);
  } // <--- if(statement) ends here
}) // <--- client.on(messageCreate) ends here

client.login(process.env.DISCORD_KEY);