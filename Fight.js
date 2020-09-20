class Fight {
    constructor(names, id) {
        this.id = id
        this.participants = names.map(name => new Participant(name));
    }

    addParticipant(name) {
        if (this.participants.find(participant => participant.name === name)) {
            return `${name} is already in the fight!`
        }
        const newcomer = new Participant(name)
        this.participants.push(newcomer);
        return `{newcomer.name} has joined the fight!`
    }

    attack (attacker, defender) {
        const defender = this.participants.find(participant => participant.name === defender)
        const damage = Math.floor(Math.random() * 10)
        defender.hp -= damage
        return `${attacker} attacks ${defender} for ${damage} damage!  ${defender} has ${defender.hp} hp left!`
    }

    heal (healer, heelee) {
        const heelee = this.participants.find(participant => participant.name === heelee)
        const damage = Math.floor(Math.random() * 5)
        defender.hp += damage
        return `${healer} heals ${heelee} for ${damage} damage!  ${heelee} has ${heelee.hp} hp now!`
    }

    getStatus() {
        return this.participants.map(participant => `${participant.name} is involved, and has ${participant.hp} hit points left`).toString();
    }
}

class Participant {
    constructor(name) {
        this.name = name
        this.hp = 100
    }
}

module.exports.fight = Fight