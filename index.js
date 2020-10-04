require('dotenv').config();
const Discord = require('discord.js');
const Fight = require ('./Fight').fight;
const Spacebattle = require('./Spacebattle').Spacebattle
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

const fight = new Fight([], 1);
const spaceBattle = new Spacebattle()
spaceBattle.createAlienFleet(5)

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
    } else if (msg.content.startsWith('!spacebattle')) {
      if (msg.content.includes('create ship')) {
        console.log('create ship')
        return msg.channel.send(embedFormatter(msg, spaceBattle.createShip(msg)))
      } else if (msg.content.includes('fight')) {
        console.log('fight')
        spaceBattle.battle(msg)
      } else {
        console.log('get status')
        msg.channel.send(embedFormatter(msg, spaceBattle.getStatus(msg)))
        msg.channel.send(`${spaceBattle.alienShips.length} Alien ships are left`)
      }
    }
  } catch (e) {
    console.log(e.toString())
    msg.reply(e.toString())
  }
  
});

function embedFormatter(msg, ship) {
  // console.log(msg, ship)
  // const embed = new Discord.MessageEmbed(msg, ship)
  // .setTitle(ship.name)
  // .setDescription("A Sturdy ship")
  // .setImage("https://static.turbosquid.com/Preview/2019/03/30__02_33_41/athena_signature2_1480x800.jpg06030FA6-FD3D-4565-B9FE-2AE4196349FADefaultHQ.jpg")
  // .setThumbnail("https://static.turbosquid.com/Preview/2019/03/30__02_33_41/athena_signature2_1480x800.jpg06030FA6-FD3D-4565-B9FE-2AE4196349FADefaultHQ.jpg")
  // .addFields({name: 'Hull', value: `${ship.hull}`})
  // .addFields({name: 'Firepower', value: `${ship.firepower}`})
  // .addFields({name: 'Accuracy', value: `${ship.accuracy}`})
  // .addFields({name: 'Firepower', value: `${ship.firepower}`})

  // return embed
  return {
      "content": `${ship.name} is on station!`,
      "embed": {
        "title": ship.name,
        "description": "A sturdy ship",
        "url": "https://discordapp.com",
        "color": 16562303,
        "timestamp": "2020-10-04T14:03:30.578Z",
        "footer": {
          "icon_url": "https://static.turbosquid.com/Preview/2019/03/30__02_33_41/athena_signature2_1480x800.jpg06030FA6-FD3D-4565-B9FE-2AE4196349FADefaultHQ.jpg",
          "text": "footer text"
        },
        "thumbnail": {
          "url": "https://static.turbosquid.com/Preview/2019/03/30__02_33_41/athena_signature2_1480x800.jpg06030FA6-FD3D-4565-B9FE-2AE4196349FADefaultHQ.jpg"
        },
        "image": {
          "url": "https://static.turbosquid.com/Preview/2019/03/30__02_33_41/athena_signature2_1480x800.jpg06030FA6-FD3D-4565-B9FE-2AE4196349FADefaultHQ.jpg"
        },
        "author": {
          "name": `${ship.name}`,
          "url": "https://discordapp.com",
          "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"
        },
        "fields": [
          {
            "name": `Hull strength`,
            "value": `${ship.hull}`,
          },
          {
            "name": 'Firepower',
            "value": `${ship.firepower}`,
          },
          {
            "name": "Accuracy",
            "value": `${ship.accuracy}`,
            "inline": true
          },
          {
            "name": "Damage Control",
            "value": `${ship.damageControl}`,
            "inline": true
          },
          {
            "name": "Kills",
            "value": `${ship.kills}`,
            "inline": true
          }
        ]
      }
    }
}
