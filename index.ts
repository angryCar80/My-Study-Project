#!/usr/bin/env node
import inquirer from "inquirer";
import { createSpinner } from "nanospinner";
import chalk from "chalk";
import { Player } from "cli-sound";
import path from "path";
import { fileURLToPath } from "url";
import { todoApp } from "./todo";

// ─────────────────────────────
// ESM dirname fix
// ─────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─────────────────────────────
// Config
// ─────────────────────────────
const TIME_OPTIONS: string[] = ["Seconds", "Minutes", "Hours"];
const MODES_OPTIONS: string[] = ["Normal", "Promodo", "Todo App", "Quit"];
const args = process.argv.slice(2);
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ─────────────────────────────
// Sound setup
// ─────────────────────────────
let soundFile: any = "default.wav";
const player = new Player();

function changeSound() {
  const soundIndex = args.indexOf("--sound");
  if (soundIndex !== -1 && args[soundIndex + 1]) {
    soundFile = args[soundIndex + 1]?.toString();
  }

  console.log(chalk.gray(`Sound: ${soundFile}`));
}

function playSound() {
  const soundPath = path.join(__dirname, "assets", soundFile);
  player.play(soundPath).catch(() => {
    console.log(chalk.red("Failed to play sound"));
  });
}

// ─────────────────────────────
// Timer logic
// ─────────────────────────────

async function selectOption() {
  const { option } = await inquirer.prompt({
    name: "option",
    type: "select",
    message: "Choose one of the modes",
    choices: MODES_OPTIONS,
  });
  if (option == "Normal") {
    selectTimeUnit();
  }
  if (option == "Promodo") {
    playPomodo();
  }
  if (option == "Todo App"){
    await todoApp();
  }
  if (option == "Quit") {
    process.exit(0);
  }
}

async function playPomodo() {
  console.log("Work time! 25 minutes");
  await delay(25 * 60 * 1000); // 25 minutes

  console.log("Work done! Break time 💤 5 minutes");
  await delay(5 * 60 * 1000); // 5 minutes

  console.log("Break over! Back to work");
}
async function selectTimeUnit() {
  const { unit } = await inquirer.prompt({
    name: "unit",
    type: "select",
    message: "Choose time unit:",
    choices: TIME_OPTIONS,
  });

  await askDuration(unit);
}

async function askDuration(unit: string) {
  const { value } = await inquirer.prompt({
    name: "value",
    type: "number",
    message: `How many ${unit}?`,
  });

  if (!value || value <= 0) {
    console.log(chalk.red("Enter a number greater than 0\n"));
    return askDuration(unit);
  }

  startTimer(value, unit);
}

function startTimer(value: number, unit: string) {
  let ms = value * 1000;
  if (unit === "Minutes") ms *= 60;
  if (unit === "Hours") ms *= 60 * 60;

  const spinner = createSpinner("Starting timer...").start();
  spinner.success({
    text: chalk.green(`Studying for ${value} ${unit}`),
  });

  setTimeout(() => {
    console.log(chalk.bold.green("\nTime's up! Take a break."));
    playSound();
  }, ms);
}

// ─────────────────────────────
// Run app
// ─────────────────────────────
changeSound();
selectOption();
