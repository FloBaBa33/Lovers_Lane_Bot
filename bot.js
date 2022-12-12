const { Client, IntentsBitField, EmbedBuilder, ApplicationCommandOptionType } = require ( 'discord.js' )
require ( 'dotenv' ).config ()

const client = new Client ({
    intents: [ IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.MessageContent ]
})

client.login ( process.env.TOKEN )

client.on ( 'ready', async ( client ) => {
    console.log ( 'ready' )
    console.log ( client.user.username )

    const guildId = '938165561043599421'
    const guild = client.guilds.cache.get ( guildId )
    const commands = guild ? guild.commands : client.application.commands

    // commands.create({
    //     name: 'confess',
    //     description: 'confess something',
    //     options: [{
    //         name: 'type',
    //         description: 'the type of confession',
    //         choices: [{
    //             name: 'sfw vent',
    //             value: '1034688783397953556',
    //         }, {
    //             name: 'nsfw vent',
    //             value: '1034689314380062792',
    //         }, {
    //             name: 'anonymous confession',
    //             value: '1036803429760237568',
    //         }],
    //         type: ApplicationCommandOptionType.String,
    //         required: true
    //     }, {
    //         name: 'text',
    //         description: 'The confession/vent you want to send',
    //         type: ApplicationCommandOptionType.String,
    //         required: true,
    //     }]
    // })
    let currguild = await guild.commands.fetch ()
    let currglobal = await client.application.commands.fetch ()

    // console.log( [...currglobal, ...currguild] );
    // console.log(currguild.map((cmd) => `${cmd.name} - ${cmd.id} - ${cmd.options}`));
    // console.log(currguild.map((cmd) => cmd.options));
    // console.log(currguild.map((cmd) => cmd.options[0].choices));

    // currguild.forEach (( cmd ) => {
    //     cmd.delete()
    // })
    // currglobal.forEach (( cmd ) => {
    //     cmd.delete()
    // })
})

client.on ( 'interactionCreate', async (interaction) => {
    if ( !interaction.isCommand()) return
    const { commandName, member, options, guild } = interaction
    // console.log ( member )
    switch ( commandName ) {
        case 'ping':
            const string = await options.getString ( 'test' )
            await interaction.reply ({
                content: string,
                ephemeral: true,
            })
            break;
        case 'confess':
            const channelId = await options.getString ( 'type' )
            const text = await options.getString ( 'text' )
            const channel = await guild.channels.cache.get ( channelId )
            const logChannel = await guild.channels.cache.get ( '996501239351218357' )
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
            switch (channelId) {
                case '1034688783397953556': //sfw vent
                    embed.setTitle ( 'SFW Vent' )
                    logEmbed.setTitle ( 'SFW Vent' )
                    break;
                case '1034689314380062792': //nsfw vent
                    embed.setTitle ( 'NSFW Vent' )
                    logEmbed.setTitle ( 'NSFW Vent' )
                    break;
                case '1036803429760237568': //confession
                    embed.setTitle ( 'NSFW Vent' )
                    logEmbed.setTitle ( 'NSFW Vent' )
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
            }, 1000 * 5 );
            break;
    }
})
