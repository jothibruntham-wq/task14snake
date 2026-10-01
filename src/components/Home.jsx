import React, { useCallback, useEffect, useRef, useState } from "react";
import "../assets/style/style.css";

const BOARD_SIZE = 20;

const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

function randomFood(snake) {
  let food;

  do {
    food = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    };
  } while (snake.some((part) => part.x === food.x && part.y === food.y));

  return food;
}

export default function Home() {
  const [snake, setSnake] = useState([
    { x: 9, y: 10 },
    { x: 8, y: 10 },
    { x: 7, y: 10 },
  ]);

  const [food, setFood] = useState({ x: 15, y: 8 });
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const directionRef = useRef(DIRECTIONS.RIGHT);

  const restartGame = useCallback(() => {
    const initialSnake = [
      { x: 9, y: 10 },
      { x: 8, y: 10 },
      { x: 7, y: 10 },
    ];

    setSnake(initialSnake);
    setFood(randomFood(initialSnake));
    setDirection(DIRECTIONS.RIGHT);
    directionRef.current = DIRECTIONS.RIGHT;
    setScore(0);
    setGameOver(false);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      const current = directionRef.current;

      if (key === "arrowup" || key === "w") {
        if (current !== DIRECTIONS.DOWN) {
          directionRef.current = DIRECTIONS.UP;
          setDirection(DIRECTIONS.UP);
        }
      }

      if (key === "arrowdown" || key === "s") {
        if (current !== DIRECTIONS.UP) {
          directionRef.current = DIRECTIONS.DOWN;
          setDirection(DIRECTIONS.DOWN);
        }
      }

      if (key === "arrowleft" || key === "a") {
        if (current !== DIRECTIONS.RIGHT) {
          directionRef.current = DIRECTIONS.LEFT;
          setDirection(DIRECTIONS.LEFT);
        }
      }

      if (key === "arrowright" || key === "d") {
        if (current !== DIRECTIONS.LEFT) {
          directionRef.current = DIRECTIONS.RIGHT;
          setDirection(DIRECTIONS.RIGHT);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Snake game loop
  useEffect(() => {
    if (gameOver) return;

    const timer = setInterval(() => {
      setSnake((currentSnake) => {
        const head = currentSnake[0];

        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= BOARD_SIZE ||
          newHead.y < 0 ||
          newHead.y >= BOARD_SIZE
        ) {
          setGameOver(true);
          return currentSnake;
        }

        // Body collision
        if (
          currentSnake.some(
            (part) => part.x === newHead.x && part.y === newHead.y
          )
        ) {
          setGameOver(true);
          return currentSnake;
        }

        const ateFood =
          newHead.x === food.x && newHead.y === food.y;

        const updatedSnake = [newHead, ...currentSnake];

        if (ateFood) {
          setScore((value) => value + 1);
          setFood(randomFood(updatedSnake));

          return updatedSnake;
        }

        updatedSnake.pop();

        return updatedSnake;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [food, gameOver]);

  return (
    <main className="page">
      <section className="game-card">

        {/* Header */}
        <header className="game-header">
          <div className="snake-logo">
            <svg
              width="34"
              height="25"
              viewBox="0 0 34 25"
              fill="none"
            >
              <defs>
                <linearGradient
                  id="logoGradient"
                  x1="2"
                  y1="2"
                  x2="32"
                  y2="23"
                >
                  <stop offset="0%" stopColor="#5dff65" />
                  <stop offset="45%" stopColor="#13c95c" />
                  <stop offset="100%" stopColor="#064f2b" />
                </linearGradient>
              </defs>

              <path
                d="M4 19C4 19 4 8 11 8C18 8 14 20 21 20C28 20 29 7 29 7"
                stroke="url(#logoGradient)"
                strokeWidth="3"
                strokeLinecap="round"
              />

              <circle cx="30" cy="5" r="2.2" fill="#5dff65" />
            </svg>
          </div>

          <h1>SNAKE GAME</h1>
        </header>

        {/* Game board */}
        <div className="board">

          {/* SVG grid */}
          <svg
            className="board-grid"
            viewBox="0 0 400 400"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="boardGradient"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor="#101713" />
                <stop offset="50%" stopColor="#080e0b" />
                <stop offset="100%" stopColor="#101712" />
              </linearGradient>

              <pattern
                id="gridPattern"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="#193021"
                  strokeWidth="0.7"
                  opacity="0.35"
                />
              </pattern>
            </defs>

            <rect
              width="400"
              height="400"
              fill="url(#boardGradient)"
            />

            <rect
              width="400"
              height="400"
              fill="url(#gridPattern)"
            />
          </svg>

          {/* Snake */}
          <div className="game-layer">
            {snake.map((part, index) => (
              <div
                key={`${part.x}-${part.y}-${index}`}
                className={`snake-part ${
                  index === 0 ? "snake-head" : ""
                }`}
                style={{
                  left: `${(part.x / BOARD_SIZE) * 100}%`,
                  top: `${(part.y / BOARD_SIZE) * 100}%`,
                }}
              >
                {index === 0 && (
                  <span className="eye eye-one" />
                )}

                {index === 0 && (
                  <span className="eye eye-two" />
                )}
              </div>
            ))}

            {/* Food */}
            <div
              className="food"
              style={{
                left: `${(food.x / BOARD_SIZE) * 100}%`,
                top: `${(food.y / BOARD_SIZE) * 100}%`,
              }}
            >
              <span />
            </div>
          </div>
        </div>

        {/* Score + restart */}
        <div className="bottom-row">
          <div className="score">
            Score: <strong>{score}</strong>
          </div>

          <button
            className="restart-btn"
            onClick={restartGame}
          >
            Restart
          </button>
        </div>

        {/* Game over */}
        {gameOver && (
          <div className="game-over">
            <span>GAME OVER!</span>
          </div>
        )}

        <p className="controls">
          Use <b>Arrow Keys</b> or <b>W A S D</b> to move
        </p>
      </section>
    </main>
  );
}