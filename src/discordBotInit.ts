import 'reflect-metadata';
import { Intents, Interaction, Message } from 'discord.js';
import { Client } from 'discordx';
import { dirname, importx } from '@discordx/importer';
import { DISCORD_BOT_TOKEN } from './secrets';

export const discordClient = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
  // If you only want to use global commands only, comment this line
  botGuilds: [
    (discordClient) => discordClient.guilds.cache.map((guild) => guild.id),
  ],
});

discordClient.once('ready', async () => {
  // make sure all guilds are in cache
  await discordClient.guilds.fetch();

  // // clear all guild commands
  // // useful when moving to global commands from guild commands
  // await discordClient.clearApplicationCommands(
  //   ...discordClient.guilds.cache.map((g) => g.id)
  // );

  // init all application commands
  await discordClient.initApplicationCommands({
    guild: { log: true },
    global: { log: true },
  });

  // discordClient.guilds.cache.map((g) =>
  //   g.me?.setNickname('MarsColonyPriceBot')
  // );

  // discordClient.guilds.cache.forEach((guild, guildId) => {
  //   if (guild) {
  //     guild.channels.create('Text', {
  //       permissionOverwrites: [
  //         {
  //           id: guildId,
  //           allow: ['VIEW_CHANNEL'],
  //         },
  //       ],
  //     });
  //   }
  // });

  // init permissions; enabled log to see changes
  await discordClient.initApplicationPermissions(true);

  console.log('Discord bot started');
});

discordClient.on('interactionCreate', (interaction: Interaction) => {
  discordClient.executeInteraction(interaction);
});

discordClient.on('messageCreate', (message: Message) => {
  discordClient.executeCommand(message);
});

export async function discordBotInit() {
  // with cjs
  // await importx(__dirname + '/{discord,replies}/**/*.{ts,js}');
  // with ems
  await importx(
    dirname(import.meta.url) + '/{discord,replies,resources,utils}/**/*.{ts,js}'
  );

  await discordClient.login(DISCORD_BOT_TOKEN);
}
