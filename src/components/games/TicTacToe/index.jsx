import React, { useState, useEffect, useCallback } from "react";
import useSound from "use-sound";
import "./TicTacToe.css";

const TicTacToe = ({ onScoreUpdate }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [matchWins, setMatchWins] = useState(0);
  const [matchLosses, setMatchLosses] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [accumulatedScore, setAccumulatedScore] = useState(0);
  const [isDoubleOrNothing, setIsDoubleOrNothing] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [playMove] = useSound("/assets/sounds/placeholder-move.mp3", {
    volume: 0.5,
  });
  const [playWin] = useSound("/assets/sounds/placeholder-win.mp3", {
    volume: 0.7,
  });
  const [playLose] = useSound("/assets/sounds/placeholder-lose.mp3", {
    volume: 0.7,
  });

  const calculateWinner = useCallback((squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of lines) {
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  }, []);

  const calculateScore = useCallback((moves, won = true) => {
    const baseScore = Math.max(100 - moves * 5, 10);
    return won ? baseScore : Math.round(baseScore * 0.5);
  }, []);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameOver(false);
  };

  const handleScoreSubmit = useCallback(async () => {
    if (scoreSubmitted) return;

    try {
      const totalScore = accumulatedScore + currentScore;
      await onScoreUpdate(totalScore);
      setScoreSubmitted(true);

      // Reset accumulated score and allow for replay
      setAccumulatedScore(0);
      setCurrentScore(0);
      setIsDoubleOrNothing(false);
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  }, [accumulatedScore, currentScore, onScoreUpdate, scoreSubmitted]);

  const handleDoubleOrNothing = (accept) => {
    if (accept) {
      setIsDoubleOrNothing(true);
      setAccumulatedScore((prev) => prev + currentScore);
      setCurrentScore(0); // Clear current score for next round
      resetGame();
    } else {
      setAccumulatedScore((prev) => prev + currentScore);
      setCurrentScore(0);
      handleScoreSubmit();
    }
  };

  const handleGameEnd = useCallback(
    (winner, moves) => {
      setGameOver(true);

      if (winner === "X") {
        playWin();
        setMatchWins((prev) => prev + 1);
        const roundScore = calculateScore(moves);
        setCurrentScore(roundScore);
      } else if (winner === "O") {
        playLose();
        setMatchLosses((prev) => prev + 1);

        if (isDoubleOrNothing) {
          setCurrentScore(0);
          handleScoreSubmit();
        } else {
          setCurrentScore(calculateScore(moves, false));
        }
      }
    },
    [calculateScore, handleScoreSubmit, isDoubleOrNothing, playLose, playWin]
  );

  const findBestMove = useCallback((squares) => {
    const availableMoves = squares
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }, []);

  const handlePlayerMove = (index) => {
    if (board[index] || gameOver || !isXNext || isProcessing) return;

    setIsProcessing(true);

    const newBoard = [...board];
    newBoard[index] = "X";
    playMove();
    setBoard(newBoard);
    setIsXNext(false);

    const winner = calculateWinner(newBoard);
    if (winner || newBoard.every(Boolean)) {
      handleGameEnd(winner, newBoard.filter(Boolean).length);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    let timeoutId;

    if (!isXNext && !gameOver) {
      setIsProcessing(true);

      timeoutId = setTimeout(() => {
        const newBoard = [...board];
        const move = findBestMove(newBoard);

        if (move !== undefined) {
          newBoard[move] = "O";
          playMove();
          setBoard(newBoard);
          setIsXNext(true);

          const winner = calculateWinner(newBoard);
          if (winner || newBoard.every(Boolean)) {
            handleGameEnd(winner, newBoard.filter(Boolean).length);
          }
        }
        setIsProcessing(false);
      }, 500);
    }

    return () => timeoutId && clearTimeout(timeoutId);
  }, [
    isXNext,
    gameOver,
    board,
    findBestMove,
    playMove,
    calculateWinner,
    handleGameEnd,
  ]);

  return (
    <div className="ttt-container">
      <div className="ttt-game-info">
        <div>Current Score: {currentScore}</div>
        <div>Accumulated Score: {accumulatedScore}</div>
        <div>Wins: {matchWins}</div>
        <div>Losses: {matchLosses}</div>
      </div>

      <div className="ttt-game-board">
        {board.map((square, idx) => (
          <button
            key={idx}
            className={`ttt-board-square ${square ? "ttt-filled" : ""}`}
            onClick={() => handlePlayerMove(idx)}
            disabled={!!square || gameOver || isProcessing}
          >
            {square}
          </button>
        ))}
      </div>

      {gameOver && (
        <div className="ttt-game-controls">
          {scoreSubmitted ? (
            <button onClick={resetGame}>Play Again</button>
          ) : matchWins >= 2 ? (
            <>
              <button onClick={() => handleDoubleOrNothing(true)}>
                Double or Nothing
              </button>
              <button onClick={() => handleDoubleOrNothing(false)}>
                Submit Score
              </button>
            </>
          ) : (
            <button onClick={resetGame}>Play Again</button>
          )}
        </div>
      )}
    </div>
  );
};

export default TicTacToe;
