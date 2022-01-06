// import {state} from "./main.js";
class Character {
  constructor(name, charObj) {
    self = this; /* For referencing later */
    this.name = name;
    this.race = charObj.race;
    this.init = function () {
      this.attributes = {
        strength: this.initial.strength + charObj.attributes[0][this.stats.level],
        resilience: this.initial.resilience + charObj.attributes[1][this.stats.level],
        speed: this.initial.speed + charObj.attributes[2][this.stats.level],
        fightIQ: this.initial.intelligence + charObj.attributes[3][this.stats.level],
      };
      this.will = charObj.will;
      this.pride = charObj.pride;
      this.abilities = charObj.abilities;
      this.stats.ki = 50 - this.charge * 2;
      this.stats.resolve = 70 - (this.will + this.pride) * 3;
    };
  }
  /* 3 meters */
  stats = {
    health: 1000,
    resolve: 0,
    ki: 0,
    level: 0 /* Starting level */,
  };

  injury = {
    upper: 0 /* Compromise Punch Attacks */,
    lower: 0 /* Compromise Kick Attacks */,
    internal: 0 /* Poison Effect */,
  };

  /* Init method can use variables of child class to calculate new variables by calling it from child class*/

  get power() {
    return this.attributes.strength + this.attributes.fightIQ;
  }

  get defense() {
    return this.attributes.resilience + this.attributes.fightIQ;
  }

  punch() {
    return this.power * (20 - this.injury.upper * 3);
  }

  kick() {
    return this.power * (30 - this.injury.lower * 10);
  }

  strike(moveNumber) {
    const damageCriteria = this.abilities[moveNumber].damage;
    const healthDamage = this.power * damageCriteria.health + (Math.random() * 1000 - 500);
    let injury = [];
    injury[0] = 1 - Math.random() - damageCriteria.upper > 0 ? 0 : 1;
    injury[1] = 1 - Math.random() - damageCriteria.lower > 0 ? 0 : 1;
    injury[2] = 1 - Math.random() - damageCriteria.internal > 0 ? 0 : 1;
    return { healthDamage, injury };
  }

  defend(damagePassed) {
    const damageRecieved = damagePassed / this.defense;
    this.stats.health -= damageRecieved;
    console.log(damageRecieved);
    return damageRecieved;
  }
}

class Saiyan extends Character {
  /* Race Variables */
  initial = {
    strength: 5,
    resilience: 4,
    speed: 3,
    intelligence: 2,
  };
  charge = 10; /* ki charge multiplier */
  ability = "Saiyan Rage Mode, starts landing double damage when health bar turns red.";
  constructor(name, charObj) {
    super(name, charObj);
    this.init();
  }

  set damage(value) {
    this.stats.health -= value;
    /* Saiyan Race Ability = Damage doubles when health turns red */
    if (this.stats.health < 300) {
      this.attributes.strength *= 2;
      console.log("Saiyan Rage Mode Activated: Strength Doubled");
    }
  }
}

export { Character, Saiyan };
