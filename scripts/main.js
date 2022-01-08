/* This File controls DOM */
import { game } from "./game.js";

/* Queries */
const arena = document.querySelector(".arena");
const characters = document.querySelector(".characters");
const specials = document.querySelector(".specials");
const playerInfo = document.querySelector(".player-info");
const player1 = document.querySelector(".player-1");
const player2 = document.querySelector(".player-2");
const battle = document.querySelector(".game-btn");
const battleControl = document.querySelector(".battle-control");

/* Global Functions */
let state = 1;
let p1Name = "goku";
let p2Name = "vegeta";

/* If element contains this classname, return true */
const contains = (element, classname) => element.classList.contains(classname);

/* Capitalize first letter */
const capFirst = (name) => name[0].toUpperCase() + name.slice(1);

/* Convert underscore names to title */
const convertName = (name) =>
  name.replace(/_/g, " ").replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());

/* Add one class to multiple elements */
const classAdd = (className, ...elementArray) => {
  elementArray.forEach((element) => element.classList.add(className));
};
/* Remove one class to multiple elements */
const classRemove = (className, ...elementArray) => {
  elementArray.forEach((element) => element.classList.remove(className));
};
/* Toggle one class to multiple elements */
const classToggle = (className, ...elementArray) => {
  elementArray.forEach((element) => element.classList.toggle(className));
};

/* Get & Set CSS Variables */
const getCssVar = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(`--${name}`);

const setCssVar = (name, value) => document.documentElement.style.setProperty(`--${name}`, value);

/* UI Functions */
const dom = {
  turn() {
    specials.classList.toggle("slide");
  },
  jerk(turn, damage) {
    const round = turn % 2 === 0;
    const player = !round ? player1 : player2;
    const anim = damage === "punch" ? "shake1" : "shake2";
    player.querySelector(
      ".player-box"
    ).style.animation = `${anim} 0.7s cubic-bezier(.36,.07,.19,.97) both`;
    setTimeout(() => {
      player.querySelector(".player-box").style.animation = "none";
    }, 1000);
  },
  lock(element) {
    classAdd("lock", element);
  },
  unlock(element) {
    classRemove("lock", element);
  },
  lockMove(round, index) {
    const player = round ? "player-2" : "player-1";
    const element = specials.querySelector(`.${player} div[data-movenumber="${index}"]`);
    this.lock(element);
  },
  unlockMove(round, index) {
    const player = round ? "player-2" : "player-1";
    const element = specials.querySelector(`.${player} div[data-movenumber="${index}"]`);
    this.unlock(element);
  },
  addSpecials(p1, p2) {
    const movesTemplate = (player, template) => {
      player.abilities.forEach((move, index) => {
        const skill = document.createElement("div");
        skill.classList.add("tooltipElement");
        skill.setAttribute("data-movenumber", index);
        skill.innerHTML = `
            <img src="img/arena/${player.name}/Moves/${move.name}.jpg" alt="${move.name}">
            <span class="tooltipText">${move.define}</span>
            `;
        template.appendChild(skill);
        skill.addEventListener("click", (e) => {
          const button = e.target.closest("div");
          game.execute(button.dataset.movenumber, "trump");
        });
      });
      return template;
    };
    const p1Specials = specials.querySelector(".player-1");
    const p2Specials = specials.querySelector(".player-2");
    movesTemplate(p1, p1Specials);
    movesTemplate(p2, p2Specials);
  },
  updateStats(p1Stats, p2Stats) {
    setCssVar("hp1", `${p1Stats.health / 10}%`);
    setCssVar("hp2", `${p2Stats.health / 10}%`);
    player1.querySelector(".rage .barfill").style.width = `${p1Stats.ki}%`;
    player2.querySelector(".rage .barfill").style.width = `${p2Stats.ki}%`;
    player1.querySelector(".transform-fill").style.height = `${p1Stats.resolve}%`;
    player2.querySelector(".transform-fill").style.height = `${p2Stats.resolve}%`;
  },
  updateInjury(injury, turn) {
    const elements = [
      `<div class="injury-icon upper">
    <img src="/img/UI/upper.png" alt="hand-injury" /><span></span></div>`,
      `<div class="injury-icon lower">
    <img src="/img/UI/leg2.png" alt="leg-injury" /><span></span></div>`,
      `<div class="injury-icon internal">
    <img src="/img/UI/internal3.png" alt="internal-injury" /><span></span></div>`,
    ];
    const player = turn % 2 === 0 ? player2 : player1;
    const injuryBar = player.querySelector(".player-bars .injury-bar");
    const playerInjury = player.querySelector(".player-box .player-injury");
    Object.keys(injury).forEach((key, index) => {
      if (injury[key] >= 3) {
        if (!playerInjury.querySelector(`.${key}`)) {
          injuryBar.querySelector(`.${key}`).remove();
          playerInjury.insertAdjacentHTML("beforeend", elements[index]);
        }
      } else if (injury[key] > 0) {
        if (!injuryBar.querySelector(`.${key}`)) {
          injuryBar.insertAdjacentHTML("beforeend", elements[index]);
        }
        injuryBar.querySelector(`.${key} span`).innerText = injury[key];
      }
    });
  },
};

const fetchPlayer = (playerName, state) => {
  const player = state === 1 ? player1 : player2;
  const figure = player.querySelector(".player-box img");
  const data = player.querySelector(".player-data");
  const avatar = player.querySelector(".player-stats .avatar");
  figure.src = `img/arena/${playerName}/Trans/level0.png`;
  data.firstElementChild.innerText = capFirst(playerName);
  avatar.children[0].src = `img/characters/${playerName}.jpg`;
  avatar.children[1].innerText = capFirst(playerName);
};

const shapeRadar = (character) => {
  const max = 25;
  const charge = character.charge;
  let radarPoints = [];
  radarPoints[0] = `50% ${50 - charge * 3}%`;
  const { strength, resilience, speed, fightIQ } = character.attributes;
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
  character.abilities.forEach((move, index) => {
    if (index < 5) {
      const skill = document.createElement("div");
      skill.classList.add("tooltipElement");
      skill.innerHTML = `
        <img src="img/arena/${name}/Moves/${move.name}.jpg" alt="${move.name}">
        <span class="tooltipText">${convertName(move.name)}</span>
        `;
      skills.appendChild(skill);
    }
  });
};

const battleStart = () => {
  classToggle("battleState", arena, playerInfo, specials);
  classAdd("fade-out", characters, battle);
};

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
    if (state === 1) {
      p1Name = name;
    } else if (state === 2) {
      p2Name = name;
    }
    state = state === 1 ? 2 : 1;
  }
});

battle.addEventListener("click", (e) => {
  battleStart();
  game.create(p1Name, p2Name);
});

battleControl.querySelectorAll("button").forEach((battleBtn) => {
  battleBtn.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    const action = button.id.split("_")[0];
    game.execute(action, "action");
  });
});

export { dom };
