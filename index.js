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
  try {
    console.log(msg.author.username)
    console.log(msg.mentions.users.array())
    if (msg.content === 'ping') {
      msg.reply('pong');
      msg.channel.send('pong');

    } else if (msg.content.startsWith('!fight')) {
      if (msg.mentions.users.size) {
        fight.addParticipant(msg.author.username)
        msg.mentions.users.array().forEach(user => fight.addParticipant(user.username))
        const taggedUser = msg.mentions.users.first();
        msg.channel.send(`People have joined the fight arena! ${fight.getStatus()}`);
      } else {
        msg.reply('Please tag a valid user!');
      }
    } else if (msg.content.startsWith('?cat')) {
        console.log(msg.content)
        msg.channel.send(`*woof! woof!*`);
    } else if (msg.content.startsWith('!getcat')) {
        msg.channel.send('*looks for cat*')
        msg.channel.send('?cat')
    } else if (msg.content.startsWith('?')) {
        if (Math.random() > .9) {
          msg.channel.send(`*grows jealous of Dyno*`);
        }
    } else if (msg.content.startsWith('!attack')) {
        if (msg.mentions.users.size > 1 || !msg.mentions.users.array()[0].username) {
          msg.reply('You can only attack one user at a time.')
        } else {
          msg.reply(fight.attack(msg.author.username, msg.mentions.users.array()[0].username))
        }
    } else if (msg.content.startsWith('!heal')) {
      if (msg.mentions.users.size > 1 || !msg.mentions.users.array()[0].username) {
        msg.reply('You can only heal one user at a time.')
      } else {
        msg.reply(fight.heal(msg.author.username, msg.mentions.users.array()[0].username))
      } 
    } else if (msg.content.startsWith('!rps')) {
        if (msg.content.includes('rock')) {
          msg.reply('I choose paper.  I win')
        } else if (msg.content.includes('paper')) {
          msg.reply('I choose scissors.  I win')
        } else if (msg.content.includes('scissors')) {
          msg.reply('I choose rock.  I win')
        }
    } else if (msg.content.startsWith('!eval')) {
      console.log(eval(msg.content.replace('!eval ', '')))
      try {
        msg.reply('`' + eval(msg.content.replace('!eval ', '')) + '`')
      } catch (e) {
        console.log(e.toString())
        msg.reply('`' + e.toString() + '`')
      }
    } else if (msg.content.startsWith('!dance') || msg.content.startsWith('!dancing')) {
      msg.channel.send('*dances vigorously*')
    }
  } catch (e) {
    console.log(e.toString())
    msg.reply(e.toString())
  }
  
});
