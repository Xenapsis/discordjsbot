require('dotenv').config();
const {Client, Events, GatewayIntentBits, IntentsBitField, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType, ButtonInteraction, ButtonComponent, InteractionCollector, InteractionReplyOptions,} = require('discord.js')
const mongoose = require('mongoose');
const sqlite = require('sqlite3').verbose();

const buttonCooldown = new Set()
const buttonCooldown2 = new Set()
var query = `SELECT * FROM data WHERE userid = ?`;
var total = null;
let newrow = null;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

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
    let db = new sqlite.Database('./utils/database/database.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
})

client.on('message', (message) => {
    let msg = message.content.toLowerCase();
    console.log(msg)
});

client.on('interactionCreate',(interaction) => {
    let db = new sqlite.Database('./utils/database/database.db', sqlite.OPEN_READWRITE);
    const links = ["https://Griniszaddy.jaluzinov.ru", "https://goofygoober.jaluzinov.ru/", "https://Ianeatsjunkfood.gerastar.ru", "https://lightspeedredneck.jaluzinov.ru"];
    const premium = ["https://freebsd.cnew.ir", "https://xenapsissolosgamebyte.sorynov.cl", "https://riplightspeed.cnew.ir", "https://getbypassed.jaluzinov.ru"]



    if (interaction.commandName === 'links') {
        if (!interaction.member.roles.cache.has(`1179905654345957488`)) {
            interaction.reply({content: 'Sorry but your not a helper bwomp',ephemeral: true})
            return;
        }

        const embed = new EmbedBuilder()
        .setTitle("Shady Link Dispenser")
        .setDescription("Please turn on your dms before using this bot or you might lose your free link")
        .setColor(0x5900FF)
        .addFields({name: 'Free Users 🎫', value: '1 use per 1 day', inline: true})
        .addFields({name: 'Premium Users (Boosters) 🔮', value: '1 use per 1 day + free uses', inline: true})
        .addFields({name: 'Do NOT Share 🔨', value: 'Sharing will result in a ban and the website getting blocked faster by an admin'})
        .addFields({name: 'Premium links are proven to work and updated more often', value: 'Free links may be outdated or blocked!'})
        .addFields({name: 'Links Changed every Month', value: 'Links change at the first day of the month', inline: true})
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
        if (!interaction.member.roles.cache.has(`1161527100159836170`)){
            return interaction.reply({content: 'Sorry but your NOT a booster :(',ephemeral: true})
            return;
        }
        interaction.reply({content:'Working on it',ephemeral: true});
        var user = interaction.user.id;
        setTimeout(() => {
            var timenow = interaction.createdTimestamp;
            var cd = 86000
            db.get(query, [user], (err, row) => {
                if (err) {
                    console.log(err)
                }
                if (row === undefined) {
                    let insertdata = db.prepare(`INSERT INTO data (userid, premium) VALUES(?,?)`);
                    var timenow = interaction.createdTimestamp;
                    insertdata.run(user, timenow);
                    insertdata.finalize();
                    console.log("NEW ROW");
                    newrow = true;
                } else if (row.Premium == undefined) {
                    var timenow = interaction.createdTimestamp;
                    db.run(`UPDATE data SET Premium = ? WHERE userid = ?;`, [timenow, user]);
                    console.log("Updating Premium for " + user);
                    newrow = true;
                } else {
                    var time = row.Premium;
                    var timenow = interaction.createdTimestamp;
                    total = timenow - time;
                    console.log("OLD ROW");
                    console.log(row.Premium)
                    if (total / 1000 < 86000) {
                        newrow = false;
                        console.log(total / 1000);
                        return;

                    } else {
                        newrow = true;
                    };
                };
            });
            var seconds = total / 1000
            var cooldown = cd - seconds;
            setTimeout(() => {
                if (newrow === false) {
                    interaction.editReply({content: 'Stop Your on cooldown for ' + cooldown + ' seconds',ephemeral: true});
                    return;
                }
            }, 1000);



            const random2 = Math.floor(Math.random() * premium.length);
            console.log(random2, premium[random2]);

            const message = premium[random2]

            
            const embed3 = new EmbedBuilder()
            .setTitle("Shady Link Dispenser")
            .setDescription("Thanks for using Xenapsis")
            .setColor(0x5900FF)
            .addFields({name: 'For an extra link boost us.', value: '1 use per 1 week', inline: true})
            .addFields({name: 'Heres your link! 🔮', value: message, inline: true})
            .addFields({name: 'Premium links are proven to work and updated more often', value: 'Free links may be outdated or blocked!'})
            .addFields({name: 'Do NOT Share 🔨', value: 'Sharing will result in a ban and the website getting blocked faster by an admin'})
            .setThumbnail('https://xenapsis.github.io/imgs/favicon.png')

            setTimeout(() => {
                if (newrow != false) {
                    interaction.editReply({content: 'Check your DMS for your free link',ephemeral: true})
                    interaction.member.send({embeds: [embed3]});
                    db.run(`UPDATE data SET Time = ? WHERE userid = ?;`, [timenow, user]);
                    db.close();
                }
            }, 1010);

        }, 250);

    };

    if (interaction.customId === 'freebutton') {
        setTimeout(() => {
                var user = interaction.user.id;
                var timenow = interaction.createdTimestamp;
                var cd = 86000
                interaction.reply({content:'Working on it',ephemeral: true});
                db.get(query, [user], (err, row) => {
                    if (row === undefined) {
                        let insertdata = db.prepare(`INSERT INTO data VALUES(?,?,?)`);
                        var timenow = interaction.createdTimestamp;
                        insertdata.run(user, timenow, null);
                        insertdata.finalize();
                        console.log("NEW ROW");
                        newrow = true;
                    } else if (row.Time == undefined) {
                        var timenow = interaction.createdTimestamp;
                        db.run(`UPDATE data SET Time = ? WHERE userid = ?;`, [timenow, user]);
                        console.log("Updating Time for " + user);
                        newrow = true;
                    } else {
                        var time = row.Time;
                        var timenow = interaction.createdTimestamp;
                        total = timenow - time;
                        console.log("OLD ROW");
                        if (total / 1000 < 86000) {
                            newrow = false;
                            console.log(total / 1000);
                            return;
                        } else {
                            newrow = true
                        }
                    };
                });
                var seconds = total / 1000
                var integer = Math.round(Number(seconds))
                var cooldown = cd - integer;
                setTimeout(() => {
                    if (newrow === false) {
                        interaction.editReply({content: 'Stop Your on cooldown for ' + cooldown + ' seconds',ephemeral: true});
                        return;
                    }
                }, 1000);

                


                const random = Math.floor(Math.random() * links.length);
                console.log(random, links[random], interaction.user.id);

                const message = links[random]

                const embed2 = new EmbedBuilder()
                .setTitle("Shady Link Dispenser")
                .setDescription("Thanks for using Xenapsis")
                .setColor(0x5900FF)
                .addFields({name: 'For an extra link boost us.', value: '1 use per 1 week', inline: true})
                .addFields({name: 'Heres your link! 🔮', value: message, inline: true})
                .addFields({name: 'Premium links are proven to work and updated more often', value: 'Free links may be outdated or blocked!'})
                .addFields({name: 'Do NOT Share 🔨', value: 'Sharing will result in a ban womp'})
                .setThumbnail('https://xenapsis.github.io/imgs/favicon.png')
                
                
                
                setTimeout(() => {
                    if (newrow != false) {
                        interaction.editReply({content: 'Check your DMS for your free link',ephemeral: true})
                        interaction.member.send({embeds: [embed2]})
                        db.run(`UPDATE data SET Time = ? WHERE userid = ?;`, [timenow, user]);
                        db.close();
                    }
                }, 1010);
        }, 250);
    };
            
});



client.login(process.env.TOKEN);
