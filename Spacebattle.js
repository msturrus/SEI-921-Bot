const Discord = require('discord.js');

class Spacebattle {
    constructor() {
        this.playerShips = []
        this.alienShips = []
    }

    createShip(msg) {
        if (this.playerShips.find(ship => ship.name.includes(msg.author))) {
            return this.playerShips.find(ship => ship.name.includes(msg.author))
        }
        const ship = new Ship('USS ' + msg.author)
        this.playerShips.push(ship)
        console.log(this.playerShips)
        // console.log(embedFormatter(ship))
        return ship
    }

    createAlienFleet(amount) {
        for (let i = 0; i < amount; i++) {
            this.alienShips.push(new Ship('Alien Ship #' + i, 5, 5, .5, 0))
        }
        console.log(this.alienShips)
    }

    battle(msg) {
        if (this.alienShips.length === 0) {
            this.createAlienFleet(5)
            return msg.channel.send('You won!  Generating new alien fleet...')
        }
        let playerShip = this.playerShips.find(ship => ship.name.includes(msg.author))
        let alienShip = this.alienShips[0]
        console.log(playerShip)
        while (playerShip.hull > 0 && alienShip.hull > 0) {
            console.log(playerShip.hull, alienShip.hull)
            playerShip.attack(msg, alienShip)
            if (alienShip.hull > 0) {
                alienShip.attack(msg, playerShip)
            }
        }
        playerShip.hull ? this.alienShips.shift() : this.playerShips.splice(this.playerShips.indexOf(ship => ship.name === playerShip.name), 1)
        playerShip.hull += playerShip.damageControl
        playerShip.kills++
        return msg.channel.send(playerShip.hull > 0 ? `${playerShip.name} has prevailed!` : `${playerShip.name} has been destroyed!`)

    }

    getStatus(msg) {
        return this.playerShips.find(ship => ship.name.includes(msg.author)) || {name: "destroyed", hull: 0, firepower: 0, accuracy: 0, damageControl: 0}
    }

}

class Ship {
    constructor(name, hull, firepower, accuracy, damageControl) {
        this.name = name
        this.hull = hull || Math.floor(Math.random() * 20) + 5
        this.firepower = firepower || Math.floor(Math.random() * 5) + 5
        this.accuracy = accuracy || (Math.floor(Math.random() * 5) + 5) / 10
        this.damageControl = damageControl || Math.floor(Math.random() * 5) + 5
        this.kills = 0
    }

    attack(msg, enemyShip) {
        if (Math.random() < this.accuracy) {
            enemyShip.hull -= this.firepower
            return msg.channel.send(`${this.name} hits ${enemyShip.name} for ${this.firepower} damage!`)
        }
        return msg.channel.send(`${this.name} missed!`)
    }
}

function embedFormatter(ship) {
    const embed = new Discord.MessageEmbed()
    .setTitle(`${ship.name}`)
    .setDescription("A Sturdy ship")
    .setImage("https://static.turbosquid.com/Preview/2019/03/30__02_33_41/athena_signature2_1480x800.jpg06030FA6-FD3D-4565-B9FE-2AE4196349FADefaultHQ.jpg")
    .setThumbnail("https://static.turbosquid.com/Preview/2019/03/30__02_33_41/athena_signature2_1480x800.jpg06030FA6-FD3D-4565-B9FE-2AE4196349FADefaultHQ.jpg")
    .addFields({name: 'Hull', value: `${ship.hull}`})
    .addFields({name: 'Firepower', value: `${ship.firepower}`})
    .addFields({name: 'Accuracy', value: `${ship.accuracy}`})
    .addFields({name: 'Firepower', value: `${ship.firepower}`})

    return embed
    // return {
    //     "content": `${ship.name} is on station!`,
    //     "embed": {
    //       "title": ,
    //       "description": "A sturdy ship",
    //       "url": "https://discordapp.com",
    //       "color": 16562303,
    //       "timestamp": "2020-10-04T14:03:30.578Z",
    //       "footer": {
    //         "icon_url": "https://static.turbosquid.com/Preview/2019/03/30__02_33_41/athena_signature2_1480x800.jpg06030FA6-FD3D-4565-B9FE-2AE4196349FADefaultHQ.jpg",
    //         "text": "footer text"
    //       },
    //       "thumbnail": {
    //         "url": "https://cdn.discordapp.com/embed/avatars/0.png"
    //       },
    //       "image": {
    //         "url": "https://cdn.discordapp.com/embed/avatars/0.png"
    //       },
    //       "author": {
    //         "name": `${ship.name}`,
    //         "url": "https://discordapp.com",
    //         "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"
    //       },
    //       "fields": [
    //         {
    //           "name": `Hull strength`,
    //           "value": `${ship.hull}`,
    //         },
    //         {
    //           "name": 'Firepower',
    //           "value": `${ship.firepower}`,
    //         },
    //         {
    //           "name": "Accuracy",
    //           "value": `${ship.accuracy}`,
    //           "inline": true
    //         },
    //         {
    //           "name": "Damage Control",
    //           "value": `${ship.damageControl}`,
    //           "inline": true
    //         }
    //       ]
    //     }
    //   }
}

module.exports.Spacebattle = Spacebattle