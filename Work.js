// Copyright © 2025 Daydream2740. All Rights Reserved.
// Work.js: Handling Work Mechanics and XP Gain

class Work {
    constructor(character) {
        this.character = character;
        this.lastWorkTime = 0; // Store the last work time for the cooldown
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

// Example usage
const player = new Character("Jane Doe");
player.displayStats(); // Display initial stats

// Getting a Job
player.getJob("Army"); // Example of getting a job
player.displayStats(); // Display stats after getting a job

// Working
const worker = new Work(player);
worker.work(); // First work attempt
setTimeout(() => {
    worker.work(); // Second work attempt after 2 minutes
}, 120000); // Wait for 2 minutes
