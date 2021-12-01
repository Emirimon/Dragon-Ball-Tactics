/* This File controls DOM */
import { game } from "./game.js";

/* Queries */
const arena = document.querySelector(".arena");
const characters = document.querySelector(".characters");
const playerInfo = document.querySelector(".player-info");
const player1 = document.querySelector(".player-1");
const player2 = document.querySelector(".player-2");
const battle = document.querySelector(".game-btn");

/* Global Functions */
let state = 1;

/* If element contains this classname, return true */
const contains = (element, classname) => element.classList.contains(classname);

/* Capitalize first letter */
const capFirst = (name) => name[0].toUpperCase() + name.slice(1);

/* Convert underscore names to title */

const convertName = (name) =>
  name.replace(/_/g, " ").replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());

/* Get & Set CSS Variables */
const getCssVar = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(`--${name}`);

const setCssVar = (name, value) => document.documentElement.style.setProperty(`--${name}`, value);

/* UI Functions */
const fetchPlayer = (playerName, state) => {
  const player = state === 1 ? player1 : player2;
  const figure = player.querySelector(".player-box img");
  const data = player.querySelector(".player-data");
  figure.src = `img/arena/${playerName}/Trans/level0.png`;
  data.firstElementChild.innerText = capFirst(playerName);
};

const shapeRadar = (character) => {
  const max = 25;
  const charge = character.charge;
  let radarPoints = [];
  radarPoints[0] = `50% ${50 - charge * 3}%`;
  const { strength, resilience, speed, fightIQ } = character.stats;
  const sp = (max - strength) * 1.5;
  const rp = (max - resilience) * 1.5;
  const fp = (max - fightIQ) * 0.96;
  const spp = (max - speed) * 0.96;
  radarPoints[1] = `${96.93 - sp}% ${38.2 + Math.tan(Math.PI / 10) * sp}%`;
  radarPoints[2] = `${79.7 - fp}% ${94.4 - Math.tan((3 * Math.PI) / 10) * fp}%`;
  radarPoints[3] = `${20.3 + spp}% ${94.4 - Math.tan((3 * Math.PI) / 10) * spp}%`;
  radarPoints[4] = `${2.67 + rp}% ${38.07 + Math.tan(Math.PI / 10) * rp}%`;
  return `polygon(${radarPoints.join(", ")})`;
};

const updateInfo = (name) => {
  const playerface = playerInfo.querySelector(".avatar img");
  const playerName = playerInfo.querySelector(".avatar-name");
  const race = playerInfo.querySelector(".avatar-race p");
  const ability = playerInfo.querySelector(".ability p");
  const radar = playerInfo.querySelector(".radar .radar-cookie");
  const skills = playerInfo.querySelector(".attribute .skills");
  skills.innerHTML = " <h4>Skills</h4>";

  // const {charObj, raceObj} = game.fetchInfo(name);
  const character = game.instance(name);
  console.log(character);
  playerface.src = `img/characters/${name}.jpg`;
  setCssVar("will", `${(character.will / 10) * 80}%`);
  setCssVar("pride", `${(character.pride / 10) * 80}%`);
  playerName.innerHTML = capFirst(name);
  race.innerHTML = character.constructor.name;
  ability.innerHTML = character.ability;
  radar.style["clip-path"] = shapeRadar(character);
  character.abilities.forEach((move) => {
    const skill = document.createElement("div");
    skill.classList.add("tooltipElement");
    skill.innerHTML = `
        <img src="img/arena/${name}/Moves/${move.name}.jpg" alt="${move.name}">
        <span class="tooltipText">${convertName(move.name)}</span>
        `;
    skills.appendChild(skill);
  });
};

const battleStart = () => {
  characters.style.display = "none";
  playerInfo.style.display = "none";
  // battle.style.display = "none";
  arena.classList.toggle("battle");
}

/* Event Listeners */

characters.addEventListener("mouseover", (e) => {
  if (contains(e.target, "character")) {
    const name = e.target.children[0].alt.split("-")[0];
    fetchPlayer(name, state);
    updateInfo(name);
  }
});

characters.addEventListener("click", (e) => {
  if (contains(e.target, "character")) {
    const name = e.target.children[0].alt.split("-")[0];
    game.create(state, name);
    state = state === 1 ? 2 : 1;
  }
});

battle.addEventListener("click", (e) => {
  battleStart();
});
