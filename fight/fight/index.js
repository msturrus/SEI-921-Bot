export class Fight {
    constructor(participants, id) {
        this.id = id
        this.participants = participants;
    }

    addParticipant(participant) {
        return this.participants.push(participant);
    }

    attack(attacker, defender) {
        const defender = this.participants.find(participant => participant.name === defender)
        const damage = Math.floor(Math.random() * 10)
        defender.hp -= damage
        return `${attacker} attacks ${defender} for ${damage} damage!  ${defender} has ${defender.hp} hp left!`
    }

    heal(healer, heelee) {
        const heelee = this.participants.find(participant => participant.name === heelee)
        const damage = Math.floor(Math.random() * 5)
        defender.hp += damage
        return `${healer} heals ${heelee} for ${damage} damage!  ${heelee} has ${heelee.hp} hp now!`
    }

    getStatus() {
        return participants.map(participant => `${participant.name} is involved, and has ${participant.hp} hit points left`).toString();
    }
}

export class Participant {
    constructor(name) {
        this.name = name
        this.hp = 100
    }
}