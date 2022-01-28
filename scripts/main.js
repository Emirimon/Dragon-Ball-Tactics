/* This File controls DOM */
import { game } from "./game.js";

/* Queries */
const arena = document.querySelector(".arena");
const backdrop = document.querySelector(".backdrop");
const characters = document.querySelector(".characters");
const buttons = document.querySelector(".buttons");
const specials = document.querySelector(".specials");
const selectWindow = document.querySelector(".selection");
const playerInfo = document.querySelector(".player-info");
const player1 = document.querySelector(".player-1");
const player2 = document.querySelector(".player-2");
const battle = document.querySelector(".game-btn");
const battleControl = document.querySelector(".battle-control");
const message = document.getElementById("message");
const define = document.getElementById("define");
const bgmusic = document.querySelector(".bgmusic");
bgmusic.volume = 0.5;
const test = document.querySelector(".test-btn");

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

/* Random number between range */
const getRand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/* Get & Set CSS Variables */
const getCssVar = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(`--${name}`);

const setCssVar = (name, value) => document.documentElement.style.setProperty(`--${name}`, value);

/* UI Functions */
const dom = {
  /* Action limit */
  p1History: Array(5).fill(0),
  p2History: Array(5).fill(0),
  turn() {
    specials.classList.toggle("slide");
  },
  log(messages) {
    console.log(messages);
    const count = messages.length;
    const count1 = count % 2 === 0 ? count / 2 : (count + 1) / 2;
    const count2 = count - count1;
    const msg1 = message.querySelector(".message1");
    const msg2 = message.querySelector(".message2");
    msg1.style.animationIterationCount = count1;
    msg2.style.animationIterationCount = count2;
    message.classList.add("show");
    messages.forEach((msg, index) => {
      if (index < 2) {
        (index === 0 ? msg1 : msg2).innerHTML = msg;
      } else {
        setTimeout(() => {
          (index % 2 === 0 ? msg1 : msg2).innerHTML = msg;
        }, (index - 1) * 1500);
      }
    });
    /* (count % 2 === 0 ? msg2 : msg1).addEventListener("animationend", () => {
      message.classList.remove("show");
    }); */
    setTimeout(() => {
      message.classList.remove("show");
    }, count * 1200 + 100);
  },
  play(name, val = 1) {
    const audio = new Audio(`/Audio/${name}`);
    audio.volume = val;
    audio.play();
  },
  playbg() {
    const curr = bgmusic.src.slice(-5)[0];
    let num = getRand(1, 17);
    while (num === curr) num = getRand(1, 5);
    bgmusic.src = `/Audio/background/bgmusic${num}.mp3`;
    bgmusic.volume = 0.35;
    bgmusic.play();
  },
  jerk(turn, anim) {
    const round = turn % 2 === 0;
    const player = !round ? player1 : player2;
    let time;
    if (anim === "shake3") {
      time = "1.4s";
    } else if (anim === "flicker") {
      time = "1s";
    } else {
      time = "0.7s";
    }
    let animation = `${anim} ${time} cubic-bezier(.36,.07,.19,.97) both`;
    player.querySelector(".player-box .body").style.animation = animation;
    setTimeout(() => {
      player.querySelector(".player-box .body").style.animation = "";
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
  showButtons(stats) {
    const transform = buttons.querySelector(".transform");
    const restore = buttons.querySelector(".restore");
    if (stats.resolve === 100 && stats.level < stats.trans.length - 1) {
      transform.classList.add("show");
    } else {
      transform.classList.remove("show");
    }
    if (stats.resolve === 100 && stats.ki === 100) {
      restore.classList.add("show");
    } else {
      restore.classList.remove("show");
    }
  },
  normalize(base, character) {
    const radar = selectWindow.querySelector(`${base === 1 ? ".radar2" : ".radar1"} .radar-cookie`);
    radar.style["clip-path"] = shapeRadar(character);
  },
  removeEffect(overlay) {
    overlay.classList.remove("show");
  },
  addEffect(overlay, source) {
    this.removeEffect(overlay);
    /* Without the timeout the add is happening before the source is changing */
    setTimeout(() => {
      overlay.src = source;
    }, 300);
    setTimeout(() => {
      overlay.classList.add("show");
    }, 500);
  },
  flickerEffect(overlay, source, time) {
    this.removeEffect(overlay);
    setTimeout(() => {
      overlay.src = source;
    }, 300);
    setTimeout(() => {
      overlay.classList.add("show");
    }, 500);
    setTimeout(() => {
      this.removeEffect(overlay);
    }, 500 + time);
  },
  checkBoost(stats) {
    const defender = game.turn % 2 === 0 ? player2 : player1;
    const pOverlay = defender.querySelector(".player-box .overlay");
    if (!stats.dodge && !stats.shield) pOverlay.className = "overlay";
  },
  checkHistory() {
    const history = this.turn % 2 === 0 ? this.p1History : this.p2History;
    Array.from(battleControl.children).forEach((element, index) => {
      if (history[index] === 0 && element.dataset.lockFor !== 0) {
        this.lock(element);
        element.dataset.lockFor -= 1;
      }
      if (history[index] < 3) {
        this.unlock(element);
      } else {
        element.dataset.lockFor = 3;
        history[index] = 0;
      }
    });
  },
  overlay(task, param) {
    const player = game.turn % 2 === 0 ? player1 : player2;
    const pOverlay = player.querySelector(".player-box .overlay");
    pOverlay.className = `overlay ${task}`;
    this[task](pOverlay, param);
  },
  defend(pOverlay) {
    const source = "/img/UI/shield.png";
    this.addEffect(pOverlay, source);
  },
  dodge(pOverlay) {
    const source = "/img/UI/dash.png";
    this.addEffect(pOverlay, source);
  },
  charge(pOverlay) {
    const num = getRand(1, 5);
    const source = `/img/UI/powerup${num}.png`;
    this.flickerEffect(pOverlay, source, 1000);
  },
  transform(pOverlay, level) {
    const num = getRand(1, 7);
    const player = game.turn % 2 === 0 ? player1 : player2;
    const body = player.querySelector(".player-box .body");
    const source = `/img/UI/transform${num}.png`;
    body.classList.add("hide");
    setTimeout(() => {
      this.flickerEffect(pOverlay, source, 1000);
    }, 1600);
    setTimeout(() => {
      body.src = body.src.slice(0, -5) + `${level}.png`;
    }, 1700);
    setTimeout(() => {
      body.classList.remove("hide");
    }, 2150);
  },
  restore(pOverlay) {
    const num = getRand(1, 3);
    const player = game.turn % 2 === 0 ? player1 : player2;
    const injuryBar = player.querySelector(".player-bars .injury-bar");
    const playerInjury = player.querySelector(".player-box .player-injury");
    injuryBar.innerHTML = playerInjury.innerHTML = "";
    const source = `/img/UI/recover${num}.png`;
    this.flickerEffect(pOverlay, source, 1000);
  },
  updateDefine(player, move) {
    define.style.display = "block";
    define.querySelector(".avatar h1").innerHTML = convertName(move.name);
    define.querySelector(".avatar img").src = `/img/arena/${player.name}/Moves/${move.name}.jpg`;
    define.querySelector(".avatar img").alt = move.name;
    define.querySelector(".detail").innerHTML = move.define;
    define.querySelector(".trait .value").innerHTML = move.trait;
    define.querySelector(".attributes .value").innerHTML = +move.damage.health;
  },
  addSpecials(p1, p2) {
    const movesTemplate = (player, template) => {
      player.abilities.forEach((move, index) => {
        const skill = document.createElement("div");
        skill.classList.add("move-box");
        skill.setAttribute("data-movenumber", index);
        skill.innerHTML = `
            <img src="img/arena/${player.name}/Moves/${move.name}.jpg" alt="${move.name}">
            `;
        template.appendChild(skill);
        skill.addEventListener("click", (e) => {
          const battleMove = arena.querySelector(".battle-move");
          battleMove.querySelector("img").src = `/img/arena/${player.name}/Moves/${move.name}.jpg`;
          classToggle("show", battleMove);
          setTimeout(() => {
            classToggle("show", battleMove);
          }, 1500);
          dom.play("click1.mp3");
          dom.play("boom.mp3");
          const button = e.target.closest("div");
          game.execute("trump", button.dataset.movenumber);
          define.style.display = "none";
        });
        skill.addEventListener("mouseenter", (e) => {
          dom.play("short2.mp3", 0.3);
          this.updateDefine(player, move);
        });
        skill.addEventListener("mouseout", (e) => {
          define.style.display = "none";
        });
      });
      return template;
    };
    const p1Specials = specials.querySelector(".player-1");
    const p2Specials = specials.querySelector(".player-2");
    movesTemplate(p1, p1Specials);
    movesTemplate(p2, p2Specials);
  },
  addTransform(name, trans, num) {
    const levels = selectWindow.querySelector(`.player-${num} .levels`);
    const level = trans.length - 1;
    for (let i = 0; i <= level; i++) {
      const transform = document.createElement("img");
      transform.src = `/img/arena/${name}/Trans/level${i}.png`;
      transform.alt = `${name}_level${i}`;
      transform.classList.add("level");
      levels.appendChild(transform);
    }
  },
  updateStats(p1Stats, p2Stats) {
    const hp = 2000;
    const hp1 = p1Stats.health <= hp / 2 ? 0 : (p1Stats.health - hp / 2) / (hp / 200);
    const hp2 = p1Stats.health > hp / 2 ? 100 : p1Stats.health / (hp / 200);
    const hp3 = p2Stats.health <= hp / 2 ? 0 : (p2Stats.health - hp / 2) / (hp / 200);
    const hp4 = p2Stats.health > hp / 2 ? 100 : p2Stats.health / (hp / 200);
    setCssVar("hp1", `${hp1}%`);
    setCssVar("hp2", `${hp2}%`);
    setCssVar("hp3", `${hp3}%`);
    setCssVar("hp4", `${hp4}%`);
    player1.querySelector(".rage .barfill").style.width = `${p1Stats.ki}%`;
    player2.querySelector(".rage .barfill").style.width = `${p2Stats.ki}%`;
    player1.querySelector(".potential .barfill").style.width = `${
      ((p1Stats.level + 1) / p1Stats.trans.length) * 100
    }%`;
    player2.querySelector(".potential .barfill").style.width = `${
      ((p2Stats.level + 1) / p2Stats.trans.length) * 100
    }%`;
    player1.querySelector(".avatar-name").innerHTML = p1Stats.trans[p1Stats.level];
    player2.querySelector(".avatar-name").innerHTML = p2Stats.trans[p2Stats.level];
    player1.querySelector(".transform-fill").style.height = `${p1Stats.resolve}%`;
    player2.querySelector(".transform-fill").style.height = `${p2Stats.resolve}%`;
    this.checkBoost(game.turn % 2 === 0 ? p2Stats : p1Stats);
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
          dom.play("short2.mp3", 0.5);
          injuryBar.querySelector(`.${key}`).remove();
          playerInjury.insertAdjacentHTML("beforeend", elements[index]);
        }
      } else if (injury[key] > 0) {
        if (!injuryBar.querySelector(`.${key}`)) {
          dom.play("pop.flac", 0.5);
          injuryBar.insertAdjacentHTML("beforeend", elements[index]);
        }
        injuryBar.querySelector(`.${key} span`).innerText = injury[key];
      }
    });
  },
};

const fetchPlayer = (playerName, state) => {
  const player = state === 1 ? player1 : player2;
  const figure = player.querySelector(".player-box .body");
  const data = player.querySelector(".player-data");
  const avatar = player.querySelector(".player-stats .avatar");
  const bars = player.querySelector(".player-stats .player-bars");
  figure.src = `img/arena/${playerName}/Trans/level0.png`;
  data.firstElementChild.innerText = capFirst(playerName);
  avatar.children[0].src = `img/characters/${playerName}.jpg`;
  bars.children[0].innerText = capFirst(playerName);
};

const shapeRadar = (character) => {
  const max = 25;
  let radarPoints = [];
  const { strength, resilience, speed, fightIQ, stamina } = character.attributes;
  const fp = (max - fightIQ / 4) * 1.6;
  const sp = (max - strength / 4) * 1.6;
  const rp = (max - resilience / 4) * 1.6;
  const spp = (max - speed / 4) * 1.02;
  const ep = (max - stamina / 4) * 1.02;
  radarPoints[0] = `50% ${5 + fp}%`;
  radarPoints[1] = `${96.93 - sp}% ${38.2 + Math.tan(Math.PI / 10) * sp}%`;
  radarPoints[2] = `${79.7 - spp}% ${94.4 - Math.tan((3 * Math.PI) / 10) * spp}%`;
  radarPoints[3] = `${20.3 + ep}% ${94.4 - Math.tan((3 * Math.PI) / 10) * ep}%`;
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
  classAdd("battleState", arena, playerInfo);
  classAdd("fade-out", characters, battle);
  setTimeout(() => {
    classAdd("d-none", characters, battle);
    classAdd("show", selectWindow);
  }, 1500);
};

const levelSelect = (e) => {
  const name = e.target.alt.split("_")[0];
  const level = e.target.alt.slice(-1);
  const playerNum = e.target.closest(".players").classList[1];
  const player = playerNum === "player-1" ? player1 : player2;
  const radar = selectWindow.querySelector(
    `${playerNum === "player-1" ? ".radar1" : ".radar2"} .radar-cookie`
  );
  return { name, level, player, radar };
};

const levelClick = (e) => {
  if (e.target.classList.contains("level")) {
    dom.play("screentap.mp3");
    const { name, level, player } = levelSelect(e);
    player.querySelector(".body").src = `img/arena/${name}/Trans/level${level}.png`;
    game.select(level, player.classList[1].slice(-1));
    Array.from(e.target.parentElement.children).forEach((level) => {
      level.classList.remove("active");
    });
    e.target.classList.add("active");
  }
};

const levelHover = (e) => {
  if (e.target.classList.contains("level")) {
    dom.play("short2.mp3", 0.4);
    const { name, level, player, radar } = levelSelect(e);
    const character = game.instance(name);
    character.stats.level = level;
    character.fortify();
    radar.style["clip-path"] = shapeRadar(character);
  }
};

/* Event Listeners */

characters.addEventListener("mouseover", (e) => {
  if (contains(e.target, "character")) {
    const name = e.target.children[0].alt.split("-")[0];
    fetchPlayer(name, state);
    updateInfo(name);
    dom.play("short2.mp3", 0.1);
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
    dom.play("click1.mp3");
  }
});

buttons.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const name = e.target.classList[0];
    if (name === "transform") {
      dom.play("transform.wav", 0.3);
    } else if (name === "restore") {
      dom.play("senzu.wav", 0.8);
    }
    const task = e.target.classList[0];
    game.execute(task);
  }
});

battle.addEventListener("click", (e) => {
  dom.play("tone.wav", 0.4);
  // dom.playbg();
  bgmusic.play();
  battleStart();
  game.create(p1Name, p2Name);
  setTimeout(() => {
    dom.play("pop.flac", 0.5);
  }, 3100);
  setTimeout(() => {
    dom.play("pop.flac", 0.5);
  }, 3400);
});

selectWindow.querySelector(".choose").addEventListener("click", (e) => {
  if (e.target.classList.contains("start")) {
    dom.play("turung.mp3");
    selectWindow.classList.remove("show");
    classAdd(
      "battleState",
      arena.querySelector(".battle-bell"),
      backdrop,
      player1,
      player2,
      battleControl,
      buttons,
      specials
    );
    classAdd("move", arena);
    dom.play("boom.mp3");
    setTimeout(() => {
      dom.play("swoosh1.mp3", 0.6);
    }, 2200);
    setTimeout(() => {
      dom.play("fight.mp3");
    }, 3500);
  }
  if (e.target.classList.contains("normal")) {
    dom.play("turung.mp3");
    game.normalize();
  }
});

selectWindow.addEventListener("click", levelClick);

selectWindow.addEventListener("mouseover", levelHover);

battleControl.querySelectorAll("button").forEach((battleBtn) => {
  battleBtn.addEventListener("click", (e) => {
    const id = battleBtn.id.split("_")[0];
    switch (id) {
      case "punch":
      case "kick":
        dom.play("impact.wav", 0.6);
        break;
      case "charge":
        dom.play("charge.mp3", 0.2);
        break;
      case "defend":
        dom.play("defend.mp3", 0.5);
        break;
      case "dodge":
        dom.play("dodge.mp3", 0.5);
        break;
      default:
        break;
    }
    const button = e.target.closest("button");
    const action = button.id.split("_")[0];
    const task = button.dataset.type;
    game.execute(task, action);
  });
});

bgmusic.addEventListener("ended", (e) => {
  dom.playbg();
});

test.addEventListener("click", (e) => {
  // dom.log(["Saiyan Rage Mode", "Activated", "Super Duper", "This is Anarchy!", "AAArrrghhh"]);

  dom.play("impact.wav");
});

export { dom };
