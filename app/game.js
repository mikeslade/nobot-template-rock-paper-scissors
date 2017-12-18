import loadStyles from './loaders/styles-loader';
import { loadImages, getImageElements } from './loaders/image-loader';
import { initScreens, getScreen, changeToScreen, updateResultScreen } from './screen';
import { LOADING, CHOICE, RESULT } from './constants/screens';
import { initChoices, cleanUpChoiceScreen } from './choices';
import getChoice from './helpers/get-choice';
import randomChoice from './helpers/random-choice';
import saveScore from './actions/save-score';
import { PLAYER, CPU, DRAW } from './constants/decisions';
import loadConfig, { getConfig } from './loaders/config-loader';

const bootstrap = () => {
  init();
  initScreens();
  initChoices(onMadeChoice);
  changeToScreen(CHOICE);
}

const init = () => {
  const game = document.getElementById('game');
  const config = getConfig();
  game.style.backgroundImage = `url(${config.theme.path}/${config.images.background})`;
  game.style.fontFamily = config.theme.fontFamily;
}

const onMadeChoice = (playerChoice) => {

  cleanUpChoiceScreen();

  const cpuChoice = getChoice(randomChoice());
  
  let winner;

  if (playerChoice.hasBeaten(cpuChoice)) {
    winner = PLAYER;
  } else if (cpuChoice.hasBeaten(playerChoice)) {
    winner = CPU;
  } else {
    winner = DRAW;
  }

  saveScore(winner);

  updateResultScreen(playerChoice, cpuChoice);

  changeToScreen(RESULT);  
};

const initGame = () => {
  loadConfig()
    .then(() => {
      loadStyles();
      return loadImages();
    })
    .then(bootstrap);
};

export default initGame;