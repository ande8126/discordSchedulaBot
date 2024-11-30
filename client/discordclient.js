require('dotenv').config
const { Client, Intents } = require('discord.js');
const db = require('./db');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

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

        try {
            await db.query(
                'INSERT INTO Events (EventName, EventDate, EventTime, Description, Assigner, Owner) VALUES ($1, $2, $3, $4, $5)',
                [eventName, eventDate, eventTime, description, assigner, owner]
            );
            message.channel.send(`Event "${eventName}" created for ${eventDate} at ${eventTime}.`);
        } catch (err) {
            console.error(err);
            message.channel.send('Failed to create event.');
        }
    } else if (message.content.startsWith('!events')) {
        try {
            const result = await db.query('SELECT * FROM events ORDER BY EventDate, EventTime');
            if (result.rows.length > 0) {
                const eventsList = result.rows
                    .map(
                        (event) =>
                            `${event.EventName} - ${event.EventDate} ${event.EventTime} (Created by: ${event.Assigner})`
                    )
                    .join('\n');
                message.channel.send(`Upcoming Events:\n${eventsList}`);
            } else {
                message.channel.send('No upcoming events.');
            }
        } catch (err) {
            console.error(err);
            message.channel.send('Failed to fetch events.');
        }
    }
});
