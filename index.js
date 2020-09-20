require('dotenv').config();
const Discord = require('discord.js');
const Fight = require ('./Fight').fight;
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

const fight = new Fight([], 1);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  console.log(msg.author.username)
  console.log(msg.mentions.members.array())
  if (msg.content === 'ping') {
    msg.reply('pong');
    msg.channel.send('pong');

  } else if (msg.content.startsWith('!fight')) {
    if (msg.mentions.users.size) {
      msg.mentions.users.forEach(user => fight.addParticipant(msg.author.username))
      const taggedUser = msg.mentions.users.first();
      msg.channel.send(`People have joined the fight arena! ${fight.getStatus()}`);
    } else {
      msg.reply('Please tag a valid user!');
    }
  } else if (msg.content.startsWith('!attack')) {
      if (msg.mentions.users.size > 1) {
        msg.reply('You can only attack one user at a time.')
      } else {
        msg.reply(fight.attack(msg.author.username, msg.mentions.users[0].username))
      }
  } else if (msg.content.startsWith('!heal')) {
    if (msg.mentions.users.size > 1) {
      msg.reply('You can only heal one user at a time.')
    } else {
      msg.reply(fight.heal(msg.author.username, msg.mentions.users[0].username))
    }
}
});
