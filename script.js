/*
 * IDB Programming: A3 — a musical instrument
 *
 * All of the code for your instrument goes in this file. It's split into sections:
 *   settings — the "fixed" parts of your program
 *   state    — the parts of your program that change over time
 *   sound    — the Tone.js instruments and effects
 *   update   — updates the state every 100ms, if necessary
 *   use      — uses the state to make sound and shapes every 100ms, if necessary
 *   controls — what happens when the player uses the pointer
 *   setup    — starts everything
 *
 * The pointer events change the state. update() and use() each run every
 * 100ms, in a loop:
 *   1. update: change the state, e.g. based on time or on the pointer's movement
 *   2. use:    make sound and move shapes, based on the state
 *
 * Shapes come from shape.js: createShape() makes one, and its methods
 * (setPosition, setSize, setColour ...) change it.
 *
 * Tone.js documentation: https://tonejs.github.io/docs/15.1.22/
 */

import { createShape } from "./shape.js";

// ---------- Settings ----------
// Settings variables should contain all of the "fixed" parts of your programs
// For example: which notes you can play, how fast things move, the tempo.
const note = "C4"; // the note played when the pointer goes down

// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: where the pointer is, how fast it's moving, or whether a drone is on.
let smallCircle;
//new
let spacePresses = 0;
let lastSpaceTime = null;
//new end

//nytt
let speeds = [];
let lastX = null;
let lastY = null;
let lastTime = null;
//nytt end

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const synth = new Tone.MonoSynth().toDestination(); // can play several notes at once
const metalSynth = new Tone.MetalSynth().toDestination();

// ---------- Update ----------
// Update the state. This is called every 100ms.
function update() {
  setTimeout(update, 100); // call update() again in 100 milliseconds
}

// ---------- Use ----------
// Use the state to make sound and move shapes. This is called every 100ms.
function use() {
  setTimeout(use, 100); // call use() again in 100 milliseconds
}

// ---------- Controls (Event Handlers) ----------
// Runs every time the pointer goes down: a click, a tap or a pen touch.



// Tara start ny
function pointerMove(event) {
  const centerX = window.innerWidth * 0.50 + 100;
  const centerY = window.innerHeight * 0.35 + 100;

  if (
    event.clientX > centerX - 60 &&
    event.clientX < centerX + 60 &&
    event.clientY > centerY - 60 &&
    event.clientY < centerY + 60
  ) {
    const time = Date.now();
    const normX = event.clientX / window.innerWidth;
    const normY = event.clientY / window.innerHeight;

    if (lastTime !== null && time > lastTime) {
      const distance = Math.hypot(normX - lastX, normY - lastY);
      const seconds = (time - lastTime) / 1000;
      const speed = distance / seconds;

      speeds.push(speed);

      if (speeds.length > 10) {
        speeds.shift();
      }

      const average = speeds.reduce((a, b) => a + b, 0) / speeds.length;
      console.log("Average speed:", average.toFixed(2));
    }

    lastX = normX;
    lastY = normY;
    lastTime = time;

    smallCircle.setPosition(
      (event.clientX - 25) / window.innerWidth,
      (event.clientY - 25) / window.innerHeight
    );

    synth.triggerAttackRelease(note, "12n");
  } else {
    lastX = null;
    lastY = null;
    lastTime = null;
  }
}
// Tara end ny

// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  update(); // start the update loop
  use(); // start the use loop

  // Example: a shape near the middle of the window. Replace it with your own.
  const example = createShape("example");
  example.setPosition(0.50, 0.35);

  // Tara - Start
  smallCircle = createShape("smallCircle");
  smallCircle.setSize(50);
  smallCircle.setPosition(0.60, 0.45);
  smallCircle.setColour(30, 100, 50);

  const rectangle = createShape("rectangle");
  rectangle.setSize(150, 200);
  rectangle.setRoundedness(0);
  rectangle.setPosition(0.30, 0.35);
  rectangle.setColour(280, 60, 35);
//new
window.addEventListener("keydown", function(event) {
  if (event.code === "Space" && !event.repeat) {
    const time = Date.now();
    spacePresses++;

    if (lastSpaceTime !== null) {
      const seconds = (time - lastSpaceTime) / 1000;
      console.log("Time between presses:", seconds.toFixed(2), "seconds");
    }

    console.log("Number of space presses:", spacePresses);
    lastSpaceTime = time;

    rectangle.element.style.transform = "scale(0.95)";
    metalSynth.triggerAttackRelease("8n");
  }
});
//new end

window.addEventListener("keyup", function(event) {
  if (event.code === "Space") {
    rectangle.element.style.transform = "scale(1)";
  }
});
  // Tara - End

  // Put your event listener code here
  window.addEventListener("pointermove", pointerMove);
}

setup(); // Always remember to call setup()!
