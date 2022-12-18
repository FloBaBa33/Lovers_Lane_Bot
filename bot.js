const { Client, IntentsBitField, EmbedBuilder, ApplicationCommandOptionType } = require ( 'discord.js' )
const fs = require ( 'fs' )
require ( 'dotenv' ).config ()
const prefix = '..'
const selfies = {
    channel: [ '925140985586024498', '925787445671374848', '1042413286920044614', '1042413344658829432', '1042413455199715379', '1042413489324568576', '1042413608589598810', '1042413658724114502', '1042413738516549662' ], 
    Emote: [ '<a:shy:925133935288152115>', '<a:Read_Love1:958018980449251438>', '<:cute:925133308222898258>', '<a:money:924723385135693864>', '<:looking1:925132681094787103>', '<:yay:924546690999021588>' ]
}
const nsfw = {
    channel: [ '925142273358962809', '925142320893014079', '925142747202068601', '925787556984012870', '1042058111063695462', '1042058126670700595', '1042058139392024666', '1042058171134521354', '1042058188947718144', '1042058202201722952', '1042058236255285268' ], 
    Emote: [ '<:CumInMe:931904877062393857>', '<:blush:924546130681946123>', '<:mood:927682713375363113>', '<:letsfuck:931058882594357288>', '<a:horny:927682380343443476>', '<:tieup:925621143010967622>' ]
}
const smash = {
    channel: [ '1042068642961035385' ], 
    Emote: [ '<:smash:1042067266252066856>', '<:pass:1042067231053455442>' ]
}

const client = new Client ({
    intents: [ IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.MessageContent ]
})

client.on ( 'error', async ( error ) => {
    await logError(error.message)
})

client.on ( 'interactionCreate', async ( interaction ) => {
    if ( !interaction.isCommand ()) return
    const { commandName, member, options, guild } = interaction
    switch ( commandName ) {
        case 'confess':
            const channelId = await options.getString ( 'type' )
            const text = await options.getString ( 'text' )
            const channel = await guild.channels.cache.get ( channelId )
            const logChannel = await guild.channels.cache.get ( '925139238410936370' )
            const embed = new EmbedBuilder ()
            .setDescription ( text )
            .setTimestamp ()
            const logEmbed = new EmbedBuilder ()
            .setDescription ( text )
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
                    content: `${channelId}\n${text}`,
                    // embeds: [ embed ],
                    ephemeral: true,
                })
            }, 1000 * 2 );
            break;
        case 'test':break;
        case 'test2':break;
    }
})

client.login ( process.env.TOKEN )

client.on ( 'messageCreate', async ( message ) => {
    const { channel, content, author } = message

    if ( content.startsWith ( prefix )) {
        let cmd = content.slice ( prefix.length ).split ( ' ' )[ 0 ]
        let args = content.slice ( prefix.length + cmd.length ).split ( ' ' )
        let cmd_res = await command ( cmd, author, args, message )
        if ( cmd_res !== false ) return await message.reply ( cmd_res )
    }
    if ( await checkForPictures ( message ) && selfies.channel.includes ( channel.id )) {
        for ( const emote of selfies.Emote ) {
            try {
                await message.react ( emote )
            } catch ( err ) {
                await logError ( `${err}\nEmote: ${emote}` )
            }
        }
    } else if ( await checkForPictures ( message ) && nsfw.channel.includes( channel.id )) {
        for ( const emote of nsfw.Emote ) {
            try {
                await message.react ( emote )
            } catch ( err ) {
                await logError ( `${err}\nEmote: ${emote}` )
            }
        }
    } else if ( await checkForPictures ( message ) && smash.channel.includes ( channel.id )) {
        for ( const emote of smash.Emote ) {
            try {
                await message.react ( emote )
            } catch ( err ) {
                await logError ( `${err}\nEmote: ${emote}` )
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
        case '1046821280621535322': //flash and dash
            await deleteMessage ( message, 300 )
            break;
        case '1051931840249872496': //task channel
            await deleteMessage ( message, 2 * 60 * 60 )
            break;
    }
})

client.on ( 'ready', async ( client ) => {
    console.log ( 'ready' )
    console.log ( client.user.username )
})

/**
 * 
 * @param { Message } message - The Message that needs to be checked
 * @returns { Boolean } -  whether the message contained a Picture/Video
 */
async function checkForPictures ( message ) {
    if ( message.attachments && message.attachments.size !== 0 ) return true
    if ( message.content.includes ( '.png' )) return true
    if ( message.content.includes ( '.jepg' )) return true
    return !!( message.content.includes ( '.mp4' ))
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
        await logError ( err )
        return false
    }
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
 * @param { GuildMember } member - The Member that the check should be ran for
 * @param { Permissions.FLAGS } Permission - The Permission that should be checked
 * @returns { Boolean } - Whether the Member has the provided Permission
 */
async function permissionCheck ( member, Permission ) {
    return !!( member.permissions.has ( Permission ))
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
 * @param { number } ms - the time to stop for (in milisec.)
 * @returns { * } -nothing
 */
async function timer ( ms ) { return new Promise ( res => setTimeout ( res, ms )) }
