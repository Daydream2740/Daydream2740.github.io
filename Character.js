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
            // Upon leveling up, increase stats
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
            // After getting a job, increase stats accordingly
            this.stats.strength += 1; // Example: Army job boosts strength
            this.stats.intelligence += 1; // Cashier job boosts intelligence
            this.stats.dexterity += 1; // OfficeWorker boosts dexterity
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
