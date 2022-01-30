import { messages } from "./game.js";

class Character {
  constructor(name, charObj) {
    self = this; /* For referencing later */
    this.name = name;
    this.race = charObj.race;
    this.init = function () {
      this.will = charObj.will;
      this.pride = charObj.pride;
      this.abilities = charObj.abilities;
      this.stats.trans = charObj.transformations;
      this.stats.resolve = 70 - (this.will + this.pride) * 3;
    };
    this.getAttributes = function () {
      return charObj.attributes;
    };
    this.fortify = function () {
      this.stats.ki = 50 - this.charge * 2;
      const cAttr = this.getAttributes();
      const level = this.stats.level;
      this.attributes = {
        strength: this.initial.strength + cAttr[0][level],
        resilience: this.initial.resilience + cAttr[1][level],
        speed: this.initial.speed + cAttr[2][level],
        fightIQ: this.initial.intelligence + cAttr[3][level],
        stamina: this.initial.endurance + cAttr[4][level],
      };
    };
    this.enhance = function () {
      this.stats.ki = 50 - this.charge * 2;
      const cAttr = this.getAttributes();
      const level = this.stats.level;
      this.attributes.strength += cAttr[0][level] - cAttr[0][level - 1];
      this.attributes.resilience += cAttr[1][level] - cAttr[1][level - 1];
      this.attributes.speed += cAttr[2][level] - cAttr[2][level - 1];
      this.attributes.fightIQ += cAttr[3][level] - cAttr[3][level - 1];
      this.attributes.stamina += cAttr[4][level] - cAttr[4][level - 1];
    };
  }
  /* 3 meters & other current status*/
  stats = {
    health: 2000,
    resolve: 0,
    ki: 0,
    level: 0 /* Starting level */,
    trans: 0 /* Total levels */,
    dodge: 0,
    shield: 0,
    activated: 0,
  };

  injury = {
    upper: 0 /* Compromise Punch Attacks */,
    lower: 0 /* Compromise Kick Attacks */,
    internal: 0 /* Poison Effect */,
  };

  /* Base defense for shield deactivation */
  baseDef = 0;

  /* Init method can use variables of child class to calculate new variables by calling it from child class*/

  get power() {
    return this.attributes.strength + this.attributes.fightIQ;
  }

  get defense() {
    return this.attributes.resilience + this.attributes.fightIQ;
  }

  punch() {
    const healthDamage = this.power * (30 - this.injury.upper * 3);
    const luckDamage = Math.random() * (healthDamage / 1.2) - healthDamage / 2.4;
    console.log(healthDamage, luckDamage);
    return healthDamage + luckDamage;
  }

  kick() {
    const healthDamage = this.power * (30 - this.injury.lower * 10);
    const luckDamage = Math.random() * (healthDamage / 5) - healthDamage / 10;
    console.log(healthDamage, luckDamage);
    return healthDamage + luckDamage;
  }

  strike(moveNumber) {
    const damageCriteria = this.abilities[moveNumber].damage;
    const healthDamage = this.power * damageCriteria.health;
    const luckDamage = Math.random() * (healthDamage / 4) - healthDamage / 8;
    const totalDamage = healthDamage + luckDamage;
    console.log(healthDamage, luckDamage);
    let injury = [];
    injury[0] = Math.random() - damageCriteria.upper <= 0 ? 1 : 0;
    injury[1] = Math.random() - damageCriteria.lower <= 0 ? 1 : 0;
    injury[2] = Math.random() - damageCriteria.internal <= 0 ? 1 : 0;
    return { totalDamage, injury };
  }

  defend(damagePassed) {
    const damageRecieved = damagePassed / this.defense;
    this.stats.health -= damageRecieved;
    return damageRecieved;
  }
}

class Saiyan extends Character {
  constructor(name, charObj) {
    super(name, charObj);
    this.init();
    this.fortify();
  }
  /* Race Variables */
  initial = {
    strength: 15,
    resilience: 11,
    speed: 10,
    intelligence: 7,
    endurance: 13,
  };
  charge = 10; /* ki charge multiplier */
  ability = "Saiyan Rage Mode, starts landing double damage when health bar turns red.";
  baseStr = 0;

  activate() {
    const cAttr = this.getAttributes();
    const diff = cAttr[0][this.stats.level] - cAttr[0][0];
    let attr = this.attributes;
    if (this.stats.health < 300 && this.stats.activated === 0) {
      this.baseStr = attr.strength - diff;
      attr.strength = attr.strength < 50 ? attr.strength * 2 : 100;
      this.stats.activated = 1;
      messages.push("Saiyan Rage Mode");
      messages.push("Activated");
    } else if (this.stats.health > 300 && this.stats.activated === 1) {
      attr.strength = this.baseStr + diff;
      this.stats.activated = 0;
      messages.push("Saiyan Rage Mode");
      messages.push("Deactivated");
    }
  }
}

export { Character, Saiyan, messages };
