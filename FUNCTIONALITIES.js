// Copyright © 2025 Daydream2740. All Rights Reserved.
// Character.js: Focus on Stats and Levels

class Character {
    constructor(name) {
        this.name = name;
        this.level = 1;
        this.xp = 0;
        this.stats = {
            intelligence: 5,
            strength: 5,
            health: 100,
            dexterity: 5,
            speed: 5,
            aim: 5,
            defense: 5,
            endurance: 5,
        };
        this.job = "Unemployed";
    }

    displayStats() {
        console.log(
            `Name: ${this.name}\nLevel: ${this.level}\nXP: ${this.xp}\nJob: ${this.job}\nStats:`,
            this.stats
        );
    }

    levelUp() {
        const levelThresholds = [1000, 5000, 12500];
        if (this.level < levelThresholds.length && this.xp >= levelThresholds[this.level - 1]) {
            this.level++;
            console.log(`${this.name} has leveled up to Level ${this.level}!`);
            // Increase stats upon leveling up
            this.stats.strength += 2;
            this.stats.intelligence += 2;
        }
    }

    getJob(newJob) {
        const jobs = {
            Army: { requirements: { strength: 7, intelligence: 4 }, salary: 50 },
            Cashier: { requirements: { intelligence: 6, dexterity: 5 }, salary: 30 },
            OfficeWorker: { requirements: { intelligence: 5, speed: 5 }, salary: 20 }
        };

        if (jobs[newJob] && this.canGetJob(jobs[newJob])) {
            this.job = newJob;
            console.log(`${this.name} has become a ${newJob}!`);
            // Increase stats accordingly after getting a job
            if (newJob === "Army") this.stats.strength += 1;
            else if (newJob === "Cashier") this.stats.intelligence += 1;
            else if (newJob === "OfficeWorker") this.stats.dexterity += 1;
        } else {
            console.log(`${this.name} does not meet the requirements for ${newJob}.`);
        }
    }

    canGetJob(job) {
        for (let stat in job.requirements) {
            if (this.stats[stat] < job.requirements[stat]) {
                return false; // Not enough stat points
            }
        }
        return true; // Requirements are met
    }
}

// Work.js: Handling Work Mechanics and XP Gain

class Work {
    constructor(character) {
        this.character = character;
        this.lastWorkTime = 0; // Store last work time for cooldown
    }

    work() {
        const currentTime = Date.now();

        if (currentTime - this.lastWorkTime < 120000) { // Cooldown of 2 minutes (120000 ms)
            console.log("You need to wait before working again.");
            return;
        }

        const xpGained = Math.floor(Math.random() * (100 - 50 + 1)) + 50; // Gain random XP between 50 and 100
        this.character.xp += xpGained;
        console.log(`${this.character.name} has earned ${xpGained} XP! Current XP: ${this.character.xp}`);
        this.character.levelUp(); // Check if character can level up
        this.lastWorkTime = currentTime;
    }
}

// Main functionality to provide options to the player

const player = new Character("Jane Doe");
const worker = new Work(player);
player.getJob("Army"); // Automatically assign a job for demonstration

function mainMenu() {
    console.log("\nChoose an option:");
    console.log("1: View Stats");
    console.log("2: Work");
    console.log("3: Exit");

    const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readline.question("Enter your choice (1-3): ", choice => {
        if (choice === "1") {
            player.displayStats();
            mainMenu(); // Show menu again after displaying stats
        } else if (choice === "2") {
            worker.work();
            mainMenu(); // Show menu again after working
        } else if (choice === "3") {
            console.log("Exiting the game. Goodbye!");
            readline.close();
        } else {
            console.log("Invalid choice. Please choose again.");
            mainMenu(); // Repeat the menu for invalid inputs
        }
    });
}

// Start the menu
mainMenu();
