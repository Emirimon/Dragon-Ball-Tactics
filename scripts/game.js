/* This File controls Gameplay */

import { dom } from "./main.js";
import { Saiyan } from "./race.js";
import { players } from "./character.js";
let races = { Saiyan };
/* Global Variables */
let player1 = new races.Saiyan("goku", players["goku"]);
let player2 = new races.Saiyan("vegeta", players["vegeta"]);
export let messages = [];

const game = {
  turn: 0,
  move: "",
  damage: 0,
  critDamage: 0,
  bonus: 0,

  /* This just returns a quick instance of characters for fetching all inside properties*/
  instance(name) {
    const race = players[name].race;
    const RaceClass = races[race];
    return new RaceClass(name, players[name]);
  },
  create(p1Name, p2Name) {
    /* Storing race class from string information of selected players */
    const race1 = players[p1Name].race;
    const RaceClass1 = races[race1];
    const race2 = players[p2Name].race;
    const RaceClass2 = races[race2];
    player1 = new RaceClass1(p1Name, players[p1Name]);
    player2 = new RaceClass2(p2Name, players[p2Name]);
    this.setKiFactor(player1);
    this.setKiFactor(player2);
    dom.updateStats(player1.stats, player2.stats);
    dom.updateRadar(player1.attributes, player2.attributes);
    dom.addSpecials(player1, player2);
    dom.addTransform(player1.name, player1.stats.trans, 1);
    dom.addTransform(player2.name, player2.stats.trans, 2);
    this.lockMoves(false, player1); /* round = false because we need to choose player-1 at first */
  },
  fetchInfo(name) {
    const charObj = players[name];
    const raceObj = races[charObj.race];
    return { charObj, raceObj };
  },
  turnExit(striker, defender) {
    const round = this.turn % 2 === 0;
    this.updateStats(striker, defender);
    this.statReset(striker);
    this.statReset(defender);
    dom.updateStats(player1.stats, player2.stats);
    dom.lockAction(striker, defender, this.bonus);
    /* Special Ability */
    defender.activate();
    striker.activate();
    if (!this.bonus) {
      this.lockMoves(round, defender);
      dom.showButtons(defender.stats);
      dom.turn();
      this.turn++;
    } else {
      dom.showButtons(striker.stats);
      this.lockMoves(!round, striker);
      messages.push("Speed Bonus");
      messages.push("Extra Turn!");
    }
    /* Show ability activated Indicator */
    dom.checkAbility(player1, player2);
    dom.updateRadar(player1.attributes, player2.attributes);
    /* If critical damage present, print critical, not normal damage */
    const damageMsg =
      !this.damage && !this.critDamage
        ? ""
        : this.damage && this.critDamage
        ? this.critDamage
        : this.damage;
    if (damageMsg) messages.push(`${Math.ceil(damageMsg)} Damage`);
    if (this.move === "trump") dom.chooseRank(this.damage);
    dom.log(messages);
    messages = [];
    this.damage = 0;
    this.critDamage = 0;
    console.log(striker, defender);
  },
  select(level, num) {
    const player = num === "1" ? player1 : player2;
    player.stats.level = +level; /* Converting to Number */
    player.fortify();
    dom.updateStats(player1.stats, player2.stats);
    dom.updateRadar(player1.attributes, player2.attributes);
  },
  normalize() {
    const p1 = player1.attributes;
    const p2 = player2.attributes;
    const base = p1.strength > p2.strength ? 1 : 2;
    const ratio = base === 1 ? p1.strength / p2.strength : p2.strength / p1.strength;
    const enhancedAttr = base === 1 ? p2 : p1;
    Object.keys(enhancedAttr).forEach((key) => {
      enhancedAttr[key] *= ratio;
    });
    dom.normalize(base, enhancedAttr);
  },
  /* Execution of turn */
  execute(task, param) {
    const round = this.turn % 2 === 0;
    const striker = round ? player1 : player2;
    const defender = round ? player2 : player1;
    this.move = task;
    const force = this[task](striker, param, defender);
    /* Bonus Turn */
    if (this.bonus) {
      this.bonus = 0; /* No multiple bonus */
    } else {
      this.bonus = this.bonusTurn(striker, defender);
    }
    /* Penalty if trump not used when opponent defending */
    if (
      (task === "action" || task === "boost") &&
      (defender.stats.shield || defender.stats.dodge)
    ) {
      striker.stats.ki -= striker.charge;
    }
    /* Reset to Default boosts if attacked or turn comes back */
    if (!this.bonus || (this.bonus && (task === "action" || task === "trump"))) {
      defender.stats.dodge = 0;
      if (defender.stats.shield) {
        defender.stats.shield = 0;
        const cAttr = defender.getAttributes();
        const diff = cAttr[1][defender.stats.level] - cAttr[1][0];
        defender.attributes.resilience = defender.baseDef + diff;
      }
    }
    /* Poison Effect */
    if (striker.injury.internal >= 3) {
      striker.defend(force / (striker.attributes.stamina / 5));
    }
    this.turnExit(striker, defender);
  },
  action(striker, name, defender) {
    this.move = "action";
    let force = 0;

    /* Calculate dodge probability */
    if (defender.stats.dodge === 1) {
      var dodge = this.calcDodge(striker, defender);
    }
    if (!dodge) {
      if (name === "punch") {
        dom.jerk(this.turn, "shake1");
        force = striker.punch();
        this.damage = defender.defend(force);
        striker.stats.ki += (striker.kiFactor * this.damage) / 1.5;
      } else if (name === "kick") {
        dom.jerk(this.turn, "shake2");
        force = striker.kick();
        this.damage = defender.defend(force);
        striker.stats.ki += (striker.kiFactor * this.damage) / 2;
      }
    }
    this.criticalHit(striker, defender, 5);
    return force;
  },
  boost(striker, name) {
    this.move = "boost";
    if (name === "charge") {
      striker.stats.ki += striker.charge;
      dom.jerk(this.turn + 1, "shake3");
      messages.push("Charging");
    } else if (name === "defend") {
      /* Base defense store */
      const cAttr = striker.getAttributes();
      const diff = cAttr[1][striker.stats.level] - cAttr[1][0];
      let attr = striker.attributes;
      striker.baseDef = attr.resilience - diff;
      striker.stats.shield = 1;
      attr.resilience *= attr.stamina / 10;
      if (attr.resilience > 100) attr.resilience = 100;
      striker.stats.ki -= striker.charge * 2;
      striker.stats.dodge = 0;
      messages.push("Defending");
    } else if (name === "dodge") {
      striker.stats.dodge = 1;
      striker.stats.shield = 0;
      striker.stats.ki -= striker.charge * 2;
      messages.push("Dodging");
    }
    dom.overlay(name);
    return 0; /* Force = 0 */
  },
  trump(striker, moveNumber, defender) {
    this.move = "trump";
    let force = 0;
    const ability = striker.abilities[moveNumber];
    striker.stats.ki -= (ability.limit * 20) / striker.attributes.stamina;
    /* Calculate dodge probability */
    if (defender.stats.dodge === 1) {
      var dodge = this.calcDodge(striker, defender);
    }
    if (dodge === 1) {
      messages.push("Dodged");
    } else if (ability.type === "offensive") {
      var damageInfo = striker.strike(moveNumber);
      force = damageInfo.totalDamage;
      this.damage = defender.defend(damageInfo.totalDamage);
      Object.keys(defender.injury).forEach((key, index) => {
        if (defender.injury[key] < 3)
          defender.injury[key] += damageInfo.injury[index] * this.deflect();
        /* Probability of Injury Deflection based on damage */
      });
      dom.jerk(this.turn, "shake2");
      dom.updateInjury(defender.injury, this.turn);
    }
    this.criticalHit(striker, defender, 2);
    return force;
  },
  transform(striker) {
    striker.stats.level += 1;
    striker.stats.resolve = 0;
    striker.enhance();
    dom.overlay("transform", striker.stats.level);
    messages.push("Transforming");
    messages.push("");
    messages.push("Transformation Complete");
  },
  restore(striker) {
    dom.resetHistory();
    Object.keys(striker.injury).forEach((key) => {
      striker.injury[key] = 0;
    });
    striker.stats.health += 350;
    striker.stats.ki = 0;
    striker.stats.resolve = 0;
    dom.overlay("restore");
    dom.jerk(this.turn + 1, "flicker");
    messages.push("Restoring");
    messages.push("");
    messages.push("Restoration Complete");
  },
  /* Miscellaneous */
  /* Criticality Factor based on fightIQ*/
  criticalHit(striker, defender, factor) {
    let ratio = striker.attributes.fightIQ / defender.attributes.fightIQ;
    if (ratio < 1) ratio = 1;
    else if (ratio > 3.5) ratio = 3.5;
    /* Probablity range 5% to 30% */
    let prob = 0.05 + (ratio - 1) * 0.1;
    if (this.runProb(prob)) {
      defender.stats.health -= this.damage * (factor - 1);
      this.critDamage = this.damage * factor;
      messages.push("Critical Hit!");
    }
  },
  /* Injury Deflection based on damage*/
  deflect() {
    let d = this.damage;
    let prob;
    switch (true) {
      case d < 100:
        prob = 0.2;
        break;
      case d >= 100 && d < 150:
        prob = 0.3;
        break;
      case d >= 150 && d < 200:
        prob = 0.6;
        break;
      case d >= 200 && d < 250:
        prob = 0.8;
        break;
      case d >= 250 && d < 300:
        prob = 0.9;
        break;
      default:
        prob = 1;
        break;
    }
    const deflect = this.runProb(prob);
    return deflect;
  },
  setKiFactor(player) {
    const x = (player.charge * 1.4 + player.will + player.pride * 0.5) / 43;
    player.kiFactor = 1.12 * Math.pow(x, 4.3);
  },
  resFactor(p1, p2) {
    const need =
      p1.attributes.strength -
      p2.attributes.strength +
      (p1.attributes.fightIQ - p2.attributes.fightIQ) * 1.5 +
      (p1.attributes.resilience - p2.attributes.resilience);
    const factor = p1.pride + p1.will * 0.5 - need * 0.5;
    return factor > 0 ? factor / 100 : 0;
  },
  updateStats(striker, defender) {
    /* Increase Rage/Ki */
    const kiMult = this.move === "action" ? 1 : 1.38;
    defender.stats.ki += (defender.kiFactor * this.damage) / kiMult;

    /* Increase Resolve */
    const resMult = this.move === "action" ? 3 : 1;
    defender.stats.resolve += this.resFactor(defender, striker) * this.damage * resMult;
    striker.stats.resolve += this.resFactor(striker, defender) * this.damage * resMult;
  },
  statReset(player) {
    Object.entries(player.stats).forEach(([key, val]) => {
      if (val < 0) {
        player.stats[key] = 0;
      } else if (val > 100 && key !== "health") {
        player.stats[key] = 100;
      } else if (val > 2000) {
        player.stats[key] = 2000;
      }
    });
  },
  bonusTurn(striker, defender) {
    let ratio = striker.attributes.speed / defender.attributes.speed;
    /* Probability range from 10% to 60% */
    if (ratio < 1) return 0;
    else if (ratio > 3) ratio = 3;
    const prob = 0.1 + (ratio - 1) * 0.25;
    const bonus = this.runProb(prob);
    return bonus;
  },
  calcDodge(striker, defender) {
    let prob, dodge;
    const ratio = defender.attributes.speed / striker.attributes.speed;
    if (ratio < 0.5) {
      prob = 0.05;
    } else if (ratio >= 0.5 && ratio <= 2) {
      prob = (ratio - 0.5) / 2;
    } else {
      prob = 0.9;
    }
    dodge = this.runProb(prob);
    if (dodge === 1) {
      messages.push("Dodged");
    } else {
      messages.push("Dodge Failed");
    }
    return dodge;
  },
  lockMoves(round, defender) {
    /* Lock Effect */
    defender.abilities.forEach((ability, index) => {
      /* Check Rage Threshold */
      if (defender.stats.ki >= ability.limit) {
        dom.unlockMove(round, index);
      } else {
        dom.lockMove(round, index);
      }
      /* Check Injury Rule */
      if (
        (ability.rule === "H" && defender.injury.upper >= 3) ||
        (ability.rule === "F" && defender.injury.lower >= 3) ||
        (ability.rule === "HoF" && (defender.injury.upper >= 3 || defender.injury.lower >= 3)) ||
        (ability.rule === "H&F" && defender.injury.upper >= 3 && defender.injury.lower >= 3)
      ) {
        dom.lockMove(round, index);
      }
    });
  },
  runProb(prob) {
    return Math.random() - prob <= 0 ? 1 : 0;
  },
};

export { game };
