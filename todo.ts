import inquirer from "inquirer";
import { createSpinner } from "nanospinner";
import chalk from "chalk";
import { type } from "os";
import Choice from "inquirer/lib/objects/choice";

// getTasks(){}

type Task = {
  name: string,
  toggled: boolean;
}

const options: string[] = ["Add Task", "List Tasks", "Toggle Task", "Delete Task", "Exit"];

let tasks: Task[] = [];

export async function todoApp() {
  while (true) {
    const { task } = await inquirer.prompt({
      name: "task",
      type: "select",
      message: "Welcome To The Tasks App ",
      choices: options,
    });
    
    if (task == "Add Task") {
      await addTask();
    }
    if (task == "List Tasks") {
      await showTasks();
    }
    if (task == "Toggle Task") {
      await toggleTask();
    }
    if (task == "Delete Task") {
      await deleteTask();
    }
    if (task == "Exit") {
      process.exit(0);
    }
    
    console.log(); // Add spacing between operations
  }
}

async function showTasks() {
  if (tasks.length === 0) {
    console.log(chalk.yellow("No tasks found!"));
    return;
  }

  console.log(chalk.blue("\n=== Current Tasks ==="));
  tasks.forEach((task, index) => {
    const status = task.toggled ? chalk.green("✓") : chalk.red("○");
    console.log(`${index + 1}. ${status} ${task.name}`);
  });
  console.log();
}

async function addTask() {
  const { taskName } = await inquirer.prompt({
    name: "taskName",
    type: "text",
    message: "What is the task Content"
  });

  if (taskName && taskName.trim()) {
    const newTask: Task = {
      name: taskName.trim(),
      toggled: false
    };
    tasks.push(newTask);
    console.log(chalk.green(`Task "${taskName}" added successfully!`));
  } else {
    console.log(chalk.red("Task name cannot be empty!"));
  }
}

async function toggleTask() {
  if (tasks.length === 0) {
    console.log(chalk.yellow("No tasks to toggle!"));
    return;
  }

  const taskChoices = tasks.map((task, index) => ({
    name: `${task.toggled ? "✓" : "○"} ${task.name}`,
    value: index
  }));

  const { taskIndex } = await inquirer.prompt({
    name: "taskIndex",
    type: "select",
    message: "Select a task to toggle:",
    choices: taskChoices
  });

  if (taskIndex !== undefined && tasks[taskIndex]) {
    tasks[taskIndex].toggled = !tasks[taskIndex].toggled;
    const status = tasks[taskIndex].toggled ? "completed" : "pending";
    console.log(chalk.green(`Task "${tasks[taskIndex].name}" marked as ${status}!`));
  }
}

async function deleteTask() {
  if (tasks.length === 0) {
    console.log(chalk.yellow("No tasks to delete!"));
    return;
  }

  const taskChoices = tasks.map((task, index) => ({
    name: `${task.toggled ? "✓" : "○"} ${task.name}`,
    value: index
  }));

  const { taskIndex } = await inquirer.prompt({
    name: "taskIndex",
    type: "select",
    message: "Select a task to delete:",
    choices: taskChoices
  });

  const deletedTasks = tasks.splice(taskIndex, 1);
  if (deletedTasks.length > 0 && deletedTasks[0]) {
    console.log(chalk.red(`Task "${deletedTasks[0].name}" deleted!`));
  }
}
