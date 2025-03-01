// Game state
let gameState = {
    player: null,
    players: [], // For leaderboard
    loggedInUser: null,
    userAccounts: [], // To store user credentials
    jobOffers: [
        {
            title: "Office Worker",
            basePay: 50,
            description: "A steady 9-5 job with decent pay",
            statBoosts: { intelligence: 2, organization: 1, timeManagement: 1 },
            requirements: { intelligence: 2 }
        },
        {
            title: "Construction Worker",
            basePay: 45,
            description: "Physical labor with slightly lower pay but better strength gains",
            statBoosts: { strength: 2, manualLabor: 2, defense: 1 },
            requirements: { strength: 2 }
        },
        {
            title: "Freelancer",
            basePay: 40,
            description: "Flexible hours but less stable pay, good for dexterity",
            statBoosts: { dexterity: 2, intelligence: 1, timeManagement: 1 },
            requirements: { dexterity: 2 }
        }
    ],
    consumables: [
        { name: "Coffee", price: 100, happinessBoost: 5, duration: 5 },
        { name: "Fast Food Meal", price: 150, happinessBoost: 10, duration: 10 },
        { name: "Movie Ticket", price: 200, happinessBoost: 15, duration: 15 },
        { name: "Video Game", price: 600, happinessBoost: 20, duration: 30 },
        { name: "New Outfit", price: 800, happinessBoost: 25, duration: 40 },
        { name: "Dinner Date", price: 1000, happinessBoost: 30, duration: 45 },
        { name: "Smartphone", price: 1200, happinessBoost: 35, duration: 50 },
        { name: "Weekend Getaway", price: 1500, happinessBoost: 40, duration: 60 },
        { name: "Concert Tickets", price: 1800, happinessBoost: 45, duration: 65 },
        { name: "Gaming Console", price: 2000, happinessBoost: 50, duration: 70 },
        { name: "Smart TV", price: 2500, happinessBoost: 55, duration: 75 },
        { name: "Laptop", price: 3000, happinessBoost: 60, duration: 80 },
        { name: "Home Theater System", price: 3500, happinessBoost: 65, duration: 85 },
        { name: "Luxury Watch", price: 4000, happinessBoost: 70, duration: 90 },
        { name: "Dream Vacation", price: 5000, happinessBoost: 75, duration: 95 },
        { name: "High-end Computer", price: 6000, happinessBoost: 80, duration: 100 },
        { name: "Jewelry", price: 7000, happinessBoost: 85, duration: 105 },
        { name: "Designer Furniture Set", price: 8000, happinessBoost: 90, duration: 110 },
        { name: "Original Artwork", price: 9000, happinessBoost: 95, duration: 115 },
        { name: "Rare Collectible", price: 10000, happinessBoost: 100, duration: 120 }
    ],
    houses: [
        { name: "Small Studio Apartment", price: 10000, happinessBoost: 20, permanentHappiness: 5 },
        { name: "One Bedroom Apartment", price: 50000, happinessBoost: 30, permanentHappiness: 10 },
        { name: "Two Bedroom Apartment", price: 100000, happinessBoost: 40, permanentHappiness: 15 },
        { name: "Small House", price: 250000, happinessBoost: 60, permanentHappiness: 20 },
        { name: "Suburban Home", price: 500000, happinessBoost: 80, permanentHappiness: 25 },
        { name: "Luxury Condo", price: 1000000, happinessBoost: 100, permanentHappiness: 30 },
        { name: "Beach House", price: 2500000, happinessBoost: 150, permanentHappiness: 40 },
        { name: "Mansion", price: 5000000, happinessBoost: 200, permanentHappiness: 50 },
        { name: "Private Island Estate", price: 7500000, happinessBoost: 250, permanentHappiness: 60 },
        { name: "Luxury Castle", price: 10000000, happinessBoost: 300, permanentHappiness: 75 }
    ],
    activeEffects: [],
    workCounter: 0,
    isAdmin: false,
    adminCode: "Mr.Bee2740",
    WORK_COOLDOWN: 30000  // 30 seconds in milliseconds
};

// Utility functions
function getXpForLevel(level) {
    if (level === 1) return 0;
    return 1000 + (level - 1) * 1500;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function saveGame() {
    // Save user accounts and game state
    if (gameState.loggedInUser) {
        // Update the player data in userAccounts
        const userIndex = gameState.userAccounts.findIndex(u => u.username === gameState.loggedInUser.username);
        if (userIndex !== -1) {
            gameState.userAccounts[userIndex].playerData = gameState.player;
            gameState.userAccounts[userIndex].lastSaved = new Date().toISOString();
        }
        
        // Update player in leaderboard
        updateLeaderboard();
        
        // Save to localStorage
        localStorage.setItem('rpgGameAccounts', JSON.stringify(gameState.userAccounts));
        localStorage.setItem('rpgGamePlayers', JSON.stringify(gameState.players));
        
        displayMessage("Game saved successfully!");
    } else {
        displayMessage("You must be logged in to save the game!");
    }
}

function loadGameData() {
    // Load user accounts and leaderboard
    const savedAccounts = localStorage.getItem('rpgGameAccounts');
    const savedPlayers = localStorage.getItem('rpgGamePlayers');
    
    if (savedAccounts) {
        gameState.userAccounts = JSON.parse(savedAccounts);
    }
    
    if (savedPlayers) {
        gameState.players = JSON.parse(savedPlayers);
    }
}

function displayMessage(message) {
    let messageArea = document.getElementById('message-area');
    
    // Create message area if it doesn't exist
    if (!messageArea) {
        messageArea = document.createElement('div');
        messageArea.id = 'message-area';
        messageArea.className = 'message-area';
        document.body.appendChild(messageArea);
    }
    
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add('game-message');
    messageArea.appendChild(messageElement);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

// User account functions
function createUserAccount(username, password) {
    // Check if username already exists
    if (gameState.userAccounts.some(user => user.username === username)) {
        return false;
    }
    
    // Create new user account
    const newUser = {
        username: username,
        password: password,
        playerData: null,
        createdAt: new Date().toISOString(),
        lastSaved: null
    };
    
    gameState.userAccounts.push(newUser);
    return true;
}

function login(username, password) {
    const user = gameState.userAccounts.find(u => u.username === username && u.password === password);
    if (user) {
        gameState.loggedInUser = user;
        
        if (user.playerData) {
            // Load saved player data
            gameState.player = user.playerData;
        }
        
        return true;
    }
    return false;
}

function logout() {
    // Save game before logging out
    saveGame();
    gameState.loggedInUser = null;
    gameState.player = null;
    showAuthScreen();
}

// Player creation function
function createPlayer(name) {
    return {
        name: name,
        money: 500,
        job: null,
        level: 1,
        xp: 0,
        happiness: 100,
        baseHappiness: 100,
        stats: {
            strength: 1,
            dexterity: 1,
            speed: 1,
            defense: 1
        },
        jobStats: {
            manualLabor: 1,
            intelligence: 1,
            timeManagement: 1,
            organization: 1
        },
        statPoints: 4,
        jobPoints: 0,
        workCooldown: false,
        timesWorked: 0,
        itemsOwned: [],
        house: null
    };
}

// Update leaderboard
function updateLeaderboard() {
    if (!gameState.player) return;
    
    // Check if player exists in leaderboard
    const playerIndex = gameState.players.findIndex(p => p.name === gameState.player.name);
    
    if (playerIndex !== -1) {
        // Update existing player
        gameState.players[playerIndex].money = gameState.player.money;
        gameState.players[playerIndex].level = gameState.player.level;
    } else {
        // Add new player to leaderboard
        gameState.players.push({
            name: gameState.player.name,
            money: gameState.player.money,
            level: gameState.player.level
        });
    }
    
    // Sort leaderboard by money (highest first)
    gameState.players.sort((a, b) => b.money - a.money);
}

// Generate leaderboard rows
function generateLeaderboardRows() {
    if (gameState.players.length === 0) {
        return '<tr><td colspan="4">No players yet</td></tr>';
    }
    
    return gameState.players.map((player, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${player.name}</td>
            <td>${player.level}</td>
            <td>$${player.money.toFixed(2)}</td>
        </tr>
    `).join('');
}

// Initialize the game
window.onload = function() {
    // Load saved game data
    loadGameData();
    
    // Show auth screen
    showAuthScreen();
};

// UI Screens
function showAuthScreen() {
    const gameContainer = document.getElementById('game-container');
    
    gameContainer.innerHTML = `
        <div class="auth-screen">
            <h1>RPG Life Simulator</h1>
            <div id="login-section">
                <h2>Login</h2>
                <div class="input-group">
                    <label for="login-username">Username:</label>
                    <input type="text" id="login-username" placeholder="Enter your username">
                </div>
                <div class="input-group">
                    <label for="login-password">Password:</label>
                    <input type="password" id="login-password" placeholder="Enter your password">
                </div>
                <button onclick="loginUser()">Login</button>
            </div>
            
            <div id="register-section" style="margin-top: 30px;">
                <h2>Register</h2>
                <div class="input-group">
                    <label for="register-username">Username:</label>
                    <input type="text" id="register-username" placeholder="Choose a username">
                </div>
                <div class="input-group">
                    <label for="register-password">Password:</label>
                    <input type="password" id="register-password" placeholder="Choose a password">
                </div>
                <div class="input-group">
                    <label for="register-confirm-password">Confirm Password:</label>
                    <input type="password" id="register-confirm-password" placeholder="Confirm your password">
                </div>
                <button onclick="registerUser()">Register</button>
            </div>
        </div>
    `;
}

function registerUser() {
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    // Validate inputs
    if (!username || !password) {
        displayMessage("Username and password are required!");
        return;
    }
    
    if (password !== confirmPassword) {
        displayMessage("Passwords don't match!");
        return;
    }
    
    // Create new account
    if (createUserAccount(username, password)) {
        displayMessage("Account created successfully! You can now login.");
        
        // Clear registration fields
        document.getElementById('register-username').value = '';
        document.getElementById('register-password').value = '';
        document.getElementById('register-confirm-password').value = '';
        
        // Save to localStorage
        localStorage.setItem('rpgGameAccounts', JSON.stringify(gameState.userAccounts));
    } else {
        displayMessage("Username already exists!");
    }
}

function loginUser() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (login(username, password)) {
        displayMessage(`Welcome back, ${username}!`);
        
        if (gameState.player) {
            // Player data exists, go to main game
            initializeMainGame();
        } else {
            // New player, go to character creation
            showPlayerCreation();
        }
    } else {
        displayMessage("Invalid username or password!");
    }
}

function showPlayerCreation() {
    const gameContainer = document.getElementById('game-container');
    
    gameContainer.innerHTML = `
        <div class="creation-screen">
            <h1>Create Your Character</h1>
            <div class="input-group">
                <label for="player-name">Character Name:</label>
                <input type="text" id="player-name" placeholder="Enter character name">
            </div>
            
            <h2>Assign Stat Points (4 Available)</h2>
            <div class="stats-container">
                <div class="stat-group">
                    <label for="strength">Strength: 1</label>
                    <button onclick="adjustStat('strength', 1)">+</button>
                    <button onclick="adjustStat('strength', -1)">-</button>
                </div>
                <div class="stat-group">
                    <label for="dexterity">Dexterity: 1</label>
                    <button onclick="adjustStat('dexterity', 1)">+</button>
                    <button onclick="adjustStat('dexterity', -1)">-</button>
                </div>
                <div class="stat-group">
                    <label for="speed">Speed: 1</label>
                    <button onclick="adjustStat('speed', 1)">+</button>
                    <button onclick="adjustStat('speed', -1)">-</button>
                </div>
                <div class="stat-group">
                    <label for="defense">Defense: 1</label>
                    <button onclick="adjustStat('defense', 1)">+</button>
                    <button onclick="adjustStat('defense', -1)">-</button>
                </div>
            </div>
            
            <div class="points-remaining">Stat Points Remaining: <span id="points-remaining">4</span></div>
            
            <div class="auth-buttons">
                <button onclick="showAuthScreen()">Back</button>
                <button id="create-character" onclick="finishCharacterCreation()">Create Character</button>
            </div>
        </div>
    `;
}

// Temporary stat values during character creation
let tempStats = {
    strength: 1,
    dexterity: 1,
    speed: 1,
    defense: 1
};
let statPointsRemaining = 4;

function adjustStat(stat, amount) {
    if (amount > 0 && statPointsRemaining <= 0) return;
    if (amount < 0 && tempStats[stat] <= 1) return;
    
    tempStats[stat] += amount;
    statPointsRemaining -= amount;
    
    document.querySelector(`.stat-group label[for="${stat}"]`).textContent = `${stat.charAt(0).toUpperCase() + stat.slice(1)}: ${tempStats[stat]}`;
    document.getElementById('points-remaining').textContent = statPointsRemaining;
}

function finishCharacterCreation() {
    const playerName = document.getElementById('player-name').value;
    if (!playerName) {
        displayMessage("Please enter a character name!");
        return;
    }
    
    gameState.player = createPlayer(playerName);
    gameState.player.stats = Object.assign({}, tempStats);
    gameState.player.statPoints = statPointsRemaining;
    
    // Add to leaderboard
    gameState.players.push({
        name: playerName,
        money: gameState.player.money,
        level: gameState.player.level
    });
    
    showJobSelection();
}

function showJobSelection() {
    const gameContainer = document.getElementById('game-container');
    
    let jobsHTML = '';
    gameState.jobOffers.forEach((job, index) => {
        const canTakeJob = gameState.player.stats[Object.keys(job.requirements)[0]] >= job.requirements[Object.keys(job.requirements)[0]];
        
        jobsHTML += `
            <div class="job-card ${canTakeJob ? '' : 'job-locked'}">
                <h3>${job.title}</h3>
                <p>${job.description}</p>
                <p>Pay: $${job.basePay} per work shift</p>
                <h4>Stat Boosts:</h4>
                <ul>
                    ${Object.entries(job.statBoosts).map(([stat, boost]) => `<li>${stat.charAt(0).toUpperCase() + stat.slice(1)}: +${boost}</li>`).join('')}
                </ul>
                <p class="job-req">Requires: ${Object.keys(job.requirements)[0].charAt(0).toUpperCase() + Object.keys(job.requirements)[0].slice(1)} ${job.requirements[Object.keys(job.requirements)[0]]}</p>
                ${canTakeJob ? `<button onclick="selectJob(${index})">Take this job</button>` : '<p class="job-locked-text">Requirements not met</p>'}
            </div>
        `;
    });
    
    gameContainer.innerHTML = `
        <div class="job-selection-screen">
            <h1>Choose Your Job</h1>
            <div class="jobs-container">
                ${jobsHTML}
            </div>
        </div>
    `;
}

function selectJob(jobIndex) {
    gameState.player.job = gameState.jobOffers[jobIndex];
    initializeMainGame();
    saveGame(); // Save after selecting job
}

function initializeMainGame() {
    const gameContainer = document.getElementById('game-container');
    
    gameContainer.innerHTML = `
        <div class="main-game">
            <div class="header">
                <h1>RPG Life Simulator</h1>
                <div class="player-info">
                    <span id="player-name">${gameState.player.name}</span>
                    <span id="player-level">Level: ${gameState.player.level}</span>
                    <span id="player-money">Money: $${gameState.player.money.toFixed(2)}</span>
                    <span id="player-happiness">Happiness: ${gameState.player.happiness}%</span>
                    <div class="xp-bar-container">
                        <div id="xp-bar" style="width: ${(gameState.player.xp / getXpForLevel(gameState.player.level + 1)) * 100}%"></div>
                        <span id="xp-text">${gameState.player.xp} / ${getXpForLevel(gameState.player.level + 1)} XP</span>
                    </div>
                </div>
                <button class="logout-button"
