// Developpé en POO
const main = document.querySelector("main");
const ArrayDeBase = [
  { photo: 0, minutes: 1 },
  { photo: 1, minutes: 1 },
  { photo: 2, minutes: 1 },
  { photo: 3, minutes: 1 },
  { photo: 4, minutes: 1 },
  { photo: 5, minutes: 1 },
  { photo: 6, minutes: 1 },
  { photo: 7, minutes: 1 },
  { photo: 8, minutes: 1 },
  { photo: 9, minutes: 1 },
];
let exerciceArray = [
  // //De base chaque exo dure 1 minutes
]; // variable qui stock nos exos

// Checking storage (fonction auto-invoquée)
(() => {
  if (localStorage.exercices) {
    exerciceArray = JSON.parse(localStorage.exercices);
  } else {
    exerciceArray = ArrayDeBase;
  }
})();

//Gestion du timer en fonction de la routine choisie dans la page "routine"
class Exercice {
  constructor() {
    this.index = 0; // = exercice.index = photo : 0
    this.minutes = exerciceArray[this.index].minutes;

    this.seconds = 0;
  }
  updateCountdown() {
    this.seconds = this.seconds < 10 ? "0" + this.seconds : this.seconds;

    setTimeout(() => {
      if (this.minutes === 0 && this.seconds === "00") {
        // "00" car on a ajouté un 0 plus haut aux secondes
        this.index++;
        this.ring();
        if (this.index < exerciceArray.length) {
          this.minutes = exerciceArray[this.index].minutes;
          this.seconds = 0;
          this.updateCountdown();
        } else {
          return page.finish();
        }
      } else if (this.seconds === "00") {
        this.minutes--;
        this.seconds = 59;
        this.updateCountdown();
      } else {
        this.seconds--;
        this.updateCountdown(); //Rejouer la fonction pour re-checker si la 1ere condition est remplie, si le timer est terminé pour passer à un autre exercice
      }
    }, 1000);

    return (main.innerHTML = `
  <div class ="exercice-container">
  <p>${this.minutes}:${this.seconds}</p>
  <img src="./img/${exerciceArray[this.index].photo}.png">
  <div>${this.index + 1} /${exerciceArray.length}</div>
  </div> 
  `);
  }

  // Fonction Ring avec objet JS "Audio" que l'on instancie
  ring() {
    const audio = new Audio();
    audio.src = "ring.mp3";
    audio.play();
  }
}

// Toutes les fonctions () qui vont nous être utiles et que l'on pourra appeler
const utils = {
  pageContent: function (title, content, btn) {
    // le contenu de la page (title:h1 // content:main // btn// btn-container)
    document.querySelector("h1").innerHTML = title;
    main.innerHTML = content;
    document.querySelector(".btn-container").innerHTML = btn;
  },
  eventDesMinutes: function () {
    document.querySelectorAll('input[type="number"]').forEach((input) => {
      input.addEventListener("input", (e) => {
        console.log(e);
        exerciceArray.map((exo) => {
          //console.log("test du map 10x car 10 objets");
          if (exo.photo == e.target.id) {
            exo.minutes = parseInt(e.target.value);
            console.log(exerciceArray);
            this.storage(); // Stockage du [] à chaque fois que l'on change les minutes. Comme ça la routine est sauvegardée
          }
        });
      });
    });
  },
  eventDesFleches: function () {
    document.querySelectorAll(".arrow").forEach((fleche) => {
      fleche.addEventListener("click", (e) => {
        console.log(e); // L'endroit où l'on click se trouve dans dataset.pic
        //Trouver Position de chaque boite:
        let position = 0;
        exerciceArray.map((exo) => {
          if (exo.photo == e.target.dataset.pic && position !== 0) {
            // [exerciceArray[0], exerciceArray[1]] = [
            //   exerciceArray[1],
            //   exerciceArray[0],
            // ];
            [exerciceArray[position], exerciceArray[position - 1]] = [
              exerciceArray[position - 1],
              exerciceArray[position],
            ];
            console.log(exerciceArray);
            page.accueil();
            this.storage(); // stockage du [] quand on bouge les fleches
          } else {
            //Dès que le numéro de la photo ne correspond plus à l'endroit ou la fleche est cliquée => position++
            position++;
            console.log(position);
          }
        });
      });
    });
  },
  deleteItem: function () {
    document.querySelectorAll(".deleteBtn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        console.log(e);
        let arrayMap = [];
        exerciceArray.map((exo) => {
          if (exo.photo != e.target.dataset.pic) {
            arrayMap.push(exo);
          }
        });
        exerciceArray = arrayMap;
        console.log(exerciceArray);

        page.accueil(); // Ici je relance le map d'affichage de la méthode accueil qui va se MAJ en fonction de exerciceArray
        this.storage(); // Quand on supprime un exo on veut stocker le nouveau []
      });
    });
  },
  reboot: function () {
    //Stockage d'un tableau contenant les exercices tels qu'ils étaient présents au départ dans exerciceArray
    exerciceArray = ArrayDeBase;
    page.accueil(); // Refaire le map pour actualiser le fait qu'on souhaite a nouveau avoir ts les exo dispos.
    this.storage(); // "this.storage()" = utils.storage car on est dans l'objet utils => Pas besoin de le répéter
  },
  storage: function () {
    localStorage.exercices = JSON.stringify(exerciceArray); //localStorage ne peut recevoir que du format JSON
  },
}; // stock toutes nos fonctions utiles au projet

const page = {
  accueil: function () {
    //Page d'accueil
    let mapArray = exerciceArray
      .map((exo) => {
        return `
        <li>
            <div class = "card-header">
                <input type = "number" id="${exo.photo}" min="1" max ="10" value=${exo.minutes}>
                <span>min</span>
            </div>
             <img src="./img/${exo.photo}.png" alt="Ceci est une image de yoga">
             <i class ="fas fa-arrow-alt-circle-left arrow" data-pic=${exo.photo}></i>
             <i class="fas fa-times-circle deleteBtn" data-pic="${exo.photo}"></i>
             </li>
        `;
      })
      .join("");

    utils.pageContent(
      "Choisissez un paramétrage <i id='reboot' class='fas fa-undo' ></i>",
      "<ul>" + mapArray + "</ul>",
      "<button id='start'> Commencer<i class ='far fa-play-circle'></i></button>"
    );
    utils.eventDesMinutes();
    utils.eventDesFleches();
    utils.deleteItem();
    reboot.addEventListener("click", () => utils.reboot());
    start.addEventListener("click", () => {
      this.routine(); // = page.routine()
    });
  },

  routine: function () {
    // page de notre routine
    const exercice = new Exercice();
    utils.pageContent("Routine", exercice.updateCountdown(), null); // Si je mets rien en paramètre ça renvoie undefined donc je mets null car pas de boutons
  },

  finish: function () {
    // page de fin
    utils.pageContent(
      "C'est terminé !",
      "<button id='start'> Recommencer </button>",
      "<button id='reboot' class='btn-reboot'> Réinitialiser<i class= 'fas fa-times-circle'></i></button>"
    );
    start.addEventListener("click", () => this.routine());

    reboot.addEventListener("click", () => utils.reboot()); //(remettre [] à 0)
  },
}; // les 3 différentes pages que dans lesquelles on navigue sans aucun rechargement

page.accueil();
