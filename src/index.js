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
console.log(process.env.BOOSTER_ROLE)
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
    const links = ["https://whoops.samyog.com.np", "https://lightspeedcantkeepup.ecodryfruits.com", "https://notmath.gurdit.com", "https://sigam.lumeacopiilorploiesti.ro/"];
    const premium = ["https://icantfindagoodname.jophey.net", "https://igotracksnowrhonda.cloudbarfbag.com", "https://zamn.laviewddns.com", "https://damn.designjobs.eu"]



    if (interaction.commandName === 'links') {
        if (!interaction.member.roles.cache.has(`1303572743916355616`)) {
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
        .addFields({name: 'Links Changed every Month', value: 'Links change at the first day of the month (Premium links may change more often!)', inline: true})
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
        if (!interaction.member.roles.cache.has('1161527100159836170')){   
            if (!interaction.member.roles.cache.has(process.env.BOOSTER_ROLE)){
                return interaction.reply({content: 'Sorry but your NOT a booster :(',ephemeral: true})
                
            }
        }
        interaction.reply({content:'Working on it',ephemeral: true});
        var user = interaction.user.id;
        var cdd = 86400000
        setTimeout(() => {
            var timenow = Date.now()
            db.get(query, [user], (err, row) => {
                if (err) {
                    console.log(err)
                }
                if (row === undefined) {
                    let insertdata = db.prepare(`INSERT INTO data (userid, premium) VALUES(?,?)`);
                    var timenow = Date.now()
                    insertdata.run(user, timenow);
                    insertdata.finalize();
                    console.log("NEW ROW");
                    newrow = true;
                } else if (row.Premium == undefined) {
                    var timenow = Date.now()
                    db.run(`UPDATE data SET Premium = ? WHERE userid = ?;`, [timenow, user]);
                    console.log("Updating Premium for " + user);
                    newrow = true;
                } else {
                    var time = row.Premium;
                    var timenow = Date.now()
                    var expiration = time + cdd
                    if (timenow < expiration) {
                        newrow = false;
                        var addedtime = expiration - timenow
                        var waittime = addedtime / 1000;
                        setTimeout(() => {
                            if (newrow === false) {
                                interaction.editReply({content: 'Stop Your on cooldown for ' + waittime + ' seconds',ephemeral: true});
                                return;
                            }
                        }, 1000);
                        console.log(total);
                        return;

                    } else {
                        newrow = true;
                    };
                };
            });
            
            



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
                    db.run(`UPDATE data SET Premium = ? WHERE userid = ?;`, [timenow, user]);
                    db.close();
                }
            }, 1010);

        }, 250);

    };

    if (interaction.customId === 'freebutton') {
        setTimeout(() => {
                var user = interaction.user.id;
                var timenow = Date.now();
                var cdd = 86400000
                interaction.reply({content:'Working on it',ephemeral: true});
                db.get(query, [user], (err, row) => {
                    if (row === undefined) {
                        let insertdata = db.prepare(`INSERT INTO data (userid, Time) VALUES(?,?)`);
                        var timenow = Date.now();
                        insertdata.run(user, timenow,);
                        insertdata.finalize();
                        console.log("NEW ROW");
                        newrow = true;
                    } else if (row.Time == undefined) {
                        var timenow = Date.now();
                        db.run(`UPDATE data SET Time = ? WHERE userid = ?;`, [timenow, user]);
                        console.log("Updating Time for " + user);
                        newrow = true;
                    } else {
                        var time = row.Time;
                        var timenow = Date.now()
                        var expiration = time + cdd
                        if (timenow < expiration) {
                            newrow = false;
                            var addedtime = expiration - timenow
                            var waittime = addedtime / 1000;
                            setTimeout(() => {
                                if (newrow === false) {
                                    interaction.editReply({content: 'Stop Your on cooldown for ' + waittime + ' seconds',ephemeral: true});
                                    return;
                                }
                            }, 1000);
                        } else {
                            newrow = true
                        }
                    };
                });

                


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
