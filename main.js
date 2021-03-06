window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1920; //800 default this can change based on bg img attributes
  canvas.height = 700; //1000
  let enemies = [];
  let score = 0;
  let gameOver = false;
  const fullScreen = document.getElementById("fullScreenButton");
  let gameSpeed = 4;

  //// new code ///

  const backgroundLayer1 = new Image();
  backgroundLayer1.src = "./assets/bg/1.png";
  const backgroundLayer2 = new Image();
  backgroundLayer2.src = "./assets/bg/2.png";
  const backgroundLayer3 = new Image();
  backgroundLayer3.src = "./assets/bg/3.png";
  const backgroundLayer4 = new Image();
  backgroundLayer4.src = "./assets/bg/4.png";
  const backgroundLayer5 = new Image();
  backgroundLayer5.src = "./assets/bg/5.png";
  const backgroundLayer6 = new Image();
  backgroundLayer6.src = "./assets/bg/6.png";
  const backgroundLayer7 = new Image();
  backgroundLayer7.src = "./assets/bg/7.png";

  class Layer {
    constructor(image, speedModifier) {
      this.x = 0;
      this.y = 0;
      this.width = 2400;
      this.height = 700;
      // this.x2 = this.width;
      this.image = image;
      this.speedModifier = speedModifier;
      this.speed = gameSpeed * this.speedModifier;
    }
    update() {
      this.speed = gameSpeed * this.speedModifier; // different speeds for each bg image
      if (this.x <= -this.width) {
        this.x = 0; //this.x = this.width + this.x - this.speed;
      }
      // if (this.x2 <= -this.width) {
      //   this.x2 = this.width + this.x2 - this.speed;
      // }
      this.x = this.x - this.speed; //Math.floor(this.x - this.speed);
      // this.x2 = Math.floor(this.x2 - this.speed);
      // this.x = (gameFrame * this.speed) % this.width;
    }
    draw() {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      ctx.drawImage(
        this.image,
        this.x + this.width,
        this.y,
        this.width,
        this.height
      );
    }
    restart() {
      this.x = 0;
    }
  }
  const layer1 = new Layer(backgroundLayer1, 0.1);
  const layer2 = new Layer(backgroundLayer2, 0.2);
  const layer3 = new Layer(backgroundLayer3, 0.4);
  const layer4 = new Layer(backgroundLayer4, 0.25);
  const layer5 = new Layer(backgroundLayer5, 0.5);
  const layer6 = new Layer(backgroundLayer6, 0.25);
  const layer7 = new Layer(backgroundLayer7, 0.5);

  const gameObject = [layer1, layer2, layer3, layer4, layer5, layer6, layer7];

  /// new code ///

  class InputHandler {
    constructor() {
      this.keys = [];
      this.touchY = "";
      // this.touchX = "";
      this.touchThreshold = 30; // determines the length of swipe to perform action
      window.addEventListener("keydown", (e) => {
        // console.log(e.key);
        if (
          (e.key === "ArrowDown" ||
            e.key === "ArrowUp" ||
            e.key === "ArrowLeft" ||
            e.key === "ArrowRight") &&
          this.keys.indexOf(e.key) === -1
        ) {
          this.keys.push(e.key);
        } else if (e.key === "Enter" && gameOver) restartGame();
        // console.log(e.key, this.keys);
      });

      window.addEventListener("keyup", (e) => {
        // console.log(e.key);
        if (
          e.key === "ArrowDown" ||
          e.key === "ArrowUp" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight"
        ) {
          this.keys.splice(this.keys.indexOf(e.key), 1);
        }
        // console.log(e.key, this.keys);
      });
      window.addEventListener("touchstart", (e) => {
        this.touchY = e.changedTouches[0].pageY;
        // this.touchX = e.changedTouches[0].pageX;
      });
      window.addEventListener("touchmove", (e) => {
        const swipeDistance = e.changedTouches[0].pageY - this.touchY;
        const swipeSide = e.changedTouches[0].pageX - this.touchX;
        if (
          swipeDistance < -this.touchThreshold &&
          this.keys.indexOf("swipe up") === -1
        )
          this.keys.push("swipe up");
        // else if (
        //   swipeSide < -this.touchThreshold &&
        //   this.keys.indexOf("swipe side") === -1
        // )
        //   this.keys.push("swipe side");
        else if (
          swipeDistance > this.touchThreshold &&
          this.keys.indexOf("swipe down") === -1
        ) {
          this.keys.push("swipe down");
          if (gameOver) restartGame();
        }
      });
      window.addEventListener("touchend", (e) => {
        // console.log(this.keys);
        this.keys.splice(this.keys.indexOf("swipe up"), 1);
        this.keys.splice(this.keys.indexOf("swipe down"), 1);
      });
    }
  }

  class Player {
    constructor(gameWidth, gameHeight) {
      this.gameHeight = gameHeight - 20;
      this.gameWidth = gameWidth;
      this.width = 200;
      this.height = 200;
      this.x = 100;
      this.y = this.gameHeight - this.height;
      this.image = document.getElementById("playerImage");
      this.frameX = 0;
      this.maxFrame = 8; //8
      this.frameY = 0;
      this.fps = 30; // player sprite fps
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps; // 1000 original
      this.speed = 0;
      this.vy = 0;
      this.weight = 1;
    }
    restart() {
      this.x = 100;
      this.y = this.gameHeight - this.height;
      this.maxFrame = 8; //8
      this.frameY = 0;
    }
    draw(context) {
      //hit box corrected

      // context.lineWidth = 5;
      // context.strokeStyle = "white";
      // context.beginPath();
      // context.arc(
      //   this.x + this.width / 2,
      //   this.y + this.height / 2 + 20,
      //   this.width / 4,
      //   0,
      //   Math.PI * 2
      // );
      // context.stroke();

      /*  hit box start

      context.stroke();
      context.strokeStyle = "red";
      context.beginPath();
      context.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
      context.stroke();

      // hit box end */

      context.drawImage(
        this.image,
        this.frameX * this.width, // changes sprite
        this.frameY * this.height, // changes row by changing value
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    update(input, deltaTime, enemies) {
      // Collision detect
      enemies.forEach((enemy) => {
        const dx = enemy.x + enemy.width / 2 - 20 - (this.x + this.width / 2);
        const dy =
          enemy.y + enemy.height / 2 - 550 - (this.y + this.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < enemy.width / 2 + this.width / 3) {
          gameOver = true;
        }
      });
      // Sprite animation
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frameX++;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }

      // Controls

      if (input.keys.indexOf("ArrowRight") > -1) {
        this.speed = 7;
      } else if (input.keys.indexOf("ArrowLeft") > -1) {
        this.speed = -6;
      } else if (
        (input.keys.indexOf("ArrowUp") > -1 ||
          input.keys.indexOf("swipe up") > -1) &&
        this.onGround()
      ) {
        this.vy -= 32;
      } else {
        this.speed = 0;
      }
      // Horizontal Movement
      this.x += this.speed;
      if (this.x < 0) this.x = 0;
      else if (this.x > this.gameWidth - this.width)
        this.x = this.gameWidth - this.width;
      // Vertical Movement
      this.y += this.vy;
      if (!this.onGround()) {
        this.vy += this.weight;
        this.maxFrame = 5; //5
        this.frameY = 1;
      } else {
        this.vy = 0;
        this.maxFrame = 8;
        this.frameY = 0;
      }
      if (this.y > this.gameHeight - this.height)
        this.y = this.gameHeight - this.height;
    }
    onGround() {
      return this.y >= this.gameHeight - this.height;
    }
  }

  // background original code //
  // class Background {
  //   constructor(gameWidth, gameHeight) {
  //     this.gameWidth = gameWidth;
  //     this.gameHeight = gameHeight;
  //     this.image = document.getElementById("backgroundImage");
  //     this.x = 0;
  //     this.y = 0;
  //     this.width = 1920; //2400
  //     this.height = 1080; //720
  //     this.speed = 5;
  //   }
  //   draw(context) {
  //     context.drawImage(this.image, this.x, this.y, this.width, this.height);
  //     context.drawImage(
  //       this.image,
  //       this.x + this.width - this.speed, // helps eliminate gaps in images and any break when images reset
  //       this.y,
  //       this.width,
  //       this.height
  //     );
  //   }
  //   update() {
  //     this.x -= this.speed;
  //     if (this.x < 0 - this.width) this.x = 0;
  //   }
  //   restart() {
  //     this.x = 0;
  //   }
  // }

  ////////////////////////////////////////////////////
  class Enemy {
    constructor(gameHeight, gameWidth) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 160;
      this.height = 1355; // changes enemy height position on canvas
      this.image = document.getElementById("enemyImage");
      this.x = this.gameWidth + 1100; // default this.gameWidth - 100
      this.y = this.gameHeight - this.height;
      this.frameX = 0;
      this.maxFrame = 5;
      this.fps = 10; // enemy sprite fps
      this.frameTimer = 0;
      this.frameInterval = 800 / this.fps;
      this.speed = 6;
      this.markedForDeletion = false;
    }
    draw(context) {
      /* hit box start
     
      context.stroke();
      context.strokeStyle = "red";
      context.beginPath();
      context.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
      context.stroke();

      hit box end */

      context.drawImage(
        this.image,
        this.frameX * this.width,
        0,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );

      //hit box corrected

      // context.lineWidth = 5;
      // context.strokeStyle = "white";
      // context.beginPath();
      // context.arc(
      //   this.x + this.width / 2 - 20,
      //   this.y + this.height / 2 - 350,
      //   this.width / 3,
      //   0,
      //   Math.PI * 2
      // );
      // context.stroke();
    }
    update(deltaTime) {
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frameX++;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
      this.x -= this.speed;
      if (this.x < 0 - this.width) this.markedForDeletion = true;
      score++;
    }
  }

  function handleEnemies(deltaTime) {
    if (enemyTimer > enemyInterval + randomEnemyInterval) {
      enemies.push(new Enemy(canvas.width, canvas.height));
      // console.log(enemies)
      randomEnemyInterval = Math.random() * 1000 + 1000;
      enemyTimer = 0;
    } else {
      enemyTimer += deltaTime;
    }
    enemies.forEach((enemy) => {
      enemy.draw(ctx);
      enemy.update(deltaTime);
    });
    enemies = enemies.filter((enemy) => !enemy.markedForDeletion);
  }

  function displayStatusText(context) {
    context.textAlign = "left";
    context.font = "35px Helvetica";
    context.fillStyle = "white";
    context.fillText("Score:" + score, 20, 50);
    context.fillStyle = "black";
    context.fillText("Score:" + score, 18, 48);
    if (gameOver) {
      context.font = "40px Helvetica";
      context.textAlign = "center";
      context.fillStyle = "black";
      context.fillText(
        "Game Over! Press Enter or Swipe Down to restart",
        canvas.width / 2,
        canvas.height / 2
      );

      context.fillStyle = "goldenrod";
      context.fillText(
        "Game Over! Press Enter or Swipe Down to restart",
        canvas.width / 2 + 3,
        canvas.height / 2 + 3
      );
    }
  }

  function restartGame() {
    player.restart();
    layer.restart();
    enemies = [];
    score = 0;
    gameOver = false;
    animate(0);
  }

  function toggleFullScreen() {
    console.log(document.fullscreenElement);
    if (!document.fullscreenElement) {
      canvas.requestFullscreen().catch((err) => {
        alert(`Error, cant enable fullscreen mode: ${err.message}`);
      });
    }
  }
  fullScreenButton.addEventListener("click", toggleFullScreen);

  const input = new InputHandler();
  const player = new Player(canvas.width, canvas.height);
  // const background = new Background(canvas.width, canvas.height);
  const layer = new Layer(canvas.width, canvas.height);

  let lastTime = 0;
  let enemyTimer = 0;
  let enemyInterval = 1000;
  let randomEnemyInterval = Math.random() * 1000 + 500;

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameObject.forEach((object) => {
      object.update();
      object.draw();
    });
    // background.draw(ctx);
    // background.update();
    player.draw(ctx);
    player.update(input, deltaTime, enemies);
    handleEnemies(deltaTime);
    displayStatusText(ctx);
    if (!gameOver) requestAnimationFrame(animate);
  }
  animate(0);
});

// import { Player } from "./player.js";

// window.addEventListener("load", function () {
//   const canvas = this.document.getElementById("canvas1");
//   const ctx = canvas.getContext("2d");
//   canvas.width = 500;
//   canvas.height = 500;

//   class Game {
//     constructor(width, height) {
//       this.width = width;
//       this.height = height;
//       this.player = new Player(this);
//     }
//     update() {}

//     draw(context) {
//       this.player.draw(context);
//     }
//   }

//   const game = new Game(canvas.width, canvas.height);
//   console.log(game);
//   function animate() {
//     game.draw(ctx);
//     requestAnimationFrame(animate);
//   }
//   animate();
// });
