/* Stats & Special Moves of each individual character
   Stats = Strength, Resilience, Speed, Battle Intelligence for each Transformations
   Abilities = Object of methods 
*/
const players = {
  goku: {
    race: "Saiyan",
    attributes: [
      [10, 20, 25, 40, 50, 60, 75],
      [12, 22, 26, 42, 54, 70, 79],
      [18, 30, 32, 45, 55, 75, 80],
      [18, 25, 30, 42, 58, 76, 83],
      [15, 25, 32, 45, 55, 55, 77],
    ],
    transformations: [
      "Goku",
      "Goku(SSJ)",
      "Goku(SSJ2)",
      "Goku(Super Saiyan God)",
      "Goku(Super Saiyan Blue)",
      "Ultra Instinct Goku",
      "Mastered Ultra Instinct Goku",
    ],
    will: 10,
    pride: 8,
    abilities: [
      {
        name: "kamehameha",
        type: "offensive",
        define:
          "Goku's signature move since obtaining it. It unleashes a powerful and long-stretching blue energy blast from his hands while yelling the famous words KA-ME-HA-ME-HA.",
        trait: "Shallow probability of injuring torso & legs.",
        limit: 20,
        rule: "H",
        damage: {
          health: 100 /* Opponent Health damage */,
          upper: 0.1 /* Injure Hand Probability- Locks Punch */,
          lower: 0.1 /* Injure Leg Probability- Locks Kick */,
          internal: 0.05 /*Injure internals Prob- Poison Effect*/,
        },
      },
      {
        name: "instant_kamehameha",
        type: "offensive",
        define:
          "It is a combination of the Instant Transmission and Super Kamehameha. Goku keeps charging for Kamehameha while at the last moment, instantly teleports infront of the opponent and fires at point blank range inflicting an enormous amount of damage.",
        trait: "Small probability of back injury.",
        limit: 35,
        rule: "F",
        damage: {
          health: 150,
          upper: 0.2,
          lower: 0.1,
          internal: 0.05,
        },
      },
      {
        name: "spirit_bomb",
        type: "offensive",
        define:
          "Goku's one of the most powerful techniques. It allows him to gather huge amounts of energy from all chosen surrounding life forms and inanimate objects to conduct that energy into a massive sphere of astounding destructive power.",
        trait: "Decent probability of hurting upper body.",
        limit: 55,
        rule: "H&F",
        damage: {
          health: 250,
          upper: 0.4,
          lower: 0.15,
          internal: 0.2,
        },
      },
      {
        name: "super_dragon_fist",
        type: "offensive",
        define:
          "A combination of Dragon Fist and Spirit Bomb. Goku begins to gather a massive amount of energy from Spirit Bomb and absorbs it into his body. Then proceeds to throw a punch in the form of a Giant Golden Dragon, which devours his opponent and inflicts a massive amount of damage.",
        trait: "High probability of injuring ribs & internals",
        limit: 75,
        rule: "HoF",
        damage: {
          health: 300,
          upper: 0.3,
          lower: 0.1,
          internal: 0.6,
        },
      },
      {
        name: "supreme_kamehameha",
        type: "offensive",
        define:
          "It is the most powerful version of Goku's signature move, even stronger than Divine Kamehameha. While being in his strongest and ultimate form, Mastered Ultra Instinct, Goku fires with far more force and intensity, incapacitating even the strongest of opponents.",
        trait: "Huge probability of destroying legs & torso.",
        limit: 100,
        rule: "H&F",
        damage: {
          health: 400,
          upper: 0.5,
          lower: 0.8,
          internal: 0.4,
        },
      },
    ],
  },
  vegeta: {
    race: "Saiyan",
    attributes: [
      [12, 23, 28, 43, 53, 63, 78],
      [11, 20, 24, 40, 52, 66, 75],
      [15, 27, 31, 40, 51, 68, 74],
      [17, 24, 28, 40, 55, 72, 78],
      [15, 25, 32, 45, 55, 65, 80],
    ],
    transformations: [
      "Vegeta",
      "Vegeta(SSJ)",
      "Vegeta(SSJ2)",
      "Vegeta(Super Saiyan God)",
      "Vegeta(Super Saiyan Blue)",
      "Vegeta SSB Evolution",
      "Ultra Ego Vegeta",
    ],
    will: 8,
    pride: 10,
    abilities: [
      {
        name: "lucora_gun",
        type: "offensive",
        define:
          "Vegeta's signature technique. Vegeta curls his fingers and places both his hands together at chest level facing the same direction",
        trait: "Small probability of leg injury.",
        limit: 15,
        rule: "HoF",
        damage: {
          health: 100 /* Opponent Health damage */,
          upper: 0.1 /* Injure Hand Probability- Locks Punch */,
          lower: 0.2 /* Injure Leg Probability- Locks Kick */,
          internal: 0.05 /*Injure internals Prob- Poison Effect*/,
        },
      },
      {
        name: "god_heat_flash",
        type: "offensive",
        define:
          "It is a stronger variation of Big Bang Attack used by Vegeta in Super Saiyan God Form. He extends his arm, opens his hand, and charges massive amount ki in the palm of his hand, like the Big Bang Attack. But instead of firing in the form of a sphere, he fires a beam of fire.",
        trait: "Small probability of injuring chest.",
        limit: 35,
        rule: "H",
        damage: {
          health: 150,
          upper: 0.2,
          lower: 0.1,
          internal: 0.05,
        },
      },
      {
        name: "galick_gun",
        type: "offensive",
        define:
          "An Energy Wave that is one of Vegeta's main signature attacks, similar to the Kamehameha of Kakarot. Vegeta curls his fingers and places both his hands together at chest level facing the same direction. Gathering enough ki, he thrusts both hands forward to fire a powerful blast of energy. The result is a powerful, huge, fuchsia-colored ki beam that emanates from his hands and body.",
        trait: "Minor Probability of wounding the whole body.",
        limit: 45,
        rule: "F",
        damage: {
          health: 250,
          upper: 0.25,
          lower: 0.25,
          internal: 0.25,
        },
      },
      {
        name: "final_flash",
        type: "offensive",
        define:
          "It is one of the most powerful signature attacks of Vegeta, along with his Galick Gun and Big Bang Attack. The Final Flash is formed by Vegeta throwing both arms open, hands held vertically and fingers wide while gathering ki. Forming a sphere of energy in the space between the palms of each hand that emits sporadic bolts of electric yellow ki that shoot out in all directions. Finally, he discharges a massive golden beam of energy with electric ki streaming around it towards his opponent. The scope of the attack can be huge enough to be seen in space, with the potency to destroy planets.",
        trait: "Modest probability of chest & rib injuries.",
        limit: 68,
        rule: "H&F",
        damage: {
          health: 300,
          upper: 0.5,
          lower: 0.1,
          internal: 0.4,
        },
      },
      {
        name: "final_explosion",
        type: "offensive",
        define:
          "The Final Atonement. The Last Resort used by Vegeta when cornered to save his loved ones. Beginning the attack, Vegeta gathers his life force and converts it into energy, creating flame-like ribbons of energy that spiral around his body. Both his and his opponent's bodies begin emitting small flecks of golden light, resembling dust blowing off of their skin. After giving a furious yell, Vegeta unleashes the attack as a gigantic, swirling dome of golden energy, inflicting monumental damage to his target and their surroundings. His Final Sacrifice.",
        trait: "Stupendous probability of crushing everything.",
        limit: 85,
        rule: "N",
        damage: {
          health: 300,
          upper: 0.7,
          lower: 0.6,
          internal: 0.7,
        },
      },
      {
        name: "hakai",
        type: "offensive",
        define:
          "The power to lay destruction to literally anything. A powerful ability used only by the mighty Gods of Destruction.Vegeta becoming proficient with this skill, being recognized by Beerus himself and given a signature God of Destruction earring as proof of his mastery over this ability, he can now use it with his Ultra Ego Transformation, which emits the same purple aura of destruction.",
        trait: "Significant damage and extensive probability of internal bleeding.",
        limit: 100,
        rule: "H&F",
        damage: {
          health: 450,
          upper: 0.4,
          lower: 0.3,
          internal: 0.8,
        },
      },
    ],
  },
};

export { players };
