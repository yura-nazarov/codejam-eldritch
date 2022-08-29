import ancientsData from "./data/ancients.js";
import { brownCards, blueCards, greenCards } from "./data/mythicCards/index.js";
import difficulties from "./data/difficulties.js";

const app = document.querySelector('.App');
const ancientCard = document.querySelectorAll('.ancient-card');
const difficulty = document.querySelectorAll('.difficulty');
const currentState = document.querySelectorAll('.current-state');
const stageContainer = document.querySelectorAll('.stage-container');
const dotsContainer = document.querySelectorAll('.dots-container');
const dotsContainerDot = document.querySelectorAll('.dots-container .dot');

let currentAncient = 0;
let currentDifficulty = 2;
let currentStage = [];

let green = [];
let blue = [];
let brown = [];
let countGreenBlueBrown = [0, 0, 0];

let stages = { greenCards, blueCards, brownCards };
let fullStages = {};

// объединяем три колоды карт в одну fullStages
let index = 0;
for (let key in stages) {
   for (let key2 in stages[key]) {
      fullStages[index] = stages[key][key2];
      index++;
      // console.log(fullStages);
   }
   // console.log('********************');
}

//*****************shuffle  shuffle******************* */
// переводим объект в массив
const convertObjectToArray = (object) => {
   let array = Object.keys(object)
      .map(function (key) {
         return object[key];
      });
   return array;
}

//вспомогательная функция
function putToCache(elem, cache) {
   if (cache.indexOf(elem) != -1) {
      return;
   }
   let i = Math.floor(Math.random() * (cache.length + 1));
   cache.splice(i, 0, elem);
}

//функция, возвращающая свеженький компаратор
function madness() {
   let cache = [];
   return function (a, b) {
      putToCache(a, cache);
      putToCache(b, cache);
      return cache.indexOf(b) - cache.indexOf(a);
   }
}

//собственно функция перемешивания
function shuffle(object) {
   let arr = convertObjectToArray(object);
   let compare = madness();
   arr.sort(compare);

   // переводим массив в объект
   return Object.assign({}, arr);
}
//************shuffle   shuffle************************ */



// делаем копию полной калоды карт, что бы работать с ней
// перемешиваем скопированную колоду
let fullStagesCopy = {};
// let fullStagesCopy = shuffle(Object.assign({}, fullStages));

// слушаем нажатие на мага, сложность и колоду карт
app.addEventListener('click', (e) => {
   // обнуляем массив с кол-вом карт при каждом клике
   countGreenBlueBrown = [0, 0, 0];
   if (e.target.classList.contains('ancient-card')) choseAncient(e);
   if (e.target.classList.contains('difficulty')) choseDifficulty(e);
   if (e.target.classList.contains('deck')) openCart();
})


//определяем какой маг выбран
const choseAncient = (e) => {
   ancientCard.forEach((elem, index) => {
      ancientCard[currentAncient].classList.remove('active');
      e.target.classList.add('active');
      if (elem === e.target) {
         // if (elem === e.target && currentAncient !== index) {
         currentAncient = index;
         console.log('currentAncient number', currentAncient, 'name', ancientsData[currentAncient].name);
         stateForAncient(currentAncient);
         // return currentAncient;
      }
   })
}

// сумма элементов в массиве. Сумма карт зеленые + синие + коричневые
let sumOfCards = 0;


const stateForAncient = (ancientNumber) => {
   console.log(ancientsData[ancientNumber].firstStage);
   console.log(ancientsData[ancientNumber].secondStage);
   console.log(ancientsData[ancientNumber].thirdStage);
   currentStage[0] = countAmountsEachColorOfCards(ancientsData[ancientNumber].firstStage);
   currentStage[1] = countAmountsEachColorOfCards(ancientsData[ancientNumber].secondStage);
   currentStage[2] = countAmountsEachColorOfCards(ancientsData[ancientNumber].thirdStage);
   console.log(countGreenBlueBrown);
   sumOfCards = sumOfArrayCountGreenBlueBrown(countGreenBlueBrown);
   filteringCards(currentDifficulty);
   console.log('currentStage=', currentStage);
}

const stageArray = () => {
   // currentStage
}


const choseDifficulty = (e) => {
   difficulty.forEach((elem, index) => {
      difficulty[currentDifficulty].classList.remove('active');
      e.target.classList.add('active');
      if (elem === e.target) {
         currentDifficulty = index;
         // let currentDifficulty_name = difficulties[currentDifficulty].id;
         stateForAncient(currentAncient);
         // console.log(currentDifficulty, currentDifficulty_name);
      }
   })
}

// подсчитывает общее кол-во зеленых, коричневых и синих карт в массив countGreenBlueBrown
const countAmountsEachColorOfCards = (stage) => {
   let index = 0;
   for (let key in stage) {
      currentStage[index] = stage[key];
      countGreenBlueBrown[index] += stage[key];
      index++;
   }
   return currentStage;
}

const sumOfArrayCountGreenBlueBrown = (array) => {
   let sum = array.reduce((accum, elem) => accum += elem);
   return sum;
}

let finalStage = {};

// Очень легкий: 'easy', 'hard'
// Легкий: 'none', 'hard'
// Средний: 'none', 'none'
// Высокий: 'none', 'easy'
// Очень высокий: 'hard', 'easy'
const filteringCards = (currentDifficulty) => {
   console.log('currentDifficulty', currentDifficulty, difficulties[currentDifficulty].id);
   if (difficulties[currentDifficulty].id === 'easiest') finalStage = filter('easy', 'hard');
   if (difficulties[currentDifficulty].id === 'easy') finalStage = filter('none', 'hard');
   if (difficulties[currentDifficulty].id === 'normal') finalStage = filter('none', 'none');
   if (difficulties[currentDifficulty].id === 'hard') finalStage = filter('none', 'easy');
   if (difficulties[currentDifficulty].id === 'hardest') finalStage = filter('hard', 'easy');
}


let miniStage = new Object();

// счётчик для общего кол-ва карт
let amountCards = 0;
// ountGreenBrownBlue[0] - сколько элементов каждого цвета нужно с учетом уровня сложности
// take - взять карты только определённой сложности
// delete - удалить карты определенной сложности
const filter = (take, remove) => {
   // снова копируем исходный объект и перемешиваем его, в случае нажатие  на сложность или нового мага
   const fullStagesCopy = shuffle(Object.assign({}, fullStages));
   miniStage = {};
   // считаем кол-во карт
   amountCards = 0;
   console.log('take', take);
   console.log('remove', remove);

   let contForGreenCards = 0;
   let contForBlueCards = 0;
   let contForBrownCards = 0;

   // удаляем карты с нужной сложностью
   for (let key in fullStagesCopy) {
      // считаем кол-во карт, что бы делать рандом
      amountCards++;
      // удаляем карты, не соответствующие уровню сложности, что бы делать рандом
      if (fullStagesCopy[key].difficulty === remove) {
         console.log('remove !NONE fullStagesCopy[key]', fullStagesCopy[key]);
         console.log('delete', remove, fullStagesCopy[key]);
         delete fullStagesCopy[key];

         // уменьшаем счётчик карт, если элемент удалён
         amountCards--;
         continue;
      }
   }

   for (let key in fullStagesCopy) {
      // берём карты если уставлена преференция для сложности
      if (take !== 'none') {
         if (fullStagesCopy[key].difficulty === take) {
            console.log('take !NONE fullStagesCopy[key]', fullStagesCopy[key]);
            if (fullStagesCopy[key].color === 'green' && (countGreenBlueBrown[0] - contForGreenCards++ > 0)) {
               console.log('countGreenBlueBrown[0]', countGreenBlueBrown[0], 'contForGreenCards', contForGreenCards);
               miniStage[key] = fullStagesCopy[key];
               delete fullStagesCopy[key];
               continue;
            }
            if (fullStagesCopy[key].color === 'blue' && (countGreenBlueBrown[1] - contForBlueCards++ > 0)) {
               console.log('countGreenBlueBrown[0]', countGreenBlueBrown[0], 'contForBlueCards', contForBlueCards);
               miniStage[key] = fullStagesCopy[key];
               delete fullStagesCopy[key];
               continue;
            }
            if (fullStagesCopy[key].color === 'brown' && (countGreenBlueBrown[2] - contForBrownCards++ > 0)) {
               console.log('contForBrownCards', contForBrownCards);
               miniStage[key] = fullStagesCopy[key];
               delete fullStagesCopy[key];
               continue;
            }
         }
      } else {
         console.log('take NONE fullStagesCopy[key]', fullStagesCopy[key]);
         if (fullStagesCopy[key].color === 'green' && (countGreenBlueBrown[0] - contForGreenCards++ > 0)) {
            console.log('countGreenBlueBrown[0]', countGreenBlueBrown[0], 'contForGreenCards', contForGreenCards);
            miniStage[key] = fullStagesCopy[key];
            delete fullStagesCopy[key];
            continue;
         }
         if (fullStagesCopy[key].color === 'blue' && (countGreenBlueBrown[1] - contForBlueCards++ > 0)) {
            console.log('countGreenBlueBrown[0]', countGreenBlueBrown[0], 'contForBlueCards', contForBlueCards);
            miniStage[key] = fullStagesCopy[key];
            delete fullStagesCopy[key];
            continue;
         }
         if (fullStagesCopy[key].color === 'brown' && (countGreenBlueBrown[2] - contForBrownCards++ > 0)) {
            console.log('contForBrownCards', contForBrownCards);
            miniStage[key] = fullStagesCopy[key];
            delete fullStagesCopy[key];
            continue;
         }
      }
   }

   console.log('88888*******************************', fullStagesCopy);

   // запускаем второй цикл, что бы набрать оставшиеся карты
   for (let key in fullStagesCopy) {
      if (fullStagesCopy[key].difficulty === 'normal') {
         console.log('EDDED take !NONE fullStagesCopy[key]', fullStagesCopy[key]);
         if (fullStagesCopy[key].color === 'green' && (countGreenBlueBrown[0] - contForGreenCards++ > 0)) {
            console.log('EDDED contForGreenCards', contForGreenCards);
            miniStage[key] = fullStagesCopy[key];
            delete fullStagesCopy[key];
            continue;
         }
         if (fullStagesCopy[key].color === 'blue' && (countGreenBlueBrown[1] - contForBlueCards++ > 0)) {
            console.log('EDDED contForBlueCards', contForBlueCards);
            miniStage[key] = fullStagesCopy[key];
            delete fullStagesCopy[key];
            continue;
         }
         if (fullStagesCopy[key].color === 'brown' && (countGreenBlueBrown[2] - contForBrownCards++ > 0)) {
            console.log('EDDED contForBrownCards', contForBrownCards);
            miniStage[key] = fullStagesCopy[key];
            delete fullStagesCopy[key];
            continue;
         }
      }
   }

   console.log('amountCards', amountCards);
   console.log('miniStage', miniStage);
   return miniStage;
}



const openCart = () => {
   console.log('finalStage =', finalStage);
   let shoeCart = document.querySelector('.last-card');
   for (let key in finalStage) {
      console.log(finalStage[key]);
      shoeCart.style.backgroundImage = `url('${finalStage[key].cardFace}')`;
      delete finalStage[key];
      return
   }
}