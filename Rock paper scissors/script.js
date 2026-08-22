const choices = ['rock', 'paper', 'scissors'];
const playerScoreRef = document.getElementById('playerScore');
const computerScoreRef = document.getElementById('computerScore');
const roundResultRef = document.getElementById('roundResult');
const resetBtn = document.getElementById('resetBtn');

let playerScore = 0;
let computerScore = 0;
let gameOver = false;

function getComputerChoice() {
  const index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

function getWinner(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) {
    return 'draw';
  }

  const playerWins =
    (playerChoice === 'rock' && computerChoice === 'scissors') ||
    (playerChoice === 'paper' && computerChoice === 'rock') ||
    (playerChoice === 'scissors' && computerChoice === 'paper');

  return playerWins ? 'player' : 'computer';
}

function updateScores() {
  playerScoreRef.textContent = playerScore;
  computerScoreRef.textContent = computerScore;
}

function announce(text, isGameOver = false) {
  roundResultRef.textContent = text;
  roundResultRef.classList.toggle('game-over', isGameOver);
}

function checkGameOver() {
  if (playerScore >= 5 || computerScore >= 5) {
    gameOver = true;
    const winner = playerScore > computerScore ? 'You win the match!' : 'Computer wins the match!';
    announce(`${winner} Press Reset Game to play again.`, true);
  }
}

function playRound(playerChoice) {
  if (gameOver) {
    return;
  }

  const computerChoice = getComputerChoice();
  const winner = getWinner(playerChoice, computerChoice);

  if (winner === 'draw') {
    announce(`Draw: you both chose ${playerChoice}.`);
    return;
  }

  if (winner === 'player') {
    playerScore += 1;
    announce(`You win this round: ${playerChoice} beats ${computerChoice}.`);
  } else {
    computerScore += 1;
    announce(`Computer wins this round: ${computerChoice} beats ${playerChoice}.`);
  }

  updateScores();
  checkGameOver();
}

function resetGame() {
  playerScore = 0;
  computerScore = 0;
  gameOver = false;
  updateScores();
  announce('Pick a move to start.');
}

document.querySelectorAll('[data-choice]').forEach((button) => {
  button.addEventListener('click', () => {
    playRound(button.dataset.choice);
  });
});

resetBtn.addEventListener('click', resetGame);
