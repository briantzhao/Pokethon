apiURL = "https://pokeapi.co/api/v2/";
const pokePonentSprite = document.querySelector(".pokeponent-pic");
const pokeMeSprite = document.querySelector(".pokeme-pic");
const move1 = document.querySelector(".move1");
const move2 = document.querySelector(".move2");
const move3 = document.querySelector(".move3");
const move4 = document.querySelector(".move4");
function Move(name, power, pp, type) {
  this.name = name;
  this.power = power;
  this.pp = pp;
  this.type = type;
  this.use = function () {
    if (this.pp > 0) {
      this.pp--;
      return [this.name, this.power];
    }
    return false;
  };
}
function Pokemon(name, stats, types, moves) {
  this.name = name;
  this.stats = stats;
  this.types = types;
  this.moves = moves;
  this.attack = function (moveNum) {
    return moves[moveNum];
  };
}
const movesBank = {
  charizard: ["wing-attack", "flamethrower", "strength", "seismic-toss"],
  blastoise: ["hydro-pump", "strength", "ice-beam", "earthquake"],
};
let pokePonent;
let pokeMe;
axios
  .get(`${apiURL}pokemon/charizard/`)
  .then((response) => {
    console.log(response.data);
    pokePonentSprite.src = response.data.sprites.front_default;
    const pokePonentMoves = movesBank[response.data.name];
    console.log(pokePonentMoves);
    pokePonent = new Pokemon(
      response.data.name,
      response.data.stats,
      response.data.types
    );
    return Promise.all(
      pokePonentMoves.map((move) => {
        return axios.get(`${apiURL}move/${move}`);
      })
    );
  })
  .then((responses) => {
    const pokePonentMoveset = responses.map((response) => {
      const createdMove = new Move(
        response.data.name,
        response.data.power,
        response.data.pp,
        response.data.type.name
      );
      return createdMove;
    });
    console.log(pokePonentMoveset);
    pokePonent.moves = pokePonentMoveset;
    console.log(pokePonent);
  })
  .catch((error) => {
    console.log(error);
  });
axios
  .get(`${apiURL}pokemon/blastoise/`)
  .then((response) => {
    console.log(response.data);
    pokeMeSprite.src = response.data.sprites.back_default;
    const pokePonentMoves = movesBank[response.data.name];
    console.log(pokePonentMoves);
    pokeMe = new Pokemon(
      response.data.name,
      response.data.stats,
      response.data.types
    );
    return Promise.all(
      pokePonentMoves.map((move) => {
        return axios.get(`${apiURL}move/${move}`);
      })
    );
  })
  .then((responses) => {
    const pokePonentMoveset = responses.map((response) => {
      const createdMove = new Move(
        response.data.name,
        response.data.power,
        response.data.pp,
        response.data.type.name
      );
      return createdMove;
    });
    console.log(pokePonentMoveset);
    pokeMe.moves = pokePonentMoveset;
    console.log(pokeMe);
    console.log(pokeMe.moves[0].name);
    move1.innerText = `${pokeMe.moves[0].name} \n Power: ${pokeMe.moves[0].power} \n PP: ${pokeMe.moves[0].pp}`;
    move1.classList.add(pokeMe.moves[0].type);
    move2.innerText = `${pokeMe.moves[1].name} \n Power: ${pokeMe.moves[1].power} \n PP: ${pokeMe.moves[1].pp}`;
    move2.classList.add(pokeMe.moves[1].type);
    move3.innerText = `${pokeMe.moves[2].name} \n Power: ${pokeMe.moves[2].power} \n PP: ${pokeMe.moves[2].pp}`;
    move3.classList.add(pokeMe.moves[2].type);
    move4.innerText = `${pokeMe.moves[3].name} \n Power: ${pokeMe.moves[3].power} \n PP: ${pokeMe.moves[3].pp}`;
    move4.classList.add(pokeMe.moves[3].type);
  })
  .catch((error) => {
    console.log(error);
  });
