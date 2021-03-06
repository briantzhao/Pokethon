apiURL = "https://pokeapi.co/api/v2/";
const pokePonentSprite = document.querySelector(".pokeponent--pic");
const pokeMeSprite = document.querySelector(".pokeme--pic");
const move1 = document.querySelector(".move1");
const move2 = document.querySelector(".move2");
const move3 = document.querySelector(".move3");
const move4 = document.querySelector(".move4");

let hpLeft = document.querySelector(".pokeponent--hpleft");
let meHpLeft = document.querySelector(".pokeme--hpleft");
const attackBox = document.querySelector(".attack");

//move constructor
function Move(name, power, pp, type) {
  this.name = name;
  this.power = power;
  this.pp = pp;
  this.ppMax = pp;
  this.type = type;
  this.use = function () {
    if (this.pp > 0) {
      this.pp--;
      return [this.name, this.power];
    }
    return false;
  };
}

//pokemon constructor
function Pokemon(name, stats, types, moves) {
  this.name = name;
  this.stats = stats;
  this.types = types;
  this.moves = moves;
  this.attack = function (moveNum) {
    return moves[moveNum];
  };
}

//moves the pokemon are using
const movesBank = {
  charizard: ["wing-attack", "flamethrower", "strength", "seismic-toss"],
  blastoise: ["hydro-pump", "strength", "ice-beam", "earthquake"],
};

//instantiation of pokemon (will be filled out later by api calls)
let pokePonent;
let pokeMe;

//get information for charizard
axios
  .get(`${apiURL}pokemon/charizard/`)
  .then((response) => {
    console.log("api call for opponent data", response.data);
    pokePonentSprite.src = response.data.sprites.front_default;
    const pokePonentMoves = movesBank[response.data.name];

    //instantiate most of opponent
    pokePonent = new Pokemon(
      response.data.name,
      response.data.stats,
      response.data.types
    );
    console.log("all of opponent data other than moves", pokePonent);
    //grab data for all moves for charizard
    return Promise.all(
      pokePonentMoves.map((move) => {
        return axios.get(`${apiURL}move/${move}`);
      })
    );
  })
  .then((responses) => {
    console.log("api call for opponent moves information", responses);
    //filter move data so we get the pieces we need
    const pokePonentMoveset = responses.map((response) => {
      const createdMove = new Move(
        response.data.name,
        response.data.power,
        response.data.pp,
        response.data.type.name
      );
      return createdMove;
    });
    console.log("process api moves call to filter info", pokePonentMoveset);

    //insert moves data to opponent object
    pokePonent.moves = pokePonentMoveset;
    console.log("completed opponent object", pokePonent);
  })
  .catch((error) => {
    console.log(error);
  });

//get our pokemon
axios
  .get(`${apiURL}pokemon/blastoise/`)
  .then((response) => {
    console.log("api call for player data", response.data);
    pokeMeSprite.src = response.data.sprites.back_default;
    const pokePonentMoves = movesBank[response.data.name];

    //instantiate most of blastoise
    pokeMe = new Pokemon(
      response.data.name,
      response.data.stats,
      response.data.types
    );
    console.log("all of player data other than moves", pokeMe);
    //grab data for all moves for blastoise
    return Promise.all(
      pokePonentMoves.map((move) => {
        return axios.get(`${apiURL}move/${move}`);
      })
    );
  })

  //filter moves info we need
  .then((responses) => {
    console.log("api call for opponent moves information", responses);
    const pokePonentMoveset = responses.map((response) => {
      const createdMove = new Move(
        response.data.name,
        response.data.power,
        response.data.pp,
        response.data.type.name
      );
      return createdMove;
    });
    console.log("process api moves call to filter info", pokePonentMoveset);
    //insert moves data for player (borrowed variables from above call)
    pokeMe.moves = pokePonentMoveset;
    console.log("completed player object", pokeMe);
    let i = 1;

    pokeMe.moves.forEach((move) => {
      const moveBox = document.querySelector(`.move${i}`);
      i++;
      moveBox.innerText = `${move.name.toUpperCase()}\n PP: ${move.pp}/${
        move.ppMax
      }`;
      moveBox.classList.add(move.type);
      moveBox.addEventListener("click", (event) => {
        console.log(move);
        attackBox.innerText = `Blastoise used ${move.name}. `;
        const moveNum = event.target.classList[0].slice(-1) - 1;
        pokeMe.moves[moveNum].pp--;
        moveBox.innerText = `${move.name.toUpperCase()}\n PP: ${move.pp}/${
          move.ppMax
        }`;
        pokeMeSprite.classList.add("attackMe");

        if (move.type === "water") {
          pokePonentSprite.classList.add("damage");
          if (hpLeft.offsetWidth > 32) {
            hpLeft.style.width = `${hpLeft.offsetWidth - 64}px`;
          } else {
            hpLeft.style.width = `${hpLeft.offsetWidth - 32}px`;
          }
          // console.log(typeof hpLeft.offsetWidth);
          attackBox.innerText = attackBox.innerText + ` Super effective!`;
        } else if (move.type === "ground") {
          attackBox.innerText = attackBox.innerText + ` Nothing happened.`;
        } else {
          pokePonentSprite.classList.add("damage");
          hpLeft.style.width = `${hpLeft.offsetWidth - 32}px`;
        }
        pokeMeSprite.classList.remove("damage");
        pokePonentSprite.classList.remove("attackOp");
        if (hpLeft.offsetWidth == 0) {
          attackBox.innerText =
            attackBox.innerText + `\n Charizard fainted...You Win!`;
          pokePonentSprite.style.display = "none";
          music.pause();
          musicWin.play();
          const moveWrapper = document.querySelector(".moves");
          moveWrapper.innerHTML = "<button class='reset'>PLAY AGAIN?</button>";
          const reset = document.querySelector(".reset");
          reset.addEventListener("click", () => {
            window.location.reload();
          });
        } else {
          setTimeout(() => {
            const oppMove = pokePonent.moves[Math.floor(Math.random() * 3)];
            console.log(oppMove);
            attackBox.innerText = `Charizard used ${oppMove.name}.`;
            pokeMeSprite.classList.remove("attackMe");
            pokePonentSprite.classList.remove("damage");
            pokeMeSprite.classList.add("damage");
            pokePonentSprite.classList.add("attackOp");
            if (oppMove.name === "flamethrower") {
              // console.log(typeof hpLeft.offsetWidth);
              meHpLeft.style.width = `${meHpLeft.offsetWidth - 16}px`;
              attackBox.innerText =
                attackBox.innerText + ` Not very effective!`;
            } else {
              if (meHpLeft.offsetWidth > 16) {
                meHpLeft.style.width = `${meHpLeft.offsetWidth - 32}px`;
              } else {
                meHpLeft.style.width = `${meHpLeft.offsetWidth - 16}px`;
              }
            }

            if (meHpLeft.offsetWidth == 0) {
              attackBox.innerText =
                attackBox.innerText + `\n Blastoise fainted...You Lose!`;
              const moveWrapper = document.querySelector(".moves");
              moveWrapper.innerHTML =
                "<button class='reset'>PLAY AGAIN?</button>";
              music.pause();
              musicLoss.play();
              pokeMeSprite.style.display = "none";
              const reset = document.querySelector(".reset");
              reset.addEventListener("click", () => {
                window.location.reload();
              });
            }
          }, 2000);
        }
      });
    });
  })

  .catch((error) => {
    console.log(error);
  });
const choice = document.querySelector(".choice");
const movesOptions = document.querySelector(".moves");
const start = document.querySelector(".start-button");
const music = document.querySelector(".music-battle");
const musicWin = document.querySelector(".music-win");
const musicLoss = document.querySelector(".music-loss");
const power = document.querySelector(".power-on");
start.addEventListener("click", () => {
  start.style.display = "none";
  choice.style.display = "block";
  movesOptions.style.display = "flex";
  music.play();
});

const volumeOn = document.querySelector(".volume--on");
const volumeMute = document.querySelector(".volume--mute");
volumeOn.addEventListener("click", () => {
  music.volume = 1.0;
  musicWin.volume = 1.0;
  musicLoss.volume = 1.0;
});
volumeMute.addEventListener("click", () => {
  music.volume = 0;
  musicWin.volume = 0;
  musicLoss.volume = 0;
});

// function playMusic() {
//   console.log("inside playAudio");
//   music.play();
// }

// function pauseMusic() {
//   console.log("inside pauseAudio");
//   music.pause();
// }
