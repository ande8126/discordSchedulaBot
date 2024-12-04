require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent ]});
const apiUrl = process.env.APIURL || 'http://localhost:5001';

client.once('ready', ()=> {
    console.log(`logged in as ${client.user.tag}!`);
});

client.login(process.env.DISCORD_TOKEN);

client.on('messageCreate', async (message) => {
    if (message.content.startsWith('!createevent')) {
        const [_, eventName, eventDate, eventTime, ...descParts] = message.content.split(' ');
        const description = descParts.join(' ');
        const assigner = message.author.username;
        const owner = descParts.slice(-1)[0]; //last word is owner
        const channelId = message.channel.id;
        const serverId = message.guild.id;

        try {
            const response = await axios.post(`${apiUrl}/events`, {
                eventName, 
                eventDate, 
                eventTime, 
                description, 
                assigner, 
                owner,
                channelId,
                serverId
        });
            message.channel.send(`Event "${response.eventName}" created for ${response.eventDate} at ${response.eventTime}.`);
        } catch (err) {
            console.error(err);
            message.channel.send('Failed to create event.');
        }
    } else if (message.content.startsWith('!events')) {
        try {
            const response = await axios.get(`${apiUrl}/events`)
            if (response.data.length === 0) {
                message.channel.send('No upcoming events.');
            } else {
                const eventsList = response.data
                    .map((event) => `${event.eventName} - ${event.eventDate} ${event.eventTime} (Owner: ${event.owner})`)
                    .join('\n');
                message.channel.send(`Upcoming Events:\n${eventsList}`);
            }
        } catch (err) {
            console.error(err);
            message.channel.send('Failed to fetch events.');
        }
    }
});
