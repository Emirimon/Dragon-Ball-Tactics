/* This File controls Gameplay */

import { Saiyan } from "./race.js";
import { players } from "./character.js";
let races = { Saiyan };
/* Global Variables */
let player1 = new races.Saiyan("goku", players["goku"]);
let player2 = new races.Saiyan("vegeta", players["vegeta"]);

const game = {
  /* This just returns a quick instance of characters for fetching all inside properties*/
  instance(name) {
    const race = players[name].race;
    const RaceClass = races[race];
    return new RaceClass(name, players[name]);
  },
  create(state, name) {
    /* Storing race class from string information of selected players */
    const race = players[name].race;
    const RaceClass = races[race];
    if (state === 1) {
      player1 = new RaceClass(name, players[name]);
    } else if (state === 2) {
      player2 = new RaceClass(name, players[name]);
    }
  },
  fetchInfo(name) {
    const charObj = players[name];
    const raceObj = races[charObj.race];
    return { charObj, raceObj };
  },
  battleStart() {},
};

export { game };
