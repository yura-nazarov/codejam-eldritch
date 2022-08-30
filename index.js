import ancientsData from "./data/ancients.js";
import { brownCards, blueCards, greenCards } from "./data/mythicCards/index.js";
import difficulties from "./data/difficulties.js";

const app = document.querySelector('.App');
const ancientCard = document.querySelectorAll('.ancient-card');
const difficulty = document.querySelectorAll('.difficulty');
const currentState = document.querySelectorAll('.current-state');
const stageContainer = document.querySelectorAll('.stage-container');
const dotsContainer = document.querySelectorAll('.dots-container');
const dotsContainerDot = document.querySelectorAll('.dot');

let currentAncient = 0;
let currentDifficulty = 2;


let green = [];
let blue = [];
let brown = [];
let countGreenBlueBrown = [0, 0, 0];

let stages = { greenCards, blueCards, brownCards };
let fullStages = {};
alert('Привет!Почти все сделал. В консоли показывает конечный массив с картами - miniStage. Доделаю завтра, что бы по рядам брались карты и картинки что бы показывались.');
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

let currentStage = [
   [],
   [],
   [],
];
const stateForAncient = (ancientNumber) => {
   indexVisual = 0;
   currentStage = [
      [],
      [],
      [],
   ];
   currentStage[0].push(ancientsData[ancientNumber].firstStage.greenCards);
   currentStage[0].push(ancientsData[ancientNumber].firstStage.blueCards);
   currentStage[0].push(ancientsData[ancientNumber].firstStage.brownCards);
   currentStage[0].push(ancientsData[ancientNumber].firstStage.greenCards + ancientsData[ancientNumber].firstStage.blueCards + ancientsData[ancientNumber].firstStage.brownCards);
   currentStage[1].push(ancientsData[ancientNumber].secondStage.greenCards);
   currentStage[1].push(ancientsData[ancientNumber].secondStage.blueCards);
   currentStage[1].push(ancientsData[ancientNumber].secondStage.brownCards);
   currentStage[1].push(ancientsData[ancientNumber].secondStage.greenCards + ancientsData[ancientNumber].secondStage.blueCards + ancientsData[ancientNumber].secondStage.brownCards);
   currentStage[2].push(ancientsData[ancientNumber].thirdStage.greenCards);
   currentStage[2].push(ancientsData[ancientNumber].thirdStage.blueCards);
   currentStage[2].push(ancientsData[ancientNumber].thirdStage.brownCards);
   currentStage[2].push(ancientsData[ancientNumber].thirdStage.greenCards + ancientsData[ancientNumber].thirdStage.brownCards + ancientsData[ancientNumber].thirdStage.brownCards);

   console.log(ancientsData[ancientNumber].firstStage);
   console.log(ancientsData[ancientNumber].secondStage);
   console.log(ancientsData[ancientNumber].thirdStage);
   countAmountsEachColorOfCards(ancientsData[ancientNumber].firstStage);
   countAmountsEachColorOfCards(ancientsData[ancientNumber].secondStage);
   countAmountsEachColorOfCards(ancientsData[ancientNumber].thirdStage);
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
let indexRow = 0;
let indexVisual = 0;
// подсчитывает общее кол-во зеленых, коричневых и синих карт в массив countGreenBlueBrown
const countAmountsEachColorOfCards = (stage) => {
   let index = 0;
   for (let key in stage) {
      // currentStage[indexRow][index] = stage[key];
      dotsContainerDot[indexVisual++].innerHTML = stage[key];

      countGreenBlueBrown[index] += stage[key];
      index++;
   }
   indexRow++;
   // return currentStage;
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
            if (fullStagesCopy[key].color === 'blue' && (countGreenBlueBrown[2] - contForBlueCards++ > 0)) {
               console.log('countGreenBlueBrown[0]', countGreenBlueBrown[2], 'contForBlueCards', contForBlueCards);
               miniStage[key] = fullStagesCopy[key];
               delete fullStagesCopy[key];
               continue;
            }
            if (fullStagesCopy[key].color === 'brown' && (countGreenBlueBrown[1] - contForBrownCards++ > 0)) {
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
         if (fullStagesCopy[key].color === 'blue' && (countGreenBlueBrown[2] - contForBlueCards++ > 0)) {
            console.log('countGreenBlueBrown[0]', countGreenBlueBrown[2], 'contForBlueCards', contForBlueCards);
            miniStage[key] = fullStagesCopy[key];
            delete fullStagesCopy[key];
            continue;
         }
         if (fullStagesCopy[key].color === 'brown' && (countGreenBlueBrown[1] - contForBrownCards++ > 0)) {
            console.log('contForBrownCards', contForBrownCards);
            miniStage[key] = fullStagesCopy[key];
            delete fullStagesCopy[key];
            continue;
         }
      }
   }

   console.log('after delete cards*******************************', fullStagesCopy);

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
         if (fullStagesCopy[key].color === 'blue' && (countGreenBlueBrown[2] - contForBlueCards++ > 0)) {
            console.log('EDDED contForBlueCards', contForBlueCards);
            miniStage[key] = fullStagesCopy[key];
            delete fullStagesCopy[key];
            continue;
         }
         if (fullStagesCopy[key].color === 'brown' && (countGreenBlueBrown[1] - contForBrownCards++ > 0)) {
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
   let shoeCart = document.querySelector('.last-card');
   // currentStage
   console.log('finalStage =', finalStage);
   // delete finalStage[0];
   let countForGreenCards = 0;
   let countForBlueCards = 0;
   let countForBrownCards = 0;

   while (currentStage[0][3] > 0) {
      for (let key in finalStage) {
         console.log(finalStage[key].color);
         console.log('currentStage[0][3]', currentStage[0][3]);

         if (currentStage[0][0] - countForGreenCards > 0) {
            if (finalStage[key].color === 'green') {
               countForGreenCards++
               dotsContainerDot[0].innerHTML = currentStage[0][0] - countForGreenCards;
               shoeCart.style.backgroundImage = `url('${finalStage[key].cardFace}')`;
               console.log('countForGreenCards', countForGreenCards);
               console.log('finalStage[key]', finalStage[key]);
               delete finalStage[key];
               currentStage[0][3]--;
               return;
            }
         } else if (finalStage[key].color === 'green' && finalStage[key].difficulty === 'normal') {
            countForGreenCards++
            dotsContainerDot[0].innerHTML = currentStage[0][0] - countForGreenCards;
            shoeCart.style.backgroundImage = `url('${finalStage[key].cardFace}')`;
            console.log('countForGreenCards', countForGreenCards);
            console.log('finalStage[key]', finalStage[key]);
            delete finalStage[key];
            currentStage[0][3]--;
            return;
         }

         if (currentStage[0][2] - countForBlueCards > 0) {
            if (finalStage[key].color === 'blue') {
               countForBlueCards++
               dotsContainerDot[2].innerHTML = currentStage[0][2] - countForBlueCards;
               shoeCart.style.backgroundImage = `url('${finalStage[key].cardFace}')`;
               console.log('countForBlueCards', countForBlueCards);
               console.log('finalStage[key]', finalStage[key]);
               delete finalStage[key];
               currentStage[0][3]--;
               return;
            }
         } else if (finalStage[key].color === 'blue' && finalStage[key].difficulty === 'normal') {
            countForBlueCards++
            dotsContainerDot[2].innerHTML = currentStage[0][2] - countForBlueCards;
            shoeCart.style.backgroundImage = `url('${finalStage[key].cardFace}')`;
            console.log('countForBlueCards', countForBlueCards);
            console.log('finalStage[key]', finalStage[key]);
            delete finalStage[key];
            currentStage[0][3]--;
            return;
         }

         if (currentStage[0][1] - countForBrownCards > 0) {
            if (finalStage[key].color === 'brown') {
               countForBrownCards++;
               dotsContainerDot[1].innerHTML = currentStage[0][1] - countForBrownCards;
               shoeCart.style.backgroundImage = `url('${finalStage[key].cardFace}')`;
               console.log('countForBrownCards', countForBrownCards);
               console.log('finalStage[key]', finalStage[key]);
               delete finalStage[key];
               currentStage[0][3]--;
               return;
            }
         } else if (finalStage[key].color === 'brown' && finalStage[key].difficulty === 'normal') {
            countForBrownCards++;
            dotsContainerDot[1].innerHTML = currentStage[0][1] - countForBrownCards;
            shoeCart.style.backgroundImage = `url('${finalStage[key].cardFace}')`;
            console.log('countForBrownCards', countForBrownCards);
            console.log('finalStage[key]', finalStage[key]);
            delete finalStage[key];
            currentStage[0][3]--;
            return;
         }
      }
   }
}