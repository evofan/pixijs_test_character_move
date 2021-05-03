import * as PIXI from "pixi.js";
// webpack error on PixiJS v5. import { loader } from "webpack";
import { WebpackPluginInstance as loader } from "webpack";
// window.PIXI = PIXI;
import { STAGES, ASSETS, GAMES } from "./constants";
import { setText } from "./helper/setText";
import { randomInt } from "./helper/randomInt";
import { keyboard } from "./helper/keyboard";
import { contain } from "./helper/contain";
import { hitTestRectangle } from "./helper/hitTestRectangle";
import Stats from "stats.js";
import { Howl, Howler } from "howler"; // npm install --save @types/howler
import { gsap } from "gsap"; // npm install -D @types/gsap

import { PixiPlugin } from "gsap/PixiPlugin";
import { AnimatedSprite, DisplayObject, Sprite } from "pixi.js";

// register the plugin
gsap.registerPlugin(PixiPlugin);
// give the plugin a reference to the PIXI object
PixiPlugin.registerPIXI(PIXI);

console.log(PIXI);

// stats
let stats: Stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

// constant
const WIDTH: number = STAGES.WIDTH;
const HEIGHT: number = STAGES.HEIGHT;
const BG_COLOR: number = STAGES.BG_COLOR;

const BOUNDARY_RANGE_X: number = 28;
const BOUNDARY_RANGE_Y: number = 10;
const BOUNDARY_RANGE_WIDTH: number = 488;
const BOUNDARY_RANGE_HEIGHT: number = 488;

const FIRST = 1;
const NOT_FIRST = 2;

// renderer
const renderer: PIXI.Renderer = new PIXI.Renderer({
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: BG_COLOR,
});
document.body.appendChild(renderer.view);

// stage
const stage: PIXI.Container = new PIXI.Container();

// Custom GameLoop(v5), call requestAnimationFrame directly.
let oldTime: number = Date.now();
let ms: number = 1000;
let fps: number = GAMES.FPS;
let animate: FrameRequestCallback = (): void => {
  // console.log("animate()");
  let newTime: number = Date.now();
  let deltaTime: number = newTime - oldTime;
  oldTime = newTime;
  deltaTime < 0 ? (deltaTime = 0) : deltaTime;
  deltaTime > ms ? (deltaTime = ms) : deltaTime;
  renderer.render(stage);
  stats.begin();
  requestAnimationFrame(animate);

  // GameLoop
  if (gameLoopFlag) {
    gameLoop(deltaTime);
  }

  stats.end();
};

// loader
let loader: PIXI.Loader = new PIXI.Loader();

// asset
const ASSET_BG: string = ASSETS.ASSET_BG;
// const ASSET_OBJ1: string = ASSETS.ASSET_OBJ1;
const ASSET_OBJ2: string = ASSETS.ASSET_OBJ2;
const ASSET_OBJ3: string = ASSETS.ASSET_OBJ3;
const ASSET_OBJ4: string = ASSETS.ASSET_OBJ4;
const ASSET_OBJ5: string = ASSETS.ASSET_OBJ5;
const ASSET_OBJ6: string = ASSETS.ASSET_OBJ6;
const ASSET_OBJ7: string = ASSETS.ASSET_OBJ7;
const ASSET_OBJ8: string = ASSETS.ASSET_OBJ8;

const ASSET_OBJ9: string = ASSETS.ASSET_OBJ9;
const ASSET_OBJ10: string = ASSETS.ASSET_OBJ10;

const ASSET_OBJ11: string = ASSETS.ASSET_OBJ11;
const ASSET_OBJ12: string = ASSETS.ASSET_OBJ12;
const ASSET_OBJ13: string = ASSETS.ASSET_OBJ13;

const ASSET_OBJ14: string = ASSETS.ASSET_OBJ14;

// container
let container: PIXI.Container = new PIXI.Container();
container.width = WIDTH;
container.height = HEIGHT;
container.x = 0;
container.y = 0;
container.pivot.x = 0.5;
container.pivot.y = 0.5;
container.interactive = false;
container.interactiveChildren = true;
container.buttonMode = false;
stage.addChild(container);

// init
let bg: PIXI.Sprite;

let gameState: string = "init";
let gameLoopFlag: boolean = false;

let gameScene: PIXI.Container = new PIXI.Container();
let gameOverScene: PIXI.Container = new PIXI.Container();
let gameClearScene: PIXI.Container = new PIXI.Container();
let message_gameover: PIXI.Text;
let message_gameclear: PIXI.Text;

// game sprite
let dungeon: PIXI.Sprite;
let door: PIXI.Sprite;
let explorer: PIXI.Sprite;
let treasure: PIXI.Sprite;

// explorer
let explorer_vx: number = 0,
  explorer_vy: number = 0,
  explorer_speed: number = 3;

// blobs
let numberOfBlobs: number = 6,
  blobs: PIXI.Sprite[] = [],
  blob_spacing: number = 48,
  blob_xOffset: number = 100,
  blob_speed: number = 2,
  blob_direction: number = 1,
  blob_vy: number[] = [];

// dragon
let dragon: AnimatedSprite;
let dragonfire: AnimatedSprite;
let dragonfireFlag: boolean = true;

// hp bar
let healthBar: PIXI.Container = new PIXI.Container();
let innerBar: PIXI.Graphics = new PIXI.Graphics();
let outerBar: PIXI.Graphics = new PIXI.Graphics();
let maxHP: number = 120;

// arrow for cursor-key use
let arrow_white_left: PIXI.Sprite,
  arrow_white_up: PIXI.Sprite,
  arrow_white_right: PIXI.Sprite,
  arrow_white_down: PIXI.Sprite,
  arrow_red_left: PIXI.Sprite,
  arrow_red_up: PIXI.Sprite,
  arrow_red_right: PIXI.Sprite,
  arrow_red_down: PIXI.Sprite;

// bgm button
let bt_bgm_on: PIXI.Sprite;
let bt_bgm_off: PIXI.Sprite;
let bgmFlag: boolean = false;
let sound_bgm: Howl;

// se
let se1: Howl;
let se2: Howl;
let se2Flag: boolean = true;

// text
let text_pixiVersion: PIXI.Text,
  text_gameTitle: PIXI.Text,
  text_hp: PIXI.Text,
  text_fps: PIXI.Text,
  text_bgm: PIXI.Text;
let text_hp_num: PIXI.Text;

if (ASSET_BG === "") {
  console.log("Don't use background image.");
} else {
  loader.add("bg_data", ASSET_BG);
}
// loader.add("obj_1_data", ASSET_OBJ1);
// loader.add("obj_2_data", ASSET_OBJ2); //   loader.add("images/atras.json").load(setup);
loader.add("obj_3_data", ASSET_OBJ3);

loader.add("obj_4_data", ASSET_OBJ4);
loader.add("obj_5_data", ASSET_OBJ5);

loader.add("obj_6_data", ASSET_OBJ6);
loader.add("obj_7_data", ASSET_OBJ7);
loader.add("obj_8_data", ASSET_OBJ8);

loader.add("obj_9_data", ASSET_OBJ9);
loader.add("obj_10_data", ASSET_OBJ10);

loader.add("obj_11_data", ASSET_OBJ11);
loader.add("obj_12_data", ASSET_OBJ12);
loader.add("obj_13_data", ASSET_OBJ13);
loader.add("obj_14_data", ASSET_OBJ14);

loader.load((loader: PIXI.Loader, resources: any) => {
  console.log(loader);
  console.log(resources);

  // bg
  if (ASSET_BG !== "") {
    bg = new PIXI.Sprite(resources.bg_data.texture);
    container.addChild(bg);
  }

  gameSetup(resources);
});

// err
loader.onError.add(() => {
  throw Error("load error ...");
});

// I told you you now have all the skills you need to start making games.
// what? Don't you believe me? Let's prove it!
// Let's take a closer look at how to create a simple object collection called Treasure Hunter and an enemy avoidance game.
// (located in the examples folder)

// Treasure Hunter is a good example of one of the simplest completed games you can create using the tools you've learned so far.
// Use the arrow keys on your keyboard to help the explorer find the treasure and bring it to the exit.
// Six blob monsters move up and down between the walls of the dungeon, becoming translucent when hitting an explorer, and shrinking the scale in the upper right corner.
// When all health conditions are exhausted, the stage will display "You Lost!".
// When the explorer reaches the exit with the treasure, "You Won!" Is displayed.

// This is a basic prototype, but the treasure hunter contains most of the elements you can find in larger games.
// Texture atlas graphics, interactive features, collisions, multiple game scenes and more.
// Let's see how the game was organized so that it could be used as a starting point for your game.

// function

/**
 * Runs the current game state in a loop and renders the sprite.
 * @param delta
 */
const gameLoop = (delta: number): void => {
  // console.log("gameLoop()", delta);

  // Use the explorer's velocity to make it move
  explorer.x += explorer_vx;
  explorer.y += explorer_vy;

  // Contain the explorer inside the area of the dungeon
  contain(explorer, {
    x: BOUNDARY_RANGE_X,
    y: BOUNDARY_RANGE_Y,
    width: BOUNDARY_RANGE_WIDTH,
    height: BOUNDARY_RANGE_HEIGHT,
  });

  // Set `explorerHit` to `false` before checking for a collision
  let explorerHit: boolean = false;
  let explorerHitDragon: boolean = false;
  let explorerHitFire: boolean = false;

  // easy test
  let num: number = randomInt(1, 1000000000);
  if (num > 995000000) {
    console.log("995000000 over");
    if (dragonfireFlag) {
      dragonfireFlag = false;
      dragonfire.visible = true;
      dragonfire.animationSpeed = 0.01;
      dragonfire.play();
    }
  }

  // Move the blob monsters and keep them trapped inside the dungeon wall,
  // Then check for conflicts with each player.
  // If the blob hits the top or bottom wall of the dungeon, the direction will be reversed.
  // All this is done using a forEach() loop that repeats each of the blob sprites in the blob array every frame.
  //blobs.forEach((blob, idx) => {
  blobs.map((blob, idx) => {
    // Move the blob.
    blob.y += blob_vy[idx];

    // Check the on-screen boundaries of blobs.
    let blobHitsWall: string | undefined = contain(blob, {
      x: BOUNDARY_RANGE_X,
      y: BOUNDARY_RANGE_Y,
      width: BOUNDARY_RANGE_WIDTH,
      height: BOUNDARY_RANGE_HEIGHT,
    });
    // This code shows how to use the return value of the contain () function to reflect the blob from the wall.
    // A variable called blobHitsWall is used to get the return value.

    // If the blob hits above or below the stage, reverse the direction.
    if (blobHitsWall === "top" || blobHitsWall === "bottom") {
      blob_vy[idx] *= -1;
    }
    // blobHitsWall is usually undefined.
    // However, if the blob hits the upper wall, the value of blobHitsWall will be "top".
    // If the blob hits the bottom wall, the blobHitsWall will have a value of "bottom".
    // If any of these cases apply, you can reverse the blob direction by reversing the speed.

    // Multiply the blob's vy (vertical velocity) value by -1 to invert its direction of movement.

    // Test for collisions. If any enemy is touching the explorer, set `explorer Hit` to` true`.
    if (hitTestRectangle(explorer, blob)) {
      explorerHit = true;
    }

    // explorer hit for dragon
    if (hitTestRectangle(explorer, dragon)) {
      explorerHitDragon = true;
    }

    // explorer hit for dragonfire
    if (hitTestRectangle(explorer, dragonfire)) {
      explorerHitFire = true;
    }
  });

  // If hitTestRectangle () returns true, it means there was a collision and the variable explorerHit is set to true.
  // If explorerHit is true, make the explorer translucent and reduce the width of the health bar by 1 pixel.
  if (explorerHit) {
    // Make the explorer translucent
    explorer.alpha = 0.5;

    // se
    se1.stop();
    se1.play();

    // hp bar minus
    outerBar.width -= 1;
    if (outerBar.width < 0) {
      outerBar.width = 0;
    }
  } else {
    // If not hit, make the explorer completely opaque(non-transparent)
    explorer.alpha = 1;
  }

  if (explorerHitDragon) {
    explorer.alpha = 0.5;
    // se
    se1.stop();
    se1.play();
    // hp bar minus
    outerBar.width -= 50;
    if (outerBar.width < 0) {
      outerBar.width = 0;
    } else {
      // If not hit, make the explorer completely opaque(non-transparent)
      explorer.alpha = 1;
    }
  }
  if (explorerHitFire && dragonfireFlag === false) {
    explorer.alpha = 0.5;
    // hp bar minus
    outerBar.width -= 150;
    if (outerBar.width < 0) {
      outerBar.width = 0;
    } else {
      // If not hit, make the explorer completely opaque(non-transparent)
      explorer.alpha = 1;
    }
  }

  // hp num
  setHpNum(NOT_FIRST);

  // Check for clashes between the treasure chest and the explorer.
  // If hit, the treasure will be set to the explorer explorer position with a slight offset.
  // This makes it look like an explorer is carrying a treasure.

  // Check for a collision between the explorer and the treasure
  if (hitTestRectangle(explorer, treasure)) {
    // If the treasure is touching the explorer, center it over the explorer
    if (se2Flag) {
      se2Flag = false;
      se2.play();
    }
    treasure.x = explorer.x + 8;
    treasure.y = explorer.y + 8;
  }

  // Does the explorer have enough health? If the width of the `innerBar`
  // is less than zero, end the game and display "You lost!"
  if (outerBar.width <= 0) {
    gameState = "gameover";
    gameOver();
    // message.text = "You lost!";
  }

  // If the explorer has brought the treasure to the exit,
  // end the game and display "You won!"
  if (hitTestRectangle(treasure, door)) {
    gameState = "gameclear";
    // message.text = "You won!";
    gameClear();
  }
};

/**
 * I have all the code that should be executed at the clear of the game.
 */
const gameClear = (): void => {
  console.log("gameClear()");
  gameLoopFlag = false;
  sound_bgm.stop();
  dragon.stop();
  dragonfire.stop();
  // gameScene.visible = false;
  gameOverScene.visible = false;
  gameClearScene.visible = true;

  gsap.to(message_gameclear, {
    duration: 0.5,
    alpha: 1.0,
    ease: "power4.easeout",
    pixi: { scaleX: 1, scaleY: 1 },
    // onComplete:
  });
};

/**
 * I have all the code that should be executed at the end of the game(game over).
 */
const gameOver = (): void => {
  console.log("gameOver()");
  gameLoopFlag = false;
  sound_bgm.stop();
  dragon.stop();
  dragonfire.stop();
  // gameScene.visible = false;
  gameOverScene.visible = true;
  gameClearScene.visible = false;
};

/**
 * The setup() function is executed as soon as the texture atlas image is loaded.
 * It runs only once and allows you to run the setup task only once for your game.
 * Great place to create and initialize objects, sprites, game scenes, generate data arrays, and analyze loaded JSON game data.
 * @param resources
 */
const gameSetup = (resources: any): void => {
  console.log("gameSetup()");
  // Initialize the game sprite, set the game's `state` to` play` and launch'gameLoop'.

  // 1. GAME SCENE

  // Create the `gameScene` group
  container.addChild(gameScene);
  gameScene.x = 0;
  gameScene.y = 0;
  gameScene.interactiveChildren = true;

  // Create a `gameOverScene` group
  container.addChild(gameOverScene);
  gameOverScene.visible = false;
  gameOverScene.interactiveChildren = true;

  container.addChild(gameClearScene);
  gameClearScene.visible = false;

  // All sprites that are part of the main game will be added to the gameScene group.
  // The game over text that should be displayed at the end of the game will be added to the gameOverScene group.

  // This is created inside the setup() function, but you need to prevent the gameOverScene from appearing the first time the game is launched.
  // Therefore, its visible property is initialized to false.

  // When the game is over, the visible property of gameOverScene is set to true,
  // You will see the text that will be displayed at the end of the game.
  // (* Concept of scene switching)

  // 2. CREATE SPRITE

  // Player (explorer), exit door, treasure chest, dungeon background images are all sprites made from textured atlas frames.
  // Very importantly, they are all added as children of gameScene.

  // set sprite sheet(texture atras frame)
  let id: any = resources.obj_3_data.textures;

  // Create the `dungeon` sprite
  dungeon = new PIXI.Sprite(id["dungeon.png"]);
  dungeon.x = 0;
  dungeon.y = 0;
  gameScene.addChild(dungeon);

  // Create the `door` sprite
  door = new PIXI.Sprite(id["door.png"]);
  door.position.set(32, 0);
  gameScene.addChild(door);

  // Create the `player(explorer)` sprite
  explorer = new PIXI.Sprite(id["explorer.png"]);
  explorer.x = 38; //68;
  explorer.y = gameScene.height / 2 - explorer.height / 2;
  explorer_vx = 0;
  explorer_vy = 0;
  gameScene.addChild(explorer);

  // Create the `treasure` sprite
  treasure = new PIXI.Sprite(id["treasure.png"]);
  treasure.x = gameScene.width - treasure.width - 38;
  treasure.y = gameScene.height / 2 - treasure.height / 2;
  gameScene.addChild(treasure);

  // Putting them together (dungeon, door, player, treasure chest) in a gameScene group makes
  // it easier to hide the gameScene and show the gameOverScene when the game is over.

  // Create Animated sprite
  let dragonImages: string[] = [
    "assets/images/pic_dragon_1.png",
    "assets/images/pic_dragon_2.png",
    "assets/images/pic_dragon_3.png",
  ];

  let textureArray: PIXI.Texture[] = [];

  for (let i: number = 0; i < 3; i++) {
    let texture: PIXI.Texture = PIXI.Texture.from(dragonImages[i]);
    textureArray.push(texture);
  }

  dragon = new PIXI.AnimatedSprite(textureArray);
  dragon.x = 410;
  dragon.y = 100;
  dragon.anchor.set(0.5);
  dragon.animationSpeed = 0.1;
  dragon.loop = true;
  // anim.tint = 0x000000;
  dragon.visible = true;
  dragon.play();
  dragon.onComplete = () => {
    console.log("anim.totalFrames: ", dragon.totalFrames);
    console.log("animation end");
    dragon.interactive = true;
  };
  dragon.interactive = true;
  dragon.on("click", (event: MouseEvent) => {
    console.log("dragon click!");
    dragon.interactive = false;
    // anim.animationSpeed = 0;
    dragon.loop = false;
  });
  dragon.on("tap", (event: MouseEvent) => {
    console.log("dragon tap!");
    dragon.interactive = false;
    // anim.animationSpeed = 0;
    dragon.loop = false;
  });
  gameScene.addChild(dragon);

  // dragon fire
  /*
  dragonfire = new PIXI.Sprite(resources.obj_14_data.texture);
  dragonfire.scale.x = dragonfire.scale.y = 0.5;
  dragonfire.x = 391;
  dragonfire.y = 100;
  gameScene.addChild(dragonfire);
  */

  // dragon fire anim
  let dragonfireImages: string[] = [
    "assets/images/pic_dragon_fire_1.png",
    "assets/images/pic_dragon_fire_2.png",
    "assets/images/pic_dragon_fire_3.png",
    "assets/images/pic_dragon_fire_4.png",
  ];

  let textureArray_dragonfire: PIXI.Texture[] = [];

  for (let i: number = 0; i < 4; i++) {
    let texture_dragonfire: PIXI.Texture = PIXI.Texture.from(
      dragonfireImages[i]
    );
    textureArray_dragonfire.push(texture_dragonfire);
  }
  dragonfire = new PIXI.AnimatedSprite(textureArray_dragonfire);
  dragonfire.scale.x = dragonfire.scale.y = 0.5;
  dragonfire.x = 391;
  dragonfire.y = 100;
  // dragonfire.anchor.set(0.5);
  dragonfire.animationSpeed = 1;
  dragonfire.play();
  dragonfire.loop = false;
  // anim.tint = 0x000000;
  dragonfire.visible = false;
  // dragonfire.stop();
  dragonfire.onComplete = () => {
    console.log("dragonfire.totalFrames: ", dragonfire.totalFrames);
    console.log("dragonfire animation end");
    console.log("dragonfire animation speed", dragonfire.animationSpeed);
    dragonfire.stop();
    dragonfire.visible = false;
    dragonfireFlag = true;
  };
  gameScene.addChild(dragonfire);

  // 3. CREATE MONSTER

  // Six blob (small chunks) monsters are created in one loop.
  // Each blob is given a random initial position and velocity.
  // Vertical velocity is alternately multiplied by 1 or -1 for each blob.
  // Therefore, each blob moves in the opposite direction to the next.
  // Each blob monster created is pushed (stored in) in an array called blobs.

  // Create as many blobs as `numberOfBlobs`.
  for (let i: number = 0; i < numberOfBlobs; i++) {
    // Create a blob.
    let blob: PIXI.Sprite = new PIXI.Sprite(id["blob.png"]);

    // Space each blob horizontally according to the value of `spacing`.
    let x: number = blob_spacing * i + blob_xOffset; // `xOffset` determines the position from the left of the screen where the first blob should be added.

    // Give the blob a random "y" position.
    let y: number = randomInt(0, stage.height - blob.height);

    // Set the blob position.
    blob.x = x;
    blob.y = y;

    // Set the vertical velocity of the blob.
    // direction can be either 1 or -1.
    // "1" means the enemy moves down, "-1" means the blob moves up.
    // Multiply `direction` by` speed` to determine the vertical direction of the blob.

    // org
    // blob_vy[i] = blob_speed * blob_direction;
    // random speed
    blob_speed = randomInt(1, 3);
    blob_vy[i] = blob_speed * blob_direction;

    // Reverse the direction of the next blob.
    blob_direction *= -1;

    // Push (add) blobs to the `blobs` array
    blobs.push(blob);

    // Add blobs to `gameScene`.
    gameScene.addChild(blob);
  }

  // 4. HEALTH BAR

  // Playing Treasure Hunter narrows the health Bar in the upper right corner of the screen when an explorer touches one of the enemies.
  // How was this fitness bar made? It's two overlapping rectangles in exactly the same position.
  // The black rectangle at the back and the red rectangle at the front. They are grouped together in one health bar group.
  // After that, the health bar will be added to the gameScene and placed on the stage.

  // Creating a health bar
  healthBar.position.set(WIDTH - 140, 12);
  gameScene.addChild(healthBar);

  // Create a rectangle with a black background.
  innerBar.beginFill(0x000000);
  innerBar.drawRect(0, 0, maxHP + 1, 10);
  innerBar.endFill();
  healthBar.addChild(innerBar);

  // Create a red rectangle on the front.
  outerBar.beginFill(0x990000);
  outerBar.drawRect(0, 0, maxHP, 8);
  outerBar.endFill();
  healthBar.addChild(outerBar);

  // 5. MESSAGE TEXT

  // When the game is over, you will see the text "You won" or "You lost" depending on the result of the game.
  // This is done by using a text sprite and adding it to the gameOverScene.
  // This text will not be displayed because the visible property of gameOverScene is set to false at the start of the game.
  let style: PIXI.TextStyle = new PIXI.TextStyle({
    fontFamily: "Futura",
    fontSize: 64,
    fill: "white",
  });
  message_gameover = new PIXI.Text("Game Over!", style);
  message_gameover.x = WIDTH / 2 - message_gameover.width / 2;
  message_gameover.y = HEIGHT / 2 - message_gameover.height;
  gameOverScene.addChild(message_gameover);

  message_gameclear = new PIXI.Text("Game Clear!", style);
  message_gameclear.x = WIDTH / 2; //WIDTH / 2 - message_gameclear.width;
  message_gameclear.y = HEIGHT / 2; // - message_gameclear.height;
  message_gameclear.anchor.set(0.5, 0.5);
  message_gameclear.scale.x = 0.5;
  message_gameclear.scale.y = 0.5;
  message_gameclear.alpha = 0;
  gameClearScene.addChild(message_gameclear);

  console.log(resources.obj_6_data.url);

  // 6. SOUND

  // bgm
  sound_bgm = new Howl({
    src: [resources.obj_6_data.url],
    autoplay: false, // The AudioContext was not allowed to start. It must be resumed (or created) after a user gesture on the page. https://goo.gl/7K7WLu
    loop: true,
    volume: 0.1,
    onend: () => {
      console.log("bgm finished.");
    },
  });
  // sound_bgm.play();
  // Howler.volume(0.5);

  // SE
  se1 = new Howl({
    src: [resources.obj_7_data.url],
    autoplay: false,
    loop: false,
    volume: 0.2,
    onend: () => {
      console.log("SE1 finished.");
    },
  });

  se2 = new Howl({
    src: [resources.obj_8_data.url],
    autoplay: false,
    loop: false,
    volume: 0.2,
    onend: () => {
      console.log("SE2 finished.");
    },
  });

  // 7. UI

  // text
  let offset: number = 10;

  // text pixi version
  let version: string = `PixiJS: ver.${PIXI.VERSION}`;
  text_pixiVersion = setText(version, "Arial", 16, 0xf0fff0, "left", "normal");
  container.addChild(text_pixiVersion);
  text_pixiVersion.x = WIDTH - text_pixiVersion.width - offset;
  text_pixiVersion.y = HEIGHT - text_pixiVersion.height - 5;

  // text game title
  text_gameTitle = setText(
    "Treasure Hunter",
    "Arial",
    24,
    0xffd700,
    "center",
    "bold",
    "#000000",
    4,
    false,
    "#666666",
    "round"
  );
  container.addChild(text_gameTitle);
  text_gameTitle.x = WIDTH / 2 - text_gameTitle.width / 2;
  text_gameTitle.y = HEIGHT - text_gameTitle.height;

  // text HP:
  text_hp = setText(
    "HP:",
    "Arial",
    16,
    0xff0033,
    "center",
    "bold",
    "#000000",
    5,
    false,
    "#666666",
    "round"
  );
  container.addChild(text_hp);
  text_hp.x = 305;
  text_hp.y = 5;

  // text hp-num
  setHpNum(FIRST);

  // text FPS
  text_fps = setText(`FPS: ${fps}`, "Impact", 16, 0xf0fff0, "left", "normal");
  container.addChild(text_fps);
  text_fps.x = offset;
  text_fps.y = HEIGHT - text_fps.height - 5;

  // text BGM:
  text_bgm = setText(
    "BGM:",
    "Arial",
    16,
    0xff9900,
    "center",
    "bold",
    "#000000",
    5,
    false,
    "#666666",
    "round"
  );
  container.addChild(text_bgm);
  text_bgm.x = 205;
  text_bgm.y = 5;

  // navigation arrow
  // left
  arrow_white_left = new PIXI.Sprite(resources.obj_4_data.texture);
  arrow_white_left.scale.x = arrow_white_left.scale.y = 0.5;
  arrow_white_left.angle = 180;
  arrow_white_left.x = 408;
  arrow_white_left.y = 440;
  container.addChild(arrow_white_left);
  arrow_red_left = new PIXI.Sprite(resources.obj_5_data.texture);
  arrow_red_left.scale.x = arrow_red_left.scale.y = 0.5;
  arrow_red_left.angle = 180;
  arrow_red_left.x = 408;
  arrow_red_left.y = 440;
  arrow_red_left.visible = false;
  container.addChild(arrow_red_left);
  // up
  arrow_white_up = new PIXI.Sprite(resources.obj_4_data.texture);
  arrow_white_up.scale.x = arrow_white_up.scale.y = 0.5;
  arrow_white_up.angle = -90;
  arrow_white_up.x = 410;
  arrow_white_up.y = 400;
  container.addChild(arrow_white_up);
  arrow_red_up = new PIXI.Sprite(resources.obj_5_data.texture);
  arrow_red_up.scale.x = arrow_red_up.scale.y = 0.5;
  arrow_red_up.angle = -90;
  arrow_red_up.x = 410;
  arrow_red_up.y = 400;
  arrow_red_up.visible = false;
  container.addChild(arrow_red_up);
  // right
  arrow_white_right = new PIXI.Sprite(resources.obj_4_data.texture);
  arrow_white_right.scale.x = arrow_white_right.scale.y = 0.5;
  arrow_white_right.x = 450;
  arrow_white_right.y = 400;
  container.addChild(arrow_white_right);
  arrow_red_right = new PIXI.Sprite(resources.obj_5_data.texture);
  arrow_red_right.scale.x = arrow_red_right.scale.y = 0.5;
  arrow_red_right.x = 450;
  arrow_red_right.y = 400;
  arrow_red_right.visible = false;
  container.addChild(arrow_red_right);
  // down
  arrow_white_down = new PIXI.Sprite(resources.obj_4_data.texture);
  arrow_white_down.scale.x = arrow_white_down.scale.y = 0.5;
  arrow_white_down.angle = 90;
  arrow_white_down.x = 450;
  arrow_white_down.y = 440;
  container.addChild(arrow_white_down);
  arrow_red_down = new PIXI.Sprite(resources.obj_5_data.texture);
  arrow_red_down.scale.x = arrow_red_down.scale.y = 0.5;
  arrow_red_down.angle = 90;
  arrow_red_down.x = 450;
  arrow_red_down.y = 440;
  arrow_red_down.visible = false;
  container.addChild(arrow_red_down);

  // navigation bgm button
  // on
  bt_bgm_on = new PIXI.Sprite(resources.obj_9_data.texture);
  bt_bgm_on.scale.x = bt_bgm_on.scale.y = 0.25;
  bt_bgm_on.x = 258;
  bt_bgm_on.y = 5;
  bt_bgm_on.visible = false;
  container.addChild(bt_bgm_on);
  bt_bgm_on.interactive = true;
  bt_bgm_on.buttonMode = true;
  bt_bgm_on.interactiveChildren = true;
  // off
  bt_bgm_off = new PIXI.Sprite(resources.obj_10_data.texture);
  bt_bgm_off.scale.x = bt_bgm_off.scale.y = 0.25;
  bt_bgm_off.x = 258;
  bt_bgm_off.y = 5;
  container.addChild(bt_bgm_off);
  bt_bgm_off.interactive = true;
  bt_bgm_off.buttonMode = true;
  bt_bgm_off.interactiveChildren = true;

  bt_bgm_on.on("tap", (event: MouseEvent) => {
    console.log("bgm_on tap!");
    stopBGM();
  });
  bt_bgm_on.on("click", (event: MouseEvent) => {
    console.log("bgm_on click!");
    stopBGM();
  });

  bt_bgm_off.on("tap", (event: MouseEvent) => {
    console.log("bgm_off tap!");
    playBGM();
  });
  bt_bgm_off.on("click", (event: MouseEvent) => {
    console.log("bgm_off click!");
    playBGM();
  });

  const playBGM = () => {
    if (bgmFlag === false) {
      bgmFlag = true;
      sound_bgm.play();
      bt_bgm_on.visible = true;
      bt_bgm_on.interactive = true;
      bt_bgm_off.visible = false;
      bt_bgm_off.interactive = false;
    }
  };

  const stopBGM = () => {
    if (bgmFlag) {
      bgmFlag = false;
      sound_bgm.stop();
      bt_bgm_on.visible = false;
      bt_bgm_on.interactive = false;
      bt_bgm_off.visible = true;
      bt_bgm_off.interactive = true;
    }
  };

  // Subscribe Cursor Key
  const left: {
    press: Function;
    release: Function;
    isDown: Function;
  } = keyboard(37);
  const up: {
    press: Function;
    release: Function;
    isDown: Function;
  } = keyboard(38);
  const right: {
    press: Function;
    release: Function;
    isDown: Function;
  } = keyboard(39);
  const down: {
    press: Function;
    release: Function;
    isDown: Function;
  } = keyboard(40);

  // Left Cursor Key
  left.press = () => {
    console.log("left.press");
    explorer_vx = -explorer_speed;
    explorer_vy = 0;
    arrow_white_left.visible = false;
    arrow_red_left.visible = true;
  };
  left.release = () => {
    console.log("left.release");
    arrow_white_left.visible = true;
    arrow_red_left.visible = false;
    if (!right.isDown && explorer_vy === 0) {
      // If this discrimination is entered, if the reverse key is pressed,
      // that will be prioritized over the released key (the movement will not stop once, it will move smoothly).
      explorer_vx = 0;
    }
    // keyboard(37).unsubscribe(); // ok
  };

  // Up Cursor Key
  up.press = () => {
    console.log("up.press");
    explorer_vx = 0;
    explorer_vy = -explorer_speed;
    arrow_white_up.visible = false;
    arrow_red_up.visible = true;
  };
  up.release = () => {
    console.log("up.release");
    arrow_white_up.visible = true;
    arrow_red_up.visible = false;
    if (!down.isDown && explorer_vx === 0) {
      explorer_vy = 0;
    }
  };

  // Right Cursor Key
  right.press = () => {
    console.log("right.press");
    explorer_vx = explorer_speed;
    explorer_vy = 0;
    arrow_white_right.visible = false;
    arrow_red_right.visible = true;
  };
  right.release = () => {
    console.log("right.release");
    arrow_white_right.visible = true;
    arrow_red_right.visible = false;
    if (!left.isDown && explorer_vy === 0) {
      explorer_vx = 0;
    }
  };

  // Down Cursor Key
  down.press = () => {
    console.log("down.press");
    explorer_vx = 0;
    explorer_vy = explorer_speed;
    arrow_white_down.visible = false;
    arrow_red_down.visible = true;
  };
  down.release = () => {
    console.log("down.release");
    arrow_white_down.visible = true;
    arrow_red_down.visible = false;
    if (!up.isDown && explorer_vx === 0) {
      explorer_vy = 0;
    }
  };

  gameState = "play";

  // app start
  gameLoopFlag = true;
  requestAnimationFrame(animate); // -> gameLoop start
};

// The game's helper functions:
// 'keyboard', 'hitTestRectangle', 'contain', 'randomInt'
// -> Externalization

/**
 * Show HP num
 * @param e
 */
const setHpNum = (e: number) => {
  if (e !== FIRST) {
    container.removeChild(text_hp_num);
  }
  text_hp_num = setText(
    Math.floor(outerBar.width),
    "Arial",
    16,
    0xff0033,
    "center",
    "bold",
    "#000000",
    5,
    false,
    "#666666",
    "round"
  );
  container.addChild(text_hp_num);
  text_hp_num.x = 335;
  text_hp_num.y = 5;
};
