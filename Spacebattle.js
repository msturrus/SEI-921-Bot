const Discord = require('discord.js');

class Spacebattle {
    constructor() {
        this.playerShips = []
        this.alienShips = []
        this.playerFleets = []
    }

    createShip(msg) {
        if (this.playerShips.length && this.playerShips.find(ship => ship.name.includes(msg.author))) {
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

    createPlayerFleet(msg) {
        if (this.playerFleets.length && this.playerFleets.find(fleet => fleet.commander === msg.author)) {
            return msg.channel.send('You already have a fleet!')
        }
        const fleet = new Fleet(msg.author)
        fleet.addShip(this.playerShips.find(ship => ship.name === msg.author))
        this.playerFleets.push(fleet)
        return msg.channel.send(`${msg.author} created a new fleet, type !spacebattle join fleet ${msg.author} to join`)
    }

    upgradeShip(msg, stat) {
        const ship = this.playerShips.find(ship => ship.name.includes(msg.author))
        if (ship && Object.keys(ship).includes(stat) && ship.xp >= 10) {
            ship[stat]++
            ship.xp -= 10
            msg.channel.send(`Ship upgraded`)
        } else {
            msg.reply(`Sorry, either you specified no stat to upgrade or you don't have any upgrade points`)
        }
        return this.getStatus(msg)
    }

    fleetBattle(msg) {
        const fleet = this.playerFleets.find(fleet => fleet.commander === msg.author)
        if (!fleet) {
            return msg.channel.send('You are not commanding a fleet')
        }
        fleet.ships.forEach(ship => {
            ship.attack(this.alienShips[0])
        })
        if (this.alienShips[0].hull > 0) {
            this.alienShips[0].attack(fleet.ships[Math.floor(Math.random() * fleet.ships.length)])
        } else {
            msg.channel.send(`Alien ship destroyed!  All members of the fleet gain 1 xp`)
            fleet.ships.forEach(ship => ship.xp++)
        }
        for (let i = 0; i < fleet.ships.length; i++) {
            if (fleet.ships[i].hull < 0) {
                msg.channel.send(`${fleet.ships[i].name} has taken heavy damage and is forced to leave the fleet!`)
                delete fleet.ships[i]
            }
        }
    }

    battle(msg) {
        if (this.alienShips.length === 0) {
            this.createAlienFleet(5)
            return msg.channel.send('You won!  Generating new alien fleet...')
        }
        if (!this.playerShips.length || !this.playerShips.find(ship => ship.name.includes(msg.author))) {
            return msg.reply('You must create a ship first!  try !spacebattle create ship')
        }
        let playerShip = this.playerShips.find(ship => ship.name.includes(msg.author))
        let initialHull = playerShip.hull
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
        playerShip.hull = playerShip.hull + playerShip.damageControl > initialHull ? initialHull : playerShip.hull + playerShip.damageControl
        playerShip.kills++
        playerShip.xp += 5
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
        this.xp = 0
    }

    attack(msg, enemyShip) {
        if (Math.random() < this.accuracy) {
            enemyShip.hull -= this.firepower
            return msg.channel.send(`${this.name} hits ${enemyShip.name} for ${this.firepower} damage!`)
        }
        return msg.channel.send(`${this.name} missed!`)
    }
}

class Fleet {
    constructor (commander) {
        this.commander = commander
        this.ships = []
    }

    removeShip(msg) {
        this.playerShips.splice(this.playerShips.indexOf(ship => ship.name === msg.author), 1)
        msg.channel.send(`${msg.author}'s ship has left ${this.commander}'s fleet`)
    }

    addShip(ship) {
        this.ships.push(ship)
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