const { Client, IntentsBitField, EmbedBuilder, ApplicationCommandOptionType, ButtonBuilder, ActionRowBuilder, ButtonStyle, WebhookClient } = require ( 'discord.js' )
const fs = require ( 'fs' )
const mongoose = require('mongoose')
const Handler = require('./Handler/Handler')
const _handler = new Handler
require ( 'dotenv' ).config ()
let auctioneerRole = '984327279255617586'
let auctionButton = new Map()
const LLselfies = {
    channel: [ '925140985586024498', '925787445671374848', '1042413286920044614', '1042413344658829432', '1042413455199715379', '1042413489324568576', '1042413608589598810', '1042413658724114502', '1042413738516549662' ], 
    Emote: [ '<a:shy:925133935288152115>', '<a:Read_Love1:958018980449251438>', '<:cute:925133308222898258>', '<a:money:924723385135693864>', '<:looking1:925132681094787103>', '<:yay:924546690999021588>' ]
}
const LLnsfw = {
    channel: [ '925142273358962809', '925142320893014079', '925142747202068601', '925787556984012870', '1042058111063695462', '1042058126670700595', '1042058139392024666', '1042058171134521354', '1042058188947718144', '1042058202201722952', '1042058236255285268' ], 
    Emote: [ '<:CumInMe:931904877062393857>', '<:blush:924546130681946123>', '<:mood:927682713375363113>', '<:letsfuck:931058882594357288>', '<a:horny:927682380343443476>', '<:tieup:925621143010967622>' ]
}
const LLsmash = {
    channel: [ '1042068642961035385' ], 
    Emote: [ '<:smash:1042067266252066856>', '<:pass:1042067231053455442>' ]
}

const BLemotes = { //Blossom Grove from Ashh UID => 773276973844791297
    nsfw: {
        mon: {
            channel: [ '1184309336378458287' ],
            emote: [ '<:2_niced:1085965791293349958>', '<:1_lickcock:1085384330026688522>' ]
        },
        tues: {
            channel: [ '1184672910330302484' ],
            emote: [ '<:2_loveboobs:1085922004374409228>', '<:1_hearttit:1085255412170883154>' ]
        },
        wed: {
            channel: [ '1184673001313144902' ],
            emote: [ '<:2_wetrn:1085007689433763920>', '<a:4_panties:1093956390101467217>' ]
        },
        thur: {
            channel: [ '1184673727254892655' ],
            emote: [ '<:4_sitonmyface:1088807224228462734>', '<:1_lovecum:1105985630191767622>' ]
        },
        fri: {
            channel: [ '1184673102211321986' ],
            emote: [ '<:emoji_96:1239222069418524682>', '<a:1_assspank:1096865473586544730>' ]
        },
        sat: {
            channel: [ '1184673338195451915' ],
            emote: [ '<a:4_hot:1089371333265215699>' ]
        },
        sun: {
            channel: [ '1184673834213842996' ],
            emote: [ '<:A_luv_DNS:1226550993228005467>', '<:D_SakuraDreams_1DNS:1226552903699927090>', '😍' ]
        },
        mal: {
            channel: [ '1184674202792513626' ],
            emote: [ '<a:emoji_9:1120718001222717593>', '<a:4_1010:1094808679427088415>' ]
        },
        fem: {
            channel: [ '1184674139731148861' ],
            emote: [ '<a:emoji_8:1120717988493013043>', '<a:4_1010:1094808679427088415>' ]
        },
        nbgf: {
            channel: [ '1184674311328514088' ],
            emote: [ '<:4_goodbean:1091057428872843424>', '<a:4_1010:1094808679427088415>' ]
        },
    },
    sfw: {
        selfies: {
            channel: [ '1184309336202293372' ],
            emote: [ '<:A_luv_DNS:1226550993228005467>', '<:D_SakuraDreams_1DNS:1226552903699927090>', '😍' ]
        },
        hand_pics: {
            channel: [ '1184674609916805191' ],
            emote: [ '<:1_lovecum:1105985630191767622>' ]
        },
        suggestion: {
            channel: [ '1189729705499303957' ],
            emote: [ '👍', '👎' ]
        }
    }
}

const PDemotes = {
    sfw : {
        channels: [ '1164960579853754428' ],
        emotes: [ '<a:1096127393833439403:1174505075134169098>', '<a:Frogbounce:1167620250079088741>', '<a:emoji_78:1178101108124692510>' ]
    },
    nsfw: {
        channels: [ '1164963704580874270', '1164963717667115109', '1164963806263378060', '1164963835241836766' ],
        emotes: [ '<a:931060201149313165:1174505624080486540>', '<a:emoji_73:1178101063354683413>', '<:sweat1:1167620240688033795>' ]
    }
}

const PPemotes = {
    sfw: {
        channels: [ "1228889786010566777" ],
        emotes: [ "<:blush:1229285761535443026>", "<a:lick:1229285546325446687>", "<:mine:1229286383881814076>", "<a:wave:1229286134597812317>" ]
    },
    nsfw: {
        channels: [ "1228889543910887495", "1228889559094525982", "1228889651012698122" ],
        emotes: [ "<a:bite:1229284468603224104>", "<:blush:1229285761535443026>", "<:shy:1229285698314567710>" ]
    }
}

const client = new Client ({
    intents: [ IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.MessageContent ]
})

client.on ( 'error', async ( error ) => {
    console.log ( error )
    
    await logError(error.message)
})

client.on ( 'interactionCreate', async ( interaction ) => {
    if ( interaction.isCommand ()) {
        const { commandName } = interaction
        switch ( commandName ) {
            case 'auction':
                await auction ( interaction )
                break;
            case 'bid':
                await placeBid ( interaction )
                break;
            case 'clear-bids':
                await clearBid ( interaction )
                break;
            case 'confess':
                await confession ( interaction )
                break;
            case 'get-bid':
                await getBid ( interaction )
                break;
            case 'suggest':
                await suggestion ( interaction )
                break;
            default:
                await interaction.reply ({ ephemeral: true, content: 'Sorry i dont recognise this command pls let the Owner of me know'})
                break;
        }
    } else if (interaction.isButton()) {
        const message = interaction.message
        let embed = message.embeds[0]
        const member = interaction.member
        const lable = interaction.component.label
        if (lable === 'cancel') {
            if (!member.roles.cache.has(auctioneerRole)) {
                await interaction.reply({content: 'missing Permission ask the `Auctioneer`', ephemeral: true})
                return
            }
            if (embed.fields[1].value === 'noone') {
                const newEmbed = new EmbedBuilder().setTitle(embed.title).setDescription(embed.description).addFields([{name: 'Winner', value: '__noone bid__'}])
                await message.edit({embeds: [newEmbed], components: []})
                return
            }
            const newEmbed = new EmbedBuilder().setTitle(embed.title).setDescription(embed.description).addFields([{name: 'Winner', value: embed.fields[1].value, inline: true}, {name: 'Bid', value: embed.fields[0].value, inline: true}])
            await message.edit({embeds: [newEmbed], components: []})
            const _id = `${interaction.guild.id}-${embed.fields[1].value.replace(/\D*/g, '')}`
            await _handler.bidHandler.clearBid(_id)
        } else {
            if (embed.fields[1].value.includes(member.id)) {
                await interaction.reply({ephemeral: true, content: 'yours is already the highest bid'})
                return
            }
            if (auctionButton.get(message.id)) return
            auctionButton.set(message.id, true)
            const newBid = `${Number(embed.fields[0].value) + Number(lable)}`
            const newEmbed = new EmbedBuilder().setTitle(embed.title).setDescription(embed.description).addFields([{name: 'current Bid', value: newBid}, {name: 'current Bidholder', value: `${member}`}, embed.fields[2]])
            await message.edit({embeds: [newEmbed]})
            await interaction.reply({ephemeral: true, content: 'Bid is placed'})
            auctionButton.set(message.id, false)
        }
    }
})

client.login ( process.env.TOKEN )

client.on ( 'messageCreate', async ( message ) => {
    const { channel, content, author, guild } = message
    const prefix = _handler.prefixHandler.getPrefix(guild.id)

    const BLchannelListNSFW = [ ...BLemotes.nsfw.fem.channel, ...BLemotes.nsfw.fri.channel, ...BLemotes.nsfw.mal.channel, ...BLemotes.nsfw.mon.channel, ...BLemotes.nsfw.nbgf.channel, ...BLemotes.nsfw.sat.channel, ...BLemotes.nsfw.sun.channel, ...BLemotes.nsfw.thur.channel, ...BLemotes.nsfw.tues.channel, ...BLemotes.nsfw.wed.channel ]
    const BLchannelListSFW = [ ...BLemotes.sfw.hand_pics.channel, ...BLemotes.sfw.selfies.channel, ...BLemotes.sfw.suggestion.channel ]
    const BLchannelList = [ ...BLchannelListNSFW, ...BLchannelListSFW ]

    if ( content && content.startsWith ( prefix )) {
        let cmd = content.slice ( prefix.length ).split ( ' ' )[ 0 ]
        let args = content.slice ( prefix.length + cmd.length ).split ( ' ' )
        let cmd_res = await command ( cmd, author, args, message )
        if ( cmd_res !== false ) return await message.reply ( cmd_res )
    }
    else if ( message.author.id === '470723870270160917' && message.content.includes ( '<@&936405377522757632>')) {
        const reply = await message.channel.send ({ content: '<@&936405377522757632>' })
        await reply.delete()
    }
    if ( await checkForPictures ( message ) && LLselfies.channel.includes ( channel.id )) {
        for ( const emote of LLselfies.Emote ) {
            try {
                await message.react ( emote )
            } catch ( err ) {
                await logError ( `${ err }\nEmote: ${ emote }` )
            }
        }
    } else if ( await checkForPictures ( message ) && LLnsfw.channel.includes( channel.id )) {
        for ( const emote of LLnsfw.Emote ) {
            try {
                await message.react ( emote )
            } catch ( err ) {
                await logError ( `${ err }\nEmote: ${ emote }` )
            }
        }
    } else if ( await checkForPictures ( message ) && LLsmash.channel.includes ( channel.id )) {
        for ( const emote of LLsmash.Emote ) {
            try {
                await message.react ( emote )
            } catch ( err ) {
                await logError ( `${ err }\nEmote: ${ emote }` )
            }
        }
    } else if ( await checkForPictures ( message ) && PDemotes.sfw.channels.includes ( channel.id )) { //Psychedelic Dreamscape sfw
        for ( const emote of PDemotes.sfw.emotes ) {
            try {
                await message.react ( emote )
            } catch ( err ) {
                await logError ( `${ err }\nEmote: ${ emote }` )
            }
        }
    } else if ( await checkForPictures ( message ) && PDemotes.nsfw.channels.includes ( channel.id )) { //Psychedelic Dreamscape nsfw
    } else if ( await checkForPictures ( message ) && PPemotes.sfw.channels.includes ( channel.id )) { //Pleasure Palace 18+ sfw
        for ( const emote of PPemotes.sfw.emotes ) {
            try {
                await message.react ( emote )
            } catch ( err ) {
                await logError ( `${ err }\nEmote: ${ emote }` )
            }
        }
    } else if ( await checkForPictures ( message ) && PPemotes.nsfw.channels.includes ( channel.id )) { //Pleasure Palace 18+ nsfw
        for ( const emote of PPemotes.nsfw.emotes ) {
            try {
                await message.react ( emote )
            } catch ( err ) {
                await logError ( `${ err }\nEmote: ${ emote }` )
            }
        }
    } else if ( await checkForPictures ( message ) && BLchannelList.includes ( channel.id )) { //Blossom Grove
        const emotes = []
        if ( BLchannelListNSFW.includes ( channel.id )) { //nsfw
            const nsfw = BLemotes.nsfw
            if ( nsfw.fem.channel.includes ( channel.id )) { emotes.push ( ...nsfw.fem.emote )}
            if ( nsfw.fri.channel.includes ( channel.id )) { emotes.push ( ...nsfw.fri.emote )}
            if ( nsfw.mal.channel.includes ( channel.id )) { emotes.push ( ...nsfw.mal.emote )}
            if ( nsfw.mon.channel.includes ( channel.id )) { emotes.push ( ...nsfw.mon.emote )}
            if ( nsfw.nbgf.channel.includes ( channel.id )) { emotes.push ( ...nsfw.nbgf.emote )}
            if ( nsfw.sat.channel.includes ( channel.id )) { emotes.push ( ...nsfw.sat.emote )}
            if ( nsfw.sun.channel.includes ( channel.id )) { emotes.push ( ...nsfw.sun.emote )}
            if ( nsfw.thur.channel.includes ( channel.id )) { emotes.push ( ...nsfw.thur.emote )}
            if ( nsfw.tues.channel.includes ( channel.id )) { emotes.push ( ...nsfw.tues.emote )}
            if ( nsfw.wed.channel.includes ( channel.id )) { emotes.push ( ...nsfw.wed.emote )}
        } else if ( BLchannelListSFW.includes ( channel.id )) { //sfw
            const sfw = BLemotes.sfw
            if ( sfw.hand_pics.channel.includes ( channel.id )) { emotes.push ( ...sfw.hand_pics.emote )}
            if ( sfw.selfies.channel.includes ( channel.id )) { emotes.push ( ...sfw.selfies.emote )}
            if ( sfw.suggestion.channel.includes ( channel.id )) { emotes.push ( ...sfw.suggestion.emote )}
        }
        for ( const emote of emotes ) {
            try {
                await message.react ( emote )
            } catch ( err ) {
                await logError ( `${ err }\nEmote: ${ emote }` )
            }
        }
    } else if ( await checkForPictures ( message ) && message.channel.id === '1051969089486209044') { //starlight selfie
        const starEmotes = [ '<a:Aladdin:1063871623779852358>', '<a:Aristocats:1063871582994436206>', '<a:olaf:1064970403589660742>', '<a:CheshireCat:1064970392663507074> ' ]
        for ( const emote of starEmotes ) {
            try {
                await message.react ( emote )
            } catch ( err ) {
                await logError ( `${ err }\nEmote: ${ emote }`)
            }
        }
    } else if ( await checkForPictures ( message ) && message.channel.id === '1051969109149098005') { //starlight male nude
        const starEmotes = [ '<a:Donaldcountingmoney:1064970391283581008>', '<a:ToyStory:1063871592746197062>', '<a:Gaston:1063871577948700724>', '<a:Hook:1063871570638024784> ' ]
        for ( const emote of starEmotes ) {
            try {
                await message.react ( emote )
            } catch ( err ) {
                await logError ( `${ err }\nEmote: ${ emote }`)
            }
        }
    } else if ( await checkForPictures ( message ) && message.channel.id === '1051969107865649173') { // starlight female nude
        const starEmotes = [ '<a:Donaldcountingmoney:1064970391283581008>', '<a:Tink:1063871616691486760>', '<a:Stitch2:1063872443455918260>', '<:winkpuppy:1064970396652286012> ' ]
        for ( const emote of starEmotes ) {
            try {
                await message.react ( emote )
            } catch ( err ) {
                await logError ( `${ err }\nEmote: ${ emote }`)
            }
        }
    } else if ( await checkForPictures ( message ) && message.channel.id === '1051969110449344522') { // starlight lgbtq nude
        const starEmotes = [ ':rainbow_flag: ', '<a:DisneyD:1063870141798035516>', '<a:Donaldcountingmoney:1064970391283581008>', '<a:MonstersInc:1063871600937685072>' ]
        for ( const emote of starEmotes ) {
            try {
                await message.react ( emote )
            } catch ( err ) {
                await logError ( `${ err }\nEmote: ${ emote }`)
            }
        }
    }
    switch ( channel.id ) {
        case '925139532754612234': //deletes autoresponders in the partner channel
            if ( await checkForBot ( author )) {
                await deleteMessage ( message )
            }
            break;
        case '925787445671374848':
        case '925140985586024498':
        case '925140947141005342': //deletes non picture messages in selfie chats
            if ( !await checkForPictures ( message )) {
                await deleteMessage ( message )
            }
            break;
        case '1046821280621535322': //flash and dash in devils Gate 
            if ( await checkForPictures ( message )) {
                const hookClient = new WebhookClient ({ id: process.env.webhookID, token: process.env.webhookToken })
                await message.guild.members.fetch ()
                if ( message.member.roles.cache.has ( '925162908860710952' ) || message.member.roles.cache.has ( '925163044026351626' ) || message.member.roles.cache.has ( '925163284099924009' ) || message.member.roles.cache.has ( '925163230794498068' ) || message.member.roles.cache.has ( '925163155716440146' ) || message.member.roles.cache.has ( '925163352076980295' ) || message.member.roles.cache.has ( '937007430183837740' )) {
                    if ( message.attachments && message.attachments.size !== 0 ) {
                        await hookClient.send ({
                            username: message.member.nickname ? message.member.nickname : message.author.username,
                            avatarURL: message.author.avatarURL (),
                            content,
                            embeds: message.attachments.map ( file => { return new EmbedBuilder ().setImage ( file.url )})
                        })
                    } else {
                        await hookClient.send ({
                            username: message.member.nickname ? message.member.nickname : message.author.username,
                            avatarURL: message.author.avatarURL (),
                            content,
                        })
                    }
                }
            }
            await deleteMessage ( message, 300 )
            break;
        case '1051969112777171034': //flash and dash in Starlight Lounge
            await deleteMessage ( message, 300 )
            break;
        case '1051931840249872496': //task channel
            await deleteMessage ( message, 7200 )
            break;
        case '1164963650180759662': // Psychedelic Dreamscape flash & dash
            await deleteMessage ( message, 300 )
            break
        case '1228889523950194788': // Pleasure Palace flash & dash
            await deleteMessage ( message, 300 )
            break
        case '1164959098274590810': // Psychedelic Dreamscape Suggestion
            if ( message.embeds.length !== 0 && message.embeds [ 0 ].description.toLowerCase ().startsWith ( 'suggestion by' ) && message.author.id === client.user.id ) {
                const emotes = [ '<:ZZthumbsup:1194663874968956948>', '<:ZZthumbsdown:1194663932489637898>']
                for ( const emote of emotes ) {
                    try {
                        await message.react ( emote )
                    } catch ( err ) {
                        await logError ( `${ err }\nEmote: ${ emote }`)
                    }
                }
            }
    }
})

client.on ( 'ready', async ( client ) => {
    console.log ( 'ready' )
    console.log ( client.user.username )
    const guildID = '1163861439111508019'
    const guild = client.guilds.cache.find ( guild => guild.id === guildID )
    const applications = guild.commands
    await applications.fetch ({ force: true })
    const guildList = applications.cache.map ( cmd => [ cmd.name, cmd.id ])
    // if ( !guildList.includes ( 'auction' )) {
    //     await applications.create ({
    //         name: 'auction',
    //         description: 'command to start an action',
    //         options: [{
    //             name: 'auction-text',
    //             description: 'the text you want displayed in for the auction',
    //             required: true,
    //             type: ApplicationCommandOptionType.String,
    //         }, {
    //             name : 'starting',
    //             description: 'the starting amount for the bids',
    //             required: true,
    //             type: ApplicationCommandOptionType.Number,
    //         }, {
    //             name : 'time',
    //             description: 'The time the Auction should last for in sec',
    //             required: true,
    //             type: ApplicationCommandOptionType.Number,
    //         }, {
    //             name: 'user',
    //             description: 'The User that will be auctioned',
    //             required: true,
    //             type: ApplicationCommandOptionType.User,
    //         }]
    //     })
    // }
    // if ( !guildList.includes ( 'bid' )){
    //     await applications.create ({
    //         name: 'bid',
    //         description: 'command to bid on someone',
    //         options: [{
    //             name: 'user',
    //             description: 'the User you want to bid on',
    //             required: true,
    //             type: ApplicationCommandOptionType.User,
    //         }, {
    //             name: 'bid',
    //             description: 'the Amount you want to bid on he specified User',
    //             required: true,
    //             type: ApplicationCommandOptionType.Number,
    //         }]
    //     })
    // }
    // if ( !guildList.includes ( 'clear-bids' )){
    //     await applications.create ({
    //         name: 'clear-bids',
    //         description: 'command to clear bids on a specific user',
    //         options: [{
    //             name: 'user',
    //             description: 'the User you want to clear the bids for',
    //             required: true,
    //             type: ApplicationCommandOptionType.User,
    //         }]
    //     })
    // }
    // if ( !guildList.includes ( 'get-bid' )){
    //     await applications.create ({
    //         name: 'get-bid',
    //         description: 'command to get the highest bid on a specific user',
    //         options: [{
    //             name: 'user',
    //             description: 'the User you want to get the highest bid for',
    //             required: true,
    //             type: ApplicationCommandOptionType.User,
    //         }]
    //     })
    // }
    if ( !guildList.includes ( 'confess' )) {
        await applications.create ({
            name: 'confess',
            description: 'confess something',
            options: [{
                name: 'confession',
                description: 'The confession/vent you want to send',
                required: true,
                type: ApplicationCommandOptionType.String,
            }]
        })
    }
    if ( !guildList.includes ( 'suggest' )) {
        await applications.create ({
            name: 'suggest',
            description: 'suggest something',
            options: [{
                name: 'suggestion',
                description: 'The suggestion you want to send',
                required: true,
                type: ApplicationCommandOptionType.String,
            }]
        })
    }
    const guildID2 = '1228271807178604626'
    const guild2 = client.guilds.cache.find ( guild => guild.id === guildID2 )
    const applications2 = guild2.commands
    await applications2.fetch ({ force: true })
    const guildList2 = applications2.cache.map ( cmd => [ cmd.name, cmd.id ])
    if ( !guildList.includes ( 'confess' )) {
        await applications2.create ({
            name: 'confess',
            description: 'confess something',
            options: [{
                name: 'confession',
                description: 'The confession/vent you want to send',
                required: true,
                type: ApplicationCommandOptionType.String,
            }]
        })
    }
    // applications.cache.forEach ( async cmd => await cmd.delete ())
    console.log(guildList);
    console.log(guildList2);
    // console.log(applications.cache);
    
    // mongoose.connect(process.env.MongoURL, {
    //     keepAlive: true
    // })
})

/**
 * 
 * @param {Interaction} interaction - the Interaction
 */
async function auction (interaction) {
    await interaction.reply({
        ephemeral: true,
        content: 'auction started'
    })
    const text = `${await interaction.options.getString('auction-text')}` || ' !!'
    let starting = await interaction.options.getNumber('starting') || 0
    const time = await interaction.options.getNumber('time')
    const user = await interaction.options.getUser('user')
    const _id = `${interaction.guild.id}-${user.id}`
    let currBid = _handler.bidHandler.getBid(_id)
    let bidder = starting < currBid[1] ? `<@${currBid[0]}>` : 'noone'
    starting = starting < currBid[1] ? currBid[1] : starting
    const timestamp = Math.floor((new Date().getTime() + (time * 1000)) / 1000)
    // console.log(`${new Date().getTime()} + ${time * 1000}\n${timestamp}`)
    const embed = new EmbedBuilder().setTitle(`Auction for: ${user.username}`).setDescription(`${text}`).addFields([{name: 'current Bid', value: `${starting}`}, {name: 'current Bidholder', value: bidder}, {name: 'time left', value: `<t:${timestamp}:R>`}])
    const buttons = [
        new ButtonBuilder()
        .setCustomId('100')
        .setLabel('100')
        .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
        .setCustomId('250')
        .setLabel('250')
        .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
        .setCustomId('500')
        .setLabel('500')
        .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
        .setCustomId('1000')
        .setLabel('1000')
        .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('cancel')
        .setStyle(ButtonStyle.Danger),
    ]
    const msg = await interaction.channel.send({
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(buttons)]
    })
    msg
    setTimeout(async() => {
        const oldEmbed = msg.embeds[0]
        if (!oldEmbed.fields[1]) return
        if (oldEmbed.fields[1].value === 'noone') {
            const newEmbed = new EmbedBuilder().setTitle(oldEmbed.title).setDescription(oldEmbed.description).addFields([{name: 'Winner', value: '__noone bid__'}])
            await msg.edit({embeds: [newEmbed], components: []})
            return
        }
        const newEmbed = new EmbedBuilder().setTitle(`${oldEmbed.title}`).setDescription(`${oldEmbed.description}`).addFields([{name: 'Winner', value: `${oldEmbed.fields[1].value}`, inline: true}, {name: 'Bid', value: `${oldEmbed.fields[0].value}`, inline: true}])
        await msg.edit({embeds: [newEmbed], components: []})
        await _handler.bidHandler.clearBid(_id)
    }, time * 1000);
}

/**
 * 
 * @param { TextBasedChannel } channel - the channel
 * @param { Number } messageCount - the amount of messages to be deleted 0 - 100
 * @returns { * } - The response
 */
async function bulkdelete ( channel, msgCount = 5 ) {
    let counter = 0
    for ( let i = -1; i < msgCount; i++ ) {
        let message = ( await channel.messages.fetch ({ limit: 1 })).first ()
        counter ++
        const del = await deleteMessage ( message, 0 )
        if ( del === false || i >= 99 ) {
            return {
                embeds: [
                    new MessageEmbed ()
                    .setDescription ( `You deleted ${ counter } messages!` )
                ]
            }
        }
    }
    return {
        embeds: [
            new MessageEmbed ()
            .setDescription ( `You deleted ${ counter } messages!` )
        ]
    }
}

/**
 * 
 * @param { User } author - The Member that should be checked
 * @returns { Boolean } - whether the Member is a Bot
 */
async function checkForBot ( author ) {
    return !!( author.bot )
}

/**
 * 
 * @param { Message } message - The Message that needs to be checked
 * @returns { Boolean } -  whether the message contained a Picture/Video
 */
async function checkForPictures ( message ) {
    if ( message.attachments && message.attachments.size !== 0 ) return true
    if ( message.content.includes ( '.png' )) return true
    if ( message.content.includes ( '.jepg' )) return true
    if ( message.content.includes ( '.jpg' )) return true
    if ( message.content.includes ( '.mov' )) return true
    if ( message.content.includes ( '.gif' )) return true
    return !!( message.content.includes ( '.mp4' ))
}

/**
 * 
 * @param {Interaction} interaction - the Interaction
 */
async function clearBid (interaction) {
    const user = interaction.options.getUser('user')
    const _id = `${interaction.guild.id}-${user.id}`
    const member = interaction.member
    if (!member.roles.cache.has(auctioneerRole)) {
        await interaction.reply({content: 'Missing Permission', ephemeral: true})
        return
    }
    await _handler.bidHandler.clearBid(_id)
    await interaction.reply({content: `Bids for ${user} have been cleared`, ephemeral: true})
}

/**
 * 
 * @param { String } command - The Command that should be executed
 * @param { User } author - The Author of that message
 * @param {[ String ]} args - The given Arguments if any
 * @param { Message } message - The Message the command was send through
 * @returns { * } - the respons
 */
async function command ( cmd, author, args = [], message = null ) {
    if ( await checkForBot ( author )) return false
    switch ( cmd ) {
        case 'dice':
            const max = args [ 0 ] || 6
            const roll = Math.floor ( Math.random () * max + 1 )
            return {
                content: `${ author } rolled a: ${ roll }`
            }
        case 'get':
            if ( !await permissionCheck ( message.member, Permissions.FLAGS.MANAGE_EMOJIS )) return false
            let msg_id = args [ 0 ]
            const msg = await message.channel.messages.fetch ( msg_id )
            let emote_num = args [ 1 ] || 1
            let emote_name = args [ 2 ]
            let content = msg.content.slice ( msg.content.indexOf ( '<' ), msg.content.lastIndexOf ( '>' )) + '>'
            let emote_ids = content.replace ( />/g, '> ' ).replace ( /<(a?):\w*:(?<ID>\d*)>\s*/g, `$1-$2/` ).split ( '/' ).pop ()
            let ID = emote_ids [ emote_num <= emote_ids.length ? emote_num -1 : emote_ids.length - 1 ].split ( '-' )[ 1 ]
            let Suffix = emote_ids [ emote_num <= emote_ids.length ? emote_num -1 : emote_ids.length - 1 ].split ('-')[ 0 ]
            let emote = 'https://cdn.discordapp.com/emojis/' + ID + Suffix === '' ? '.webp' : '.gif'
            try {
                await message.guild.emojis.create ( emote, emote_name )
                return {
                    embeds: [
                        new MessageEmbed ()
                        .setDescription ( `emoji ${ emote_name } has been added` )
                        .setImage ( emote )
                    ]
                }
            } catch ( err ) {
                await logError ( err )
                return false
            }
        case 'bulkdelete':
            if ( !await permissionCheck ( message.member, Permissions.FLAGS.ADMINISTRATOR )) return false
            let msgCount = args [ 0 ] || 5
            msgCount = isNaN ( msgCount ) ? parseInt ( msgCount.match ( /\d+/gm )) : Math.floor ( msgCount )
            return await bulkdelete ( message.channel, msgCount )
    }
    return false
}

/**
 * 
 * @param {Interaction} interaction - the Interaction
 */
async function suggestion ( interaction ) {
    const { member, options, guild } = interaction
    if ( guild.id === '1163861439111508019' ) { // psychedelic dreamscape
        const channelId = '1164959098274590810'
        const text = await options.getString( 'suggestion' )
        const channel = await guild.channels.cache.get ( channelId )
        const embed = new EmbedBuilder ()
        .setDescription ( `__Suggestion by ${ member }__\n\n${ text }` )
        .setTimestamp ()
        await interaction.deferReply ({ ephemeral: true })
        setTimeout ( async () => {
            await channel.send ({ embeds: [ embed ]})
            await interaction.editReply ({
                content: `Suggestion posted in: <#${ channel.id }>`,
                ephemeral: true,
            })
        }, 1000 * 2);
    } else await interaction.reply ({ ephemeral: true, content: 'sorry but this command is not enabled in this server'})
}

/**
 * 
 * @param {Interaction} interaction - the Interaction
 */
async function confession ( interaction ) {
    const { member, options, guild } = interaction
    if ( guild.id === '1051968270569328650' ) { // devils gate
        const channelId = '1052303295793877052'
        const text = await options.getString( 'text' )
        const channel = await guild.channels.cache.get ( channelId )
        const logChannel = await guild.channels.cache.get ( '1064967250605527132' )
        const embed = new EmbedBuilder ()
        .setDescription ( text )
        .setTimestamp ()
        .setTitle ( 'Anonymous confession' )
        const logEmbed = new EmbedBuilder ()
        .setDescription ( text )
        .setTimestamp ()
        .addFields ([
            { name: 'User', value: `||${ member.user.tag } - ${ member }||`, inline: false },
            { name: 'ID', value: `||${ member.id }||`, inline: false },
        ])
        .setTitle ( 'Anonymous confession' )
        await interaction.deferReply ({ ephemeral: true })
        setTimeout ( async () => {
            await channel.send ({ embeds: [ embed ]})
            await logChannel.send ({ embeds: [ logEmbed ]})
            await interaction.editReply ({
                content: `Confession posted in: <#${ channel.id }>`,
                ephemeral: true
            })
        }, 1000 * 2);
    } else if ( guild.id === '1163861439111508019' ) { // psychedelic dreamscape
        const channelId = '1164963763540217936'
        const text = await options.getString( 'confession' )
        const channel = await guild.channels.cache.get ( channelId )
        const logChannel = await guild.channels.cache.get ( '1164957806772891769' )
        const embed = new EmbedBuilder ()
        .setDescription ( text )
        .setTimestamp ()
        .setTitle ( 'Anonymous confession' )
        const logEmbed = new EmbedBuilder ()
        .setDescription ( text )
        .setTimestamp ()
        .addFields([
            { name: 'User', value: `||${ member.user.tag } - ${ member }||`, inline: false },
            { name: 'ID', value: `||${ member.id }||`, inline: false },
        ])
        .setTitle ( 'Anonymous confession' )
        await interaction.deferReply ({ ephemeral: true })
        setTimeout ( async () => {
            await channel.send ({ embeds: [ embed ]})
            await logChannel.send ({ embeds: [ logEmbed ]})
            await interaction.editReply ({
                content: `Confession posted in: <#${ channel.id }>`,
                ephemeral: true
            })
        }, 1000 * 2);
    } else if ( guild.id === '1228271807178604626' ) { // Pleasure Palace
        const channelId = '1228890631972196423'
        const text = await options.getString( 'confession' )
        const channel = await guild.channels.cache.get ( channelId )
        const logChannel = await guild.channels.cache.get ( '1228893633806205009' )
        const embed = new EmbedBuilder ()
        .setDescription ( text )
        .setTimestamp ()
        .setTitle ( 'Anonymous confession' )
        const logEmbed = new EmbedBuilder ()
        .setDescription ( text )
        .setTimestamp ()
        .addFields([
            { name: 'User', value: `||${ member.user.tag } - ${ member }||`, inline: false },
            { name: 'ID', value: `||${ member.id }||`, inline: false },
        ])
        .setTitle ( 'Anonymous confession' )
        await interaction.deferReply ({ ephemeral: true })
        setTimeout ( async () => {
            await channel.send ({ embeds: [ embed ]})
            await logChannel.send ({ embeds: [ logEmbed ]})
            await interaction.editReply ({
                content: `Confession posted in: <#${ channel.id }>`,
                ephemeral: true
            })
        }, 1000 * 2);
    } else if ( guild.id === '924511526063341618' ) { // the server thats gone
        const channelId = await options.getString ( 'type' )
        const text = await options.getString ( 'text' )
        const channel = await guild.channels.cache.get ( channelId )
        const logChannel = await guild.channels.cache.get ( '925139238410936370' )
        const embed = new EmbedBuilder ()
        .setDescription ( text )
        .setTimestamp ()
        const logText = `${ text.replace ( /(?<begin>[\w\d\s]*)\|\|(?<middle>[\w\d\s]*)\|\|(?<end>[\w\d\s]*)/g, '||$<begin>|| {||$<middle>||} ||$<end>||' )}`
        const logEmbed = new EmbedBuilder ()
        .setDescription ( logText )
        .setTimestamp ()
        .addFields ([
            { name: 'Channel', value: `<#${ channelId }>`, inline: false },
            { name: 'User', value: `||${ member.user.tag } - ${ member }||`, inline: false },
            { name: 'ID', value: `||${ member.id }||`, inline: false },
        ])
        switch ( channelId ) {
            case '1034688783397953556': //sfw vent
                embed.setTitle ( 'SFW Vent' )
                logEmbed.setTitle ( 'SFW Vent' )
                break;
            case '1034689314380062792': //nsfw vent
                embed.setTitle ( 'NSFW Vent' )
                logEmbed.setTitle ( 'NSFW Vent' )
                break;
            case '1036803429760237568': //confession
                embed.setTitle ( 'Anonymous confession' )
                logEmbed.setTitle ( 'Anonymous confession' )
                break;
        }
        await interaction.deferReply ({ ephemeral: true })
        setTimeout ( async () => {
            await channel.send ({ embeds: [ embed ]})
            await logChannel.send ({ embeds: [ logEmbed ]})
            await interaction.editReply ({
                content: `<#${channelId}>\n${text}`,
                // embeds: [ embed ],
                ephemeral: true,
            })
        }, 1000 * 2 );
    }
}

/**
 * 
 * @param { Message } message - the Message that should be deleted
 * @param { Number } timeOffset - The Time in sec after which the message should be deleted
 * @returns { Boolean } - whether the Deletion went through
 */
async function deleteMessage ( message, timeOffset = 0 ) {
    if ( !message ) return false
    try {
        await timer ( timeOffset * 1000 )
        if ( !message ) return false
        await message.delete ()
        return true
    } catch ( err ) {
        if ( typeof err === 'string' && err === 'DiscordAPIError[10008]: Unknown Message') return false
        await logError ( err )
        return false
    }
}

/**
 * 
 * @param {Interaction} interaction - the Interaction
 */
async function getBid (interaction) {
    const user = interaction.options.getUser('user')
    const _id = `${interaction.guild.id}-${user.id}`
    const currBid = _handler.bidHandler.getBid(_id)
    if (currBid[0] === '0') {
        await interaction.reply({ content: `${user} hasn't been bid on`, ephemeral: true })
        return
    }
    await interaction.reply({ content: `<@${currBid[0]}> holds the highest bid for ${user} at ${currBid[1]}` })
}

/**
 * 
 * @param { String } errorMessage - Error Message
 */
async function logError ( errorMessage ) {
    let now = new Date ()
    let time = {
        Year: now.getFullYear (),
        Month: now.getMonth () + 1,
        Day: now.getDate (),
        Hour: now.getHours (),
        Minutes: now.getMinutes (),
        Seconds: now.getSeconds (),
    }
    const fileName = `Error_${ time.Year }-${ time.Month }-${ time.Day }_${ time.Hour }-${ time.Minutes }-${ time.Seconds }`
    fs.writeFile ( `errors/${ fileName }`, `Error: "${errorMessage}"`, function ( err ) {
        if ( err ) throw err
        console.log ( 'Error Log created' )
    })
}

/**
 * 
 * @param { GuildMember } member - The Member that the check should be ran for
 * @param { Permissions.FLAGS } Permission - The Permission that should be checked
 * @returns { Boolean } - Whether the Member has the provided Permission
 */
async function permissionCheck ( member, Permission ) {
    return !!( member.permissions.has ( Permission ))
}

/**
 * 
 * @param {Interaction} interaction - the Interaction
 */
async function placeBid (interaction) {
    const user = interaction.options.getUser('user')
    const bid = interaction.options.getNumber('bid')
    const member = interaction.member
    const _id = `${interaction.guild.id}-${user.id}`
    const currBid = _handler.bidHandler.getBid(_id)
    if (currBid[0] === member.id) {
        await interaction.reply({
            content: 'you already are the highest bidder',
            ephemeral: true
        })
        return
    }
    if (currBid[1] >= bid) {
        await interaction.reply({
            content: 'your bid is to low',
            ephemeral: true
        })
        return
    }
    await _handler.bidHandler.setBid(_id, bid, member.id)
    await interaction.reply({
        content: `${member} just bid ${bid} on ${user}\nif you want to bid yourself use </bid:${interaction.commandId}>`,
        allowedMentions: {
            users: []
        }
    })
}

/**
 * 
 * @param { number } ms - the time to stop for (in milisec.)
 * @returns { * } -nothing
 */
async function timer ( ms ) { return new Promise ( res => setTimeout ( res, ms )) }
