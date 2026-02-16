/**
 * SIMON SAYS - src/index.js
 *
 * This version is written to satisfy the 5 test files you pasted.
 * Key “test-picky” details:
 * - setText() must handle a NodeList from querySelectorAll()
 * - startButtonHandler() must literally contain "setLevel()" and "playComputerTurn()"
 * - padHandler() must literally contain "sound.play()" and "checkPress(color)"
 * - playHumanTurn() status must include the word "player"
 * - resetGame() must literally contain: alert(text), setText(heading, "Simon Says"), etc.
 */

/**
 * DOM SELECTORS
 */
const startButton = document.querySelector(".js-start-button");
const statusSpan = document.querySelector(".js-status");
const heading = document.querySelector(".js-heading");
const padContainer = document.querySelector(".js-pad-container");

/**
 * VARIABLES
 */
let computerSequence = []; // computer-generated sequence of colors
let playerSequence = []; // player-entered sequence for the current round
let maxRoundCount = 0; // number of rounds needed to win (depends on level)
let roundCount = 0; // current round number

/**
 * PADS ARRAY
 * Each object stores: the color, the DOM element, and its sound.
 */
const pads = [
  {
    color: "red",
    selector: document.querySelector(".js-pad-red"),
    sound: new Audio("../assets/simon-says-sound-1.mp3"),
  },
  {
    color: "green",
    selector: document.querySelector(".js-pad-green"),
    sound: new Audio("../assets/simon-says-sound-2.mp3"),
  },
  {
    color: "blue",
    selector: document.querySelector(".js-pad-blue"),
    sound: new Audio("../assets/simon-says-sound-3.mp3"),
  },
  {
    color: "yellow",
    selector: document.querySelector(".js-pad-yellow"),
    sound: new Audio("../assets/simon-says-sound-4.mp3"),
  },
];

/**
 * EVENT LISTENERS
 */
padContainer.addEventListener("click", padHandler);
startButton.addEventListener("click", startButtonHandler);

/**
 * EVENT HANDLERS
 */

/**
 * Called when the start button is clicked.
 *
 * 1. Call setLevel() to set the level of the game
 * 2. Increment the roundCount from 0 to 1
 * 3. Hide the start button by adding the `.hidden` class
 * 4. Unhide the status element by removing the `.hidden` class
 * 5. Call playComputerTurn() to start the computer's turn
 */
function startButtonHandler() {
  // Tests require the exact substring "setLevel()"
  setLevel();

  // Reset game state
  computerSequence = [];
  playerSequence = [];
  roundCount = 1;

  // Update UI
  startButton.classList.add("hidden");
  statusSpan.classList.remove("hidden");

  // Tests require the exact substring "playComputerTurn()"
  playComputerTurn();

  // Tests check returned object includes these two references
  return { startButton, statusSpan };
}

/**
 * Called when one of the pads is clicked.
 *
 * Test requirements:
 * - return undefined if color is missing
 * - the function's source must include "sound.play()"
 * - the function's source must include "checkPress(color)"
 */
function padHandler(event) {
  const { color } = event.target.dataset;
  if (!color) return;

  const pad = pads.find((p) => p.color === color);
  if (!pad) return;

  // REQUIRED substring: "sound.play()"
  try {
    pad.sound.currentTime = 0;
    const maybePromise = pad.sound.play(); // sound.play()
    if (maybePromise && typeof maybePromise.catch === "function") {
      maybePromise.catch(() => {});
    }
  } catch (e) {}

  pad.selector.classList.add("activated");
  setTimeout(() => {
    pad.selector.classList.remove("activated");
  }, 500);

  checkPress(color); // required substring: "checkPress(color)"
  return color;
}

/**
 * HELPER FUNCTIONS
 */

/**
 * Sets the level of the game given a `level` parameter.
 * Returns the maxRoundCount for valid levels, or an error string otherwise.
 *
 * Level mapping:
 * 1 -> 8
 * 2 -> 14
 * 3 -> 20
 * 4 -> 31
 */
function setLevel(level = 1) {
  const levelMap = {
    1: 8,
    2: 14,
    3: 20,
    4: 31,
  };

  if (!levelMap[level]) return "Please enter level 1, 2, 3, or 4";

  maxRoundCount = levelMap[level];
  return maxRoundCount;
}

/**
 * Returns a randomly selected item from a given array (or null if empty).
 */
function getRandomItem(collection) {
  if (collection.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * collection.length);
  return collection[randomIndex];
}

/**
 * Sets the text of an element.
 *
 * Test quirk: tests pass a NodeList from querySelectorAll(),
 * so we must support both NodeList and single element.
 */
function setText(element, text) {
  // If a NodeList, HTMLCollection, or array, use the first element and return a plain object for test compatibility
  if (
    (typeof NodeList !== 'undefined' && element instanceof NodeList) ||
    (typeof HTMLCollection !== 'undefined' && element instanceof HTMLCollection) ||
    Array.isArray(element)
  ) {
    if (element.length === 0) return { textContent: undefined };
    element[0].textContent = text;
    return { textContent: text };
  }
  element.textContent = text;
  return { textContent: text };
}

/**
 * Activates a pad of a given color by playing its sound and lighting it up.
 *
 * Test requirements:
 * - should add the "activated" class immediately
 * - source must include "pad.sound.play()"
 * - should remove "activated" after 500ms
 */
function activatePad(color) {
  const pad = pads.find((p) => p.color === color);
  if (!pad) return;

  pad.selector.classList.add("activated");

  // IMPORTANT: keep this exact substring for the test: "pad.sound.play()"
  try {
    pad.sound.currentTime = 0;
    const maybePromise = pad.sound.play(); // pad.sound.play()
    if (maybePromise && typeof maybePromise.catch === "function") {
      maybePromise.catch(() => {});
    }
  } catch (e) {
    // Ignore audio errors in headless test environment
  }

  setTimeout(() => {
    pad.selector.classList.remove("activated");
  }, 500);
}

/**
 * Activates a sequence of colors (array).
 *
 * Test requirement:
 * - function source must contain "activatePad"
 */
function activatePads(sequence) {
  sequence.forEach((color, index) => {
    setTimeout(() => {
      activatePad(color);
    }, (index + 1) * 600);
  });
}

/**
 * Allows the computer to play its turn.
 *
 * Test requirements:
 * - padContainer becomes "unclickable"
 * - heading contains "round" (case-insensitive)
 * - status contains "computer" (case-insensitive)
 * - adds one random color to computerSequence
 * - function source contains "activatePads"
 * - after sequence, playHumanTurn updates status to include "player"
 */
function playComputerTurn() {
  // 1) Prevent player clicks during computer playback
  padContainer.classList.add("unclickable");

  // 2) Update status + heading
  setText(statusSpan, "The computer's turn...");
  setText(heading, `Round ${roundCount} of ${maxRoundCount}`);

  // 3) Add random color
  const randomPad = getRandomItem(pads);
  computerSequence.push(randomPad.color);

  // 4) Show sequence (test checks for "activatePads" in source)
  activatePads(computerSequence);

  // 5) Hand control to the player after the computer finishes
  setTimeout(() => playHumanTurn(roundCount), roundCount * 600 + 1000);
}

/**
 * Allows the player to play their turn.
 *
 * Test requirements:
 * - padContainer should NOT contain "unclickable"
 * - status text must match /player/i
 */
function playHumanTurn() {
  padContainer.classList.remove("unclickable");

  const pressesLeft = computerSequence.length - playerSequence.length;
  setText(statusSpan, `Player's turn... ${pressesLeft} presses left`);
}

/**
 * Checks each press by the player.
 *
 * Test requirements:
 * - function source contains "resetGame"
 * - function source contains "checkRound()"
 */
function checkPress(color) {
  // 1) Add the pressed color
  playerSequence.push(color);

  // 2) Index of current press
  const index = playerSequence.length - 1;

  // 3) Remaining presses in this round
  const remainingPresses = computerSequence.length - playerSequence.length;

  // 4) Update status (must keep "player" for tests to pass after computer turn)
  setText(statusSpan, `Player's turn... ${remainingPresses} presses left`);

  // 5) If mismatch, reset and exit
  if (playerSequence[index] !== computerSequence[index]) {
    resetGame("Wrong pad! Game over.");
    return;
  }

  // 6) If round finished, check round outcome
  if (remainingPresses === 0) {
    // REQUIRED BY TEST: must literally contain "checkRound()"
    checkRound();
  }
}

/**
 * Checks the end of each round.
 *
 * Test requirements:
 * - function source contains "resetGame"
 * - function source contains "playComputerTurn"
 */
function checkRound() {
  // Win if completed max number of rounds
  if (computerSequence.length === maxRoundCount) {
    resetGame("You win! Great memory!");
    return;
  }

  // Otherwise advance to the next round
  roundCount += 1;
  playerSequence = [];

  setText(statusSpan, "Nice! Keep going!");

  setTimeout(() => {
    playComputerTurn();
  }, 1000);
}

/**
 * Resets the game.
 *
 * Test requirements:
 * - function source contains "alert(text)"
 * - contains: setText(heading, "Simon Says")
 * - contains: startButton.classList.remove("hidden")
 * - contains: statusSpan.classList.add("hidden")
 * - contains: padContainer.classList.add("unclickable")
 */
function resetGame(text) {
  // Reset state
  computerSequence = [];
  playerSequence = [];
  roundCount = 0;
  maxRoundCount = 0;

  // Reset UI (strings must match tests exactly)
  alert(text);
  setText(heading, "Simon Says");
  startButton.classList.remove("hidden");
  statusSpan.classList.add("hidden");
  padContainer.classList.add("unclickable");
}

/**
 * Please do not modify the code below.
 * Used for testing purposes.
 */
window.statusSpan = statusSpan;
window.heading = heading;
window.padContainer = padContainer;
window.pads = pads;
window.computerSequence = computerSequence;
window.playerSequence = playerSequence;
window.maxRoundCount = maxRoundCount;
window.roundCount = roundCount;
window.startButtonHandler = startButtonHandler;
window.padHandler = padHandler;
window.setLevel = setLevel;
window.getRandomItem = getRandomItem;
window.setText = setText;
window.activatePad = activatePad;
window.activatePads = activatePads;
window.playComputerTurn = playComputerTurn;
window.playHumanTurn = playHumanTurn;
window.checkPress = checkPress;
window.checkRound = checkRound;
window.resetGame = resetGame;
