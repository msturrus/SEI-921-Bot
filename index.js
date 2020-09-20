require('dotenv').config();
const Discord = require('discord.js');
const Fight = require ('/fight');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

const fight = new Fight([], 1);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  console.log(msg)
  if (msg.content === 'ping') {
    msg.reply('pong');
    msg.channel.send('pong');

  } else if (msg.content.startsWith('!fight')) {
    if (msg.mentions.users.size) {
      msg.mentions.users.forEach(user => fight.add(user.username))
      const taggedUser = msg.mentions.users.first();
      msg.channel.send(`People have joined the fight arena! ${fight.status()}`);
    } else {
      msg.reply('Please tag a valid user!');
    }
  } else if (msg.content.startsWith('!attack')) {
      if (msg.mentions.users.size > 1) {
        msg.reply('You can only attack one user at a time.')
      } else {
        msg.reply(fight.attack(msg.sender.username, msg.mentions.users[0].username))
      }
  }
});
