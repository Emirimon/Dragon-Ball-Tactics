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
  },
  fetchInfo(name) {
    const charObj = players[name];
    const raceObj = races[charObj.race];
    return { charObj, raceObj };
  },
  execute(action) {
    const round = this.turn % 2 === 0;
    const striker = round ? player1 : player2;
    const defender = round ? player2 : player1;
    if (action === "punch") {
      this.damage = defender.defend(striker.punch());
      dom.jerk(round, "punch");
    }
    if (action === "kick") {
      this.damage = defender.defend(striker.kick());
      dom.jerk(round, "kick");
    }
    dom.updateStats(player1.stats, player2.stats);
    dom.turn();
    this.turn++;
  },
  trump(moveNumber) {
    const round = this.turn % 2 === 0;
    const striker = round ? player1 : player2;
    const defender = round ? player2 : player1;
    const ability = striker.abilities[moveNumber];
    if (ability.type === "offensive") {
      const damageInfo = striker.strike(moveNumber);
      this.damage = defender.defend(damageInfo.healthDamage);
      Object.keys(defender.injury).forEach((key, index) => {
        if (damageInfo.injury[index] < 3) defender.injury[key] += damageInfo.injury[index];
      });
      console.log(defender.injury);
      dom.updateInjury(defender.injury, this.turn);
    }
    dom.updateStats(player1.stats, player2.stats);
    dom.turn();
    this.turn++;
  },
};

export { game };
