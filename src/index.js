require('dotenv').config();
const {Client, IntentsBitField, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType, ButtonInteraction, ButtonComponent, InteractionCollector, InteractionReplyOptions,} = require('discord.js')
const mongoose = require('mongoose');
const mongoURL = process.env.mongoURL;

const buttonCooldown = new Set()
const buttonCooldown2 = new Set()


const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ],
});



client.on('ready', (c) => {
    console.log(`${c.user.tag} Is online`)
    async () => {
        try {
            mongoose.set('strictQuery', false)
            await mongoose.connect(mongoURL, { keepAlive: true });
            console.log("connected to mongoose")
            eventHandler(client);
        } catch (error) {
            console.log(`Could not connect because of ${error}`)
        }
    };
})

client.on('interactionCreate',(interaction) => {

const links = ["https://Griniszaddy.jaluzinov.ru", "https://goofygoober.jaluzinov.ru/", "https://Ianeatsjunkfood.gerastar.ru", "https://lightspeedredneck.jaluzinov.ru"];
const premium = ["https://freebsd.cnew.ir", "https://xenapsissolosgamebyte.sorynov.cl", "https://riplightspeed.cnew.ir", "https://getbypassed.jaluzinov.ru"]



    if (interaction.commandName === 'links') {
        if (!interaction.member.roles.cache.has(`1181807862360592434`)) {
            interaction.reply({content: 'Sorry but your not a helper bwomp',ephemeral: true})
            return;
        }

        const embed = new EmbedBuilder()
        .setTitle("Shady Link Dispenser")
        .setDescription("Please turn on your dms before using this bot or you might lose your free link")
        .setColor(0x5900FF)
        .addFields({name: 'Free Users 🎫', value: '1 use per 1 week', inline: true})
        .addFields({name: 'Premium Users (Boosters) 🔮', value: '1 use per 1 week + free uses', inline: true})
        .addFields({name: 'Do NOT Share 🔨', value: 'Sharing will result in a ban womp'})
        .addFields({name: 'Links Changed every sunday', value: 'Links change at 12am est on Sundays', inline: true})
        .setThumbnail('https://xenapsis.github.io/imgs/favicon.png')

        const button = new ButtonBuilder()
        .setLabel('Free 🎫')
        .setStyle(ButtonStyle.Primary)
        .setCustomId('freebutton')

        const button2 = new ButtonBuilder()
        .setLabel('Premium 🔮')
        .setStyle(ButtonStyle.Primary)
        .setCustomId('premiumbutton')

        const buttonrow = new ActionRowBuilder().addComponents(button, button2); 

        interaction.reply({embeds: [embed], components: [buttonrow]});


    }
    if (interaction.customId === 'premiumbutton'){
        if (!interaction.member.roles.cache.has(`1179905654345957488`)){
            return interaction.reply({content: 'Sorry but your NOT a booster :(',ephemeral: true})
            return;
        }


        if(buttonCooldown2.has(interaction.user.id)) {
            interaction.reply({content: 'Stop Your on cooldown!',ephemeral: true})
            return;
        }

        const random2 = Math.floor(Math.random() * premium.length);
        console.log(random2, premium[random2]);

        const message = premium[random2]

        interaction.reply({content: 'Check your DMS for your premium link',ephemeral: true})
        
        const embed3 = new EmbedBuilder()
        .setTitle("Shady Link Dispenser")
        .setDescription("Thanks for using Xenapsis")
        .setColor(0x5900FF)
        .addFields({name: 'For an extra link boost us.', value: '1 use per 1 week', inline: true})
        .addFields({name: 'Heres your link! 🔮', value: message, inline: true})
        .addFields({name: 'Premium links are proven to work', value: 'Free links may be outdated or blocked!'})
        .addFields({name: 'Do NOT Share 🔨', value: 'Sharing will result in a ban womp'})
        .setThumbnail('https://xenapsis.github.io/imgs/favicon.png')

        interaction.member.send({embeds: [embed3]})

        buttonCooldown2.add(interaction.user.id)
        setTimeout(() => buttonCooldown2.delete(interaction.user.id), 604800_000)

    }

    if (interaction.customId === 'freebutton'){
        if(buttonCooldown.has(interaction.user.id)) {
            interaction.reply({content: 'Stop Your on cooldown!',ephemeral: true})
            return;
        }


        interaction.reply({content: 'Check your DMS for your free link',ephemeral: true})
        const random = Math.floor(Math.random() * links.length);
        console.log(random, links[random], interaction.user.id);

        const message = links[random]

        const embed2 = new EmbedBuilder()
        .setTitle("Shady Link Dispenser")
        .setDescription("Thanks for using Xenapsis")
        .setColor(0x5900FF)
        .addFields({name: 'For an extra link boost us.', value: '1 use per 1 week', inline: true})
        .addFields({name: 'Heres your link! 🔮', value: message, inline: true})
        .addFields({name: 'Premium links are proven to work', value: 'Free links may be outdated or blocked!'})
        .addFields({name: 'Do NOT Share 🔨', value: 'Sharing will result in a ban womp'})
        .setThumbnail('https://xenapsis.github.io/imgs/favicon.png')


        interaction.member.send({embeds: [embed2]})

        buttonCooldown.add(interaction.user.id)
        setTimeout(() => buttonCooldown.delete(interaction.user.id), 604800_000)
    }
});



client.login(process.env.TOKEN)
