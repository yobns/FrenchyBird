import React, { useEffect, useState } from "react";
import "./Game.css";
import sound from '../media/sound.wav';
import axios from "axios";
import Confetti from 'react-confetti';

const BIRD_HEIGHT = 30;
const BIRD_WIDTH = 50;
const WALL_HEIGHT = 600;
const WALL_WIDTH = 400;
const GRAVITY = 1;
const JUMP_STRENGTH = 15;
const OBJ_WIDTH = 50;
const OBJ_GAP = 200;
const OBJ_SPEED = 8;

function Game() {
  const [isStart, setIsStart] = useState(false);
  const [birdPos, setBirdPos] = useState(WALL_HEIGHT / 2 - BIRD_HEIGHT / 2);
  const [birdSpeed, setBirdSpeed] = useState(0);
  const [objHeight, setObjHeight] = useState(0);
  const [objPos, setObjPos] = useState(WALL_WIDTH);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isBestScore, setIsBestScore] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const username = localStorage.getItem('username');
  const id = localStorage.getItem('id');

  useEffect(() => {
    const fetchBestScore = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/bestScore/${id}`);
        setBestScore(response.data.bestScore.score);
      } catch (error) {
        console.error('Error', error);
      }
    }
    fetchBestScore();
  }, [id]);

  useEffect(() => {
    const jump = () => {
      if (isStart)
        setBirdSpeed(-JUMP_STRENGTH);
      else
        startGame();
    }

    const handleClick = () => { jump() };
    const isPhone = 'ontouchstart' in window;

    if (isPhone) {
      window.addEventListener("touchstart", handleClick);
      return () => window.removeEventListener("touchstart", handleClick);
    }
    else {
      window.addEventListener("keydown", handleClick);
      window.addEventListener("click", handleClick);
      return () => {
        window.removeEventListener("keydown", handleClick);
        window.removeEventListener("click", handleClick);
      }
    }
  }, [isStart]);

  /* eslint-disable */
  useEffect(() => {
    if (!isStart)
      return;

    const updateBirdPositionAndSpeed = () => {
      const newBirdSpeed = birdSpeed + GRAVITY;
      const newBirdPos = birdPos + newBirdSpeed;
      setBirdSpeed(newBirdSpeed);
      setBirdPos(newBirdPos);
      return { newBirdPos, newBirdSpeed };
    }

    const checkCollision = (newBirdPos) => {
      const birdLeft = WALL_WIDTH * 0.2;
      const birdRight = birdLeft + BIRD_WIDTH;
      const birdTop = newBirdPos;
      const birdBottom = newBirdPos + BIRD_HEIGHT;

      if (birdBottom > WALL_HEIGHT ||
        (objPos < birdRight && objPos + OBJ_WIDTH > birdLeft &&
          (birdTop < objHeight || birdBottom > objHeight + OBJ_GAP))
      ) { endGame() }
    }

    const birdInterval = setInterval(() => {
      const { newBirdPos } = updateBirdPositionAndSpeed();
      checkCollision(newBirdPos);
    }, 24)

    return () => clearInterval(birdInterval);
  }, [isStart, birdPos, birdSpeed, objHeight, objPos]);

  useEffect(() => {
    let objInterval;

    const updateObject = () => {
      if (isStart) {
        setObjPos((objPos) => objPos - OBJ_SPEED);

        if (objPos + OBJ_WIDTH < 0) {
          setObjPos(WALL_WIDTH);
          setObjHeight(Math.floor(Math.random() * (WALL_HEIGHT - OBJ_GAP)));
          setScore((score) => {
            const audio = new Audio(sound);
            audio.play().catch(error => console.error("Error playing the sound:", error));
            return score + 1;
          })
        }
      }
    }

    objInterval = setInterval(updateObject, 24);
    return () => { clearInterval(objInterval) };
  }, [isStart, objPos]);

  const submitScoreToApi = async (score) => {
    try {
      const scoreObj = { userId: id, score: score, date: new Date() };
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/addScore/${id}`, scoreObj);
    } catch (err) {
      console.log(err);
    }
  }

  const startGame = () => {
    setIsStart(true);
    setBirdPos(WALL_HEIGHT / 2 - BIRD_HEIGHT / 2);
    setBirdSpeed(0);
    setObjPos(WALL_WIDTH);
    setScore(0);
    setIsGameOver(false);
    setIsBestScore(false)
  }

  const endGame = () => {
    setIsStart(false);
    setBirdSpeed(0);
    setBirdPos(WALL_HEIGHT / 2 - BIRD_HEIGHT / 2);
    setObjPos(WALL_WIDTH + 10);
    setObjHeight(Math.floor(Math.random() * (WALL_HEIGHT - OBJ_GAP)));
    setIsGameOver(true);
    submitScoreToApi(score);
    if (score > bestScore) {
      setBestScore(score);
      setIsBestScore(true)
      setTimeout(() => setIsBestScore(false), 10000);
    }
  }

  return (
    <div className="home">
      <div className="game">
        {isBestScore ? <Confetti /> : null}
        <h3 className="welcome">Welcome<span className='fst-italic'>{username}</span>!</h3>
        <div className={`background ${isStart ? "start" : ""}`}>
          {isStart ? (<span className="score">{score}</span>)
            : (<>
              <span className="title">Frenchy<span style={{ color: '#ffea88', fontStyle: 'italic' }}>Bird</span></span>

              <div className="startBoard">
                {isGameOver ? (<>
                  {isBestScore ? (<>BEST<br />SCORE!<br /><span className="tryAgain">Click to try again</span></>)
                    : (<>GAME<br />OVER! <br /><span className="tryAgain">Click to try again</span></>)}
                </>) : (<>Click<br />ANYWHERE<br />to Start</>)
                }
              </div>

              <div className="scoreBottom">
                {isGameOver && <div>Score: {score}</div>}
                <div style={{ color: '#ffea88' }}>Best: {bestScore}</div>
              </div>
            </>)}

          <div
            className="bird"
            style={{ top: birdPos + "px" }}
          />
          <div
            className="obj top"
            style={{
              top: 0,
              height: objHeight + "px",
              left: objPos + "px",
            }}
          />
          <div
            className="obj bottom"
            style={{
              top: objHeight + OBJ_GAP + "px",
              height: WALL_HEIGHT - objHeight - OBJ_GAP + "px",
              left: objPos + "px",
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Game;