let players = [];
let currentPlayerIndex = 0;
let maxGuesses = 10;
let luckyNumber = Math.floor(Math.random() * 100) + 1;
let guessCount = 0;
let attempts = [];

// Toggle max guesses input field
function toggleMaxGuesses() {
    const setMaxGuesses = document.getElementById("setMaxGuesses").value;
    const maxGuessesInput = document.getElementById("maxGuessesInput");
    if (setMaxGuesses === "yes") {
        maxGuessesInput.classList.remove("hidden");
    } else {
        maxGuessesInput.classList.add("hidden");
    }
}

// Function to set up the game
function setupGame() {
    const playersCount = parseInt(document.getElementById("playersCount").value);
    const enterNames = document.getElementById("enterNames").value;
    const setMaxGuesses = document.getElementById("setMaxGuesses").value;
    
    // Set max guesses if the player opted to set a limit
    if (setMaxGuesses === "yes") {
        maxGuesses = parseInt(document.getElementById("maxGuesses").value);
    }

    // Set player names
    if (enterNames === 'yes') {
        players = [];
        const namesContainer = document.getElementById("namesContainer");
        namesContainer.innerHTML = '';
        for (let i = 0; i < playersCount; i++) {
            namesContainer.innerHTML += `<label>Player ${i + 1} Name: </label><input type="text" id="playerName${i}" placeholder="Enter name"><br>`;
        }

        document.getElementById("playerNamesInput").classList.remove("hidden");
        document.querySelector('.setup').classList.add('hidden');
    } else {
        // Default player names if no names are entered
        players = Array.from({ length: playersCount }, (_, i) => `Player ${i + 1}`);
        startGame();
    }
}

// Function to start the game rounds
function startGame() {
    if (players.length === 0) {
        const playersCount = parseInt(document.getElementById("playersCount").value);
        for (let i = 0; i < playersCount; i++) {
            const name = document.getElementById(`playerName${i}`).value || `Player ${i + 1}`;
            players.push(name);
        }
    }

    attempts = Array(players.length).fill(0);
    document.getElementById("playerNamesInput").classList.add("hidden");
    document.getElementById("gameSection").classList.remove("hidden");

    showCurrentPlayer();
}

// Function to display the current player's turn
function showCurrentPlayer() {
    document.getElementById("playerTurn").innerText = `${players[currentPlayerIndex]}'s turn!`;
}

// Function to submit a guess
function submitGuess() {
    const guess = parseInt(document.getElementById("guessInput").value);

    // Validate guess
    if (isNaN(guess) || guess < 1 || guess > 100) {
        document.getElementById("result").innerText = "Invalid input! Please enter a number between 1 and 100.";
        return;
    }

    guessCount++;
    attempts[currentPlayerIndex]++;

    // Check if player exceeded maximum guesses
    if (guessCount > maxGuesses) {
        document.getElementById("result").innerText = `Sorry, you've exceeded the maximum guesses. The lucky number was ${luckyNumber}.`;
        return;
    }

    // Check if the guess is correct, too high, or too low
    if (guess > luckyNumber) {
        document.getElementById("result").innerText = "Too high! Try again.";
    } else if (guess < luckyNumber) {
        document.getElementById("result").innerText = "Too low! Try again.";
    } else {
        document.getElementById("result").innerText = `Congrats, ${players[currentPlayerIndex]}! You guessed it in ${attempts[currentPlayerIndex]} attempts.`;
        updateScores();  // Update the score when the player guesses correctly
        nextPlayer();
    }

    // Provide hint if guess is close
    if (Math.abs(guess - luckyNumber) <= 5 && guess !== luckyNumber) {
        document.getElementById("hint").innerText = "You're very close!";
    } else {
        document.getElementById("hint").innerText = "";
    }

    // Update remaining guesses display
    document.getElementById("remainingGuesses").innerText = `Remaining guesses: ${maxGuesses - guessCount}`;
}

// Function to update and display the scores
function updateScores() {
    const scoresList = document.getElementById("scoresList");
    scoresList.innerHTML = ''; // Clear the list first

    players.forEach((player, index) => {
        const scoreItem = document.createElement("li");
        scoreItem.innerText = `${player}: ${attempts[index]} attempts`;
        scoresList.appendChild(scoreItem);
    });

    document.getElementById("scoresSection").classList.remove("hidden"); // Show the scores section
}

// Move to the next player
function nextPlayer() {
    currentPlayerIndex++;
    if (currentPlayerIndex >= players.length) {
        announceWinner();
    } else {
        luckyNumber = Math.floor(Math.random() * 100) + 1;  // Reset the lucky number for the new player
        guessCount = 0;  // Reset the guess count for the new player
        showCurrentPlayer();
    }
}

// Announce the winner with the fewest attempts
function announceWinner() {
    const minAttempts = Math.min(...attempts);
    const winners = players.filter((_, index) => attempts[index] === minAttempts);

    const winnerMessage = winners.length > 1 
        ? `It's a tie! Winners are ${winners.join(', ')} with ${minAttempts} attempts each!`
        : `${winners[0]} is the winner with ${minAttempts} attempts!`;

    document.getElementById("result").innerText = winnerMessage;
    document.getElementById("hint").innerText = "";
    updateScores();  // Display final scores
}

// Function to reset the game
function resetGame() {
    luckyNumber = Math.floor(Math.random() * 100) + 1;
    guessCount = 0;
    currentPlayerIndex = 0;
    attempts = Array(players.length).fill(0);
    document.getElementById("result").innerText = "";
    document.getElementById("hint").innerText = "";
    document.getElementById("guessInput").value = "";

    showCurrentPlayer();
    document.getElementById("scoresSection").classList.add("hidden");  // Hide the scores section for a new game
}
