require('dotenv').config();
const { REST, Routes } = require('discord.js');

const commands = [
    {
      name: 'test',
      description: 'test',
    },

    {
      name: 'test2',
      description: 'test2',
    },

    {
      name: 'links',
      description: 'Dispenses links',
    },

];

const rest = new REST({ version: '10'}).setToken(process.env.TOKEN);

(async () => {
    try {
      console.log("reggistering commands")
      await rest.put(
        Routes.applicationGuildCommands(
            process.env.CLIENT_ID, 
            process.env.GUILD_ID
        ), 
        { body: commands }
      )
      console.log("commands were registered")
    } catch (error) {
        console.log(`there was an error ${error}`);
    }
})();