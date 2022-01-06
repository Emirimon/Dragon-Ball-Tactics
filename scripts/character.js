/* Stats & Special Moves of each individual character
   Stats = Strength, Resilience, Speed, Battle Intelligence for each Transformations
   Abilities = Object of methods 
*/
const players = {
  goku: {
    race: "Saiyan",
    attributes: [
      [5, 8, 11, 16, 20, 25],
      [6, 9, 12, 16, 22, 25],
      [7, 9, 12, 16, 23, 25],
      [8, 8, 11, 16, 23, 25],
    ],
    will: 10,
    pride: 8,
    abilities: [
      {
        name: "kamehameha",
        type: "offensive",
        define:
          "Goku's signature move since obtaining it. It unleashes a powerful and long-stretching blue energy blast from his hands while yelling the famous words KA-ME-HA-ME-HA.",
        
        limit : 20,
        rule : "H",
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
          "It is a combination of the Instant Transmission and Super Kamehameha. Goku keeps charging for Kamehameha while at the last moment, instantly teleports infront of the opponent and fires at point blank range inflicting an enormous amount of damage",
        limit : 35,
        rule : "F",
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
        limit : 55,
        rule : "H&F",
        damage: {
            health: 250,
            upper: 0.15,
            lower: 0.15,
            internal: 0.2,
          },
      },
      {
        name: "super_dragon_fist",
        type: "offensive",
        define:
          "A combination of Dragon Fist and Spirit Bomb. Goku begins to gather a massive amount of energy from Spirit Bomb and absorbs it into his body. Then proceeds to throw a punch in the form of a Giant Golden Dragon, which devours his opponent and inflicts a massive amount of damage.",
        limit : 75,
        rule : "HoF",
        damage: {
            health: 300,
            upper: 0.15,
            lower: 0.1,
            internal: 0.4,
          },
      },
      {
        name: "supreme_kamehameha",
        type: "offensive",
        define:
          "It is the most powerful version of Goku's signature move, even stronger than Divine Kamehameha. While being in his strongest and ultimate form, Mastered Ultra Instinct, Goku fires with far more force and intensity, incapacitating even the strongest of opponents.",
        limit : 100,
        rule : "H&F",
        damage: {
            health: 400,
            upper: 0.5,
            lower: 0.2,
            internal: 0.3,
          },
      },
    ],
  },
  vegeta: {
    race: "Saiyan",
    attributes: [
      [6, 9, 12, 17, 20, 25],
      [5, 8, 11, 15, 22, 25],
      [6, 8, 11, 16, 23, 25],
      [8, 8, 11, 16, 23, 25],
    ],
    will: 8,
    pride: 10,
    abilities: [
      {
        name: "lucora_gun",
        type: "offensive",
        define:
          "Vegeta's signature technique. Vegeta curls his fingers and places both his hands together at chest level facing the same direction",
        limit : 15,
        rule : "HoF",
        damage: {
            health: 100 /* Opponent Health damage */,
            upper: 0.1 /* Injure Hand Probability- Locks Punch */,
            lower: 0.1 /* Injure Leg Probability- Locks Kick */,
            internal: 0.05 /*Injure internals Prob- Poison Effect*/,
          },
      },
      {
        name: "god_heat_flash",
        type: "offensive",
        define:
          "It is a combination of the Instant Transmission and Super Kamehameha. Goku keeps charging for Kamehameha while at the last moment, instantly teleports infront of the opponent and fires at point blank range inflicting an enormous amount of damage",
        limit : 35,
        rule : "H",
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
          "Goku's one of the most powerful techniques. It allows him to gather huge amounts of energy from all chosen surrounding life forms and inanimate objects to conduct that energy into a massive sphere of astounding destructive power.",
        limit : 45,
        rule : "F",
        damage: {
            health: 250,
            upper: 0.15,
            lower: 0.15,
            internal: 0.2,
          },
      },
      {
        name: "final_flash",
        type: "offensive",
        define:
          "A combination of Dragon Fist and Spirit Bomb. Goku begins to gather a massive amount of energy from Spirit Bomb and absorbs it into his body. Then proceeds to throw a punch in the form of a Giant Golden Dragon, which devours his opponent and inflicts a massive amount of damage.",
        limit : 68,
        rule : "H&F",
        damage: {
            health: 300,
            upper: 0.15,
            lower: 0.1,
            internal: 0.4,
          },
      },
      {
        name: "final_explosion",
        type: "offensive",
        define:
          "It is the most powerful version of Goku's signature move, even stronger than Divine Kamehameha. While being in his strongest and ultimate form, Mastered Ultra Instinct, Goku fires with far more force and intensity, incapacitating even the strongest of opponents.",
        limit : 85,
        rule : "N",
        damage: {
            health: 400,
            upper: 0.5,
            lower: 0.2,
            internal: 0.3,
          },
      },
      {
        name: "hakai",
        type: "offensive",
        define:
          "It is the most powerful version of Goku's signature move, even stronger than Divine Kamehameha. While being in his strongest and ultimate form, Mastered Ultra Instinct, Goku fires with far more force and intensity, incapacitating even the strongest of opponents.",
        limit : 100,
        rule : "H&F",
        damage: {
            health: 400,
            upper: 0.5,
            lower: 0.2,
            internal: 0.3,
          },
      },
    ],
  },
};

export { players };
