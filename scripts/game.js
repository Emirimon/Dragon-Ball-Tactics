/* This File controls Gameplay */

import { dom } from "./main.js";
import { Saiyan } from "./race.js";
import { players } from "./character.js";
let races = { Saiyan };
/* Global Variables */
let player1 = new races.Saiyan("goku", players["goku"]);
let player2 = new races.Saiyan("vegeta", players["vegeta"]);

const game = {
  turn: 0,
  damage: 0,

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
    dom.updateStats(player1.stats, player2.stats);
    dom.addSpecials(player1, player2);
    this.lockMoves(false, player1); /* round = false because we need to choose player-1 at first */
  },
  fetchInfo(name) {
    const charObj = players[name];
    const raceObj = races[charObj.race];
    return { charObj, raceObj };
  },
  execute(param, task) {
    const round = this.turn % 2 === 0;
    const striker = round ? player1 : player2;
    const defender = round ? player2 : player1;
    if(task === "action"){
      var force = this.action(param,striker,defender);
    }
    else if(task === "trump"){
      console.log(task);
      var force = this.trump(param,striker,defender);
    }
    /* Poison Effect */
    if(striker.injury.internal >= 3) {
      striker.defend(force/3);
    };
    /* Increase Rage/Ki */
    defender.stats.ki += (this.damage)/5;
    defender.stats.resolve += (this.damage)/3;
    this.lockMoves(round, defender);
    dom.updateStats(player1.stats, player2.stats);
    dom.turn();
    this.turn++;
  },
  action(name,striker,defender) {
    if (name === "punch") {
      var force = striker.punch();
      this.damage = defender.defend(force);
      dom.jerk(this.turn, "punch");
    }
    if (name === "kick") {
      var force = striker.kick();
      this.damage = defender.defend(force);
      dom.jerk(this.turn, "kick");
    }
    return force;
  },
  trump(moveNumber,striker,defender) {
    const ability = striker.abilities[moveNumber];
    if (ability.type === "offensive") {
      var damageInfo = striker.strike(moveNumber);
      this.damage = defender.defend(damageInfo.healthDamage);
      Object.keys(defender.injury).forEach((key, index) => {
        if (damageInfo.injury[index] < 3) defender.injury[key] += damageInfo.injury[index];
      });
      console.log(defender.injury);
      dom.updateInjury(defender.injury, this.turn);
    }
    return damageInfo.healthDamage;
  },
  lockMoves(round, defender){
      /* Lock Effect */
    defender.abilities.forEach( (ability, index) => {
      if(defender.stats.ki > ability.limit){
        dom.unlock(round, index);
      }
      else{
        dom.lock(round, index);
      }
    });
  }
};

export { game };
