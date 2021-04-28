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
import { gsap, TimelineMax, TweenMax } from "gsap"; // npm install -D @types/gsap

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

// container
let container: PIXI.Container = new PIXI.Container();
container.width = WIDTH;
container.height = HEIGHT;
container.x = 0;
container.y = 0;
container.pivot.x = 0.5;
container.pivot.y = 0.5;
container.interactive = false;
container.interactiveChildren = false;
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
  blob_xOffset: number = 150,
  blob_speed: number = 2,
  blob_direction: number = 1,
  blob_vy: number[] = [];

// hp bar
let healthBar: PIXI.Container = new PIXI.Container();
let innerBar: PIXI.Graphics = new PIXI.Graphics();
let outerBar = new PIXI.Graphics();

// arrow for cursor-key use
let arrow_white_left: PIXI.Sprite,
  arrow_white_up: PIXI.Sprite,
  arrow_white_right: PIXI.Sprite,
  arrow_white_down: PIXI.Sprite,
  arrow_red_left: PIXI.Sprite,
  arrow_red_up: PIXI.Sprite,
  arrow_red_right: PIXI.Sprite,
  arrow_red_down: PIXI.Sprite;

// sound
let se1: Howl;
let se1Flag: boolean = true;
let se2: Howl;
let se2Flag: boolean = true;

// text
let text_libVersion: PIXI.Text,
  text_description: PIXI.Text,
  text_message: PIXI.Text,
  text_fps: PIXI.Text;

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

// 私はあなたが今あなたがゲームを作り始めるのに必要なすべてのスキルを持っているとあなたに言いました。
// 何？ あなたは私を信じていませんか？ それを証明しましょう！
// トレジャーハンターと呼ばれる単純なオブジェクトコレクションと敵の回避ゲームの作り方を詳しく見てみましょう。
// （examplesフォルダにあります）

// トレジャーハンターは、これまでに学んだツールを使用して作成できる最も簡単な完成ゲームの1つの好例です。
// キーボードの矢印キーを使って、探検家が宝物を見つけて出口まで運んでください。
// 6つのブロブモンスターがダンジョンの壁の間を上下に移動し、探検家にぶつかると半透明になり、右上隅のヘルスメーターが縮小します。
// すべての健康状態が使い果たされると、ステージに「You Lost！」と表示されます。
// 探検家が宝物のある出口にたどり着くと、「You Won！」と表示されます。

// これは基本的なプロトタイプですが、トレジャーハンターには、より大きなゲームで見つけることができるほとんどの要素が含まれています。
// テクスチャアトラスグラフィック、インタラクティブ機能、衝突、複数のゲームシーンなどです。
// 自分のゲームの開始点として使用できるように、ゲームがどのようにまとめられたかを見ていきましょう。

// The code structure（コードの構築方法）

// treasureHunter.htmlファイルを開くと、すべてのゲームコードが1つの大きなファイルにまとめられていることがわかります。
// これは、すべてのコードがどのように編成されているかを俯瞰したものです。

// Pixiをセットアップし、テクスチャアトラスファイルをロードします - ロードされたときに `setup`関数を呼び出します
/*
  function setup() {
    // ゲームスプライトを初期化し、ゲームの `state`を` play`に設定して 'gameLoop'を起動します
  }

  function gameLoop(delta) {
    // 現在のゲームの状態をループで実行し、スプライトをレンダリングします。
  }

  function play(delta) {
    // すべてのゲームロジックはここにあります
  }

  function end() {
    // ゲーム終了時に実行されるべきすべてのコードがあります。
  }
  */

// 各セクションがどのように機能するかを見ながら、これをゲームの世界地図として使用します。

// function
const gameLoop = (delta: number): void => {
  // console.log("gameLoop()", delta);
  // 現在のゲームの状態をループで実行し、スプライトをレンダリングします。

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

  // play()関数はまた、ブロブモンスターを移動させ、それらをダンジョンの壁の中に閉じ込めたままにし、
  // そしてそれぞれのプレイヤーとの衝突をチェックします。
  // ブロブがダンジョンの上壁または下壁にぶつかると、方向が逆になります。
  // これはすべて、毎フレームでBLOB配列内のBLOBスプライトのそれぞれを繰り返すforEach()ループを使用して行われます。

  //blobs.forEach((blob, idx) => {
  blobs.map((blob, idx) => {
    // ブロブを移動する
    blob.y += blob_vy[idx];

    // BLOBのスクリーン上の境界をチェックする
    let blobHitsWall = contain(blob, {
      x: BOUNDARY_RANGE_X,
      y: BOUNDARY_RANGE_Y,
      width: BOUNDARY_RANGE_WIDTH,
      height: BOUNDARY_RANGE_HEIGHT,
    });

    // ブロブがステージの上または下に当たった場合は、方向を逆にします
    if (blobHitsWall === "top" || blobHitsWall === "bottom") {
      blob_vy[idx] *= -1;
    }

    // 衝突をテストします。 いずれかの敵が探検家に触れている場合は、`explorerHit`を` true`に設定します。
    if (hitTestRectangle(explorer, blob)) {
      explorerHit = true;
    }
  });

  //  このコードでは、contain()関数の戻り値を使用してBLOBを壁から反射させる方法がわかります。
  // 戻り値を取得するためにblobHitsWallという変数が使用されます。

  // let blobHitsWall = contain(blob, { x: 28, y: 10, width: 488, height: 480 });

  // blobHitsWallは通常undefinedです。
  // しかし、ブロブが上の壁に当たった場合、blobHitsWallの値は"top"になります。
  // ブロブが底壁に当たった場合、blobHitsWallは "bottom"という値になります。
  // これらのケースのいずれかが当てはまる場合は、速度を逆にすることでブロブの方向を逆にすることができます。
  // これを行うコードは次のとおりです。

  /*
  if (blobHitsWall === "top" || blobHitsWall === "bottom") {
    blob.vy *= -1;
  }
  */

  // ブロブのvy（vertical velocity：垂直速度）値に-1を掛けると、その移動方向が反転します。

  // hitTestRectangle()がtrueを返す場合、それは衝突があったことを意味し、explorerHitという変数がtrueに設定されます。
  // explorerHitがtrueの場合、play()関数は探検家を半透明にし、体力バーの幅を1ピクセル縮小します。

  if (explorerHit) {
    // Make the explorer translucent
    explorer.alpha = 0.5;

    se1.stop();
    se1.play(); // 開始後に少し空白があるのでトル

    // hp bar minus
    outerBar.width -= 1;
    if (outerBar.width < 0) {
      outerBar.width = 0;
    }
  } else {
    // If not hit, make the explorer completely opaque(non-transparent)
    explorer.alpha = 1;
  }

  // explorerHitがfalseの場合、冒険家のalphaプロパティは1に維持され、完全に不透明（のまま）になります。

  // play()関数はまた宝箱と探検家間の衝突をチェックします。
  // ヒットした場合、宝物はわずかにオフセットされた状態で探索者探検家の位置に設定されます。
  // これはそれが探検家が宝物を運んでいるように見えます。

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
    gameState = "end";
    gameOver();
    // message.text = "You lost!";
  }

  // If the explorer has brought the treasure to the exit,
  // end the game and display "You won!"
  if (hitTestRectangle(treasure, door)) {
    gameState = "end";
    // message.text = "You won!";
    gameEnd();
  }
};

const gamePlay = (): void => {
  console.log("gamePlay()");
  // すべてのゲームロジックはここにあります

  // 探検家を動かし、それをダンジョンの中に閉じ込めます
  // ブロブモンスターを動かします
  // ブロブと探検家の間の衝突をチェックします
  // 探検家と宝物の間の衝突をチェックします
  // 宝物とドアの間の衝突をチェックします
  // ゲームが勝ったか負けたかを決めます
  // ゲームが終了したら、ゲームの「状態」を「終了」に変更します。
  //}
};

/**
 * I have all the code that should be executed at the end of the game.
 */
const gameEnd = (): void => {
  console.log("gameEnd()");
  gameLoopFlag = false;
  // gameScene.visible = false;
  gameOverScene.visible = false;
  gameClearScene.visible = true;
  // create a new timeline instance
  let tl: TimelineMax = new TimelineMax();
  // the following two lines do the SAME thing:
  message_gameclear.x = 0;
  tl.add(
    TweenMax.to(message_gameclear, 1, {
      x: WIDTH / 2 - message_gameclear.width / 2,
    })
  );
  // tl.to(umbrella, 2, { x: 300 }); // shorter syntax!
};

/**
 * I have all the code that should be executed at the end of the game.
 */
const gameOver = (): void => {
  console.log("gameOver()");
  gameLoopFlag = false;
  gameScene.visible = false;
  gameOverScene.visible = true;
  gameClearScene.visible = false;
  // create a new timeline instance
  //let tl: TimelineMax = new TimelineMax();
  // the following two lines do the SAME thing:
  //tl.add(TweenMax.to(message_gameover, 2, { scaleX: 3, scaleY: 3 }));
  // tl.to(umbrella, 2, { x: 300 }); // shorter syntax!
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

  // Create a `gameOverScene` group
  container.addChild(gameOverScene);
  gameOverScene.visible = false;

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
  explorer.x = 68;
  explorer.y = gameScene.height / 2 - explorer.height / 2;
  explorer_vx = 0;
  explorer_vy = 0;
  gameScene.addChild(explorer);

  // Create the `treasure` sprite
  treasure = new PIXI.Sprite(id["treasure.png"]);
  treasure.x = gameScene.width - treasure.width - 48;
  treasure.y = gameScene.height / 2 - treasure.height / 2;
  gameScene.addChild(treasure);

  // Putting them together (dungeon, door, player, treasure chest) in a gameScene group makes
  // it easier to hide the gameScene and show the gameOverScene when the game is over.

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
  healthBar.position.set(WIDTH - 170, 12);
  gameScene.addChild(healthBar);

  // Create a rectangle with a black background.
  innerBar.beginFill(0x000000);
  innerBar.drawRect(0, 0, 129, 10);
  innerBar.endFill();
  healthBar.addChild(innerBar);

  // Create a red rectangle on the front.
  outerBar.beginFill(0x990000);
  outerBar.drawRect(0, 0, 128, 8);
  outerBar.endFill();
  healthBar.addChild(outerBar);

  // 5. MESSAGE TEXT

  // When the game is over, you will see the text "You won" or "You lost" depending on the result of the game.
  // This is done by using a text sprite and adding it to the gameOverScene.
  // This text will not be displayed because the visible property of gameOverScene is set to false at the start of the game.
  let style = new PIXI.TextStyle({
    fontFamily: "Futura",
    fontSize: 64,
    fill: "white",
  });
  message_gameover = new PIXI.Text("Game Over!", style);
  message_gameover.x = WIDTH / 2 - message_gameover.width / 2;
  message_gameover.y = HEIGHT / 2 - message_gameover.height;
  gameOverScene.addChild(message_gameover);

  message_gameclear = new PIXI.Text("Game Clear!", style);
  message_gameclear.x = WIDTH / 2 - message_gameclear.width / 2;
  message_gameclear.y = HEIGHT / 2 - message_gameclear.height;
  gameClearScene.addChild(message_gameclear);

  console.log(resources.obj_6_data.url);

  // 6. SOUND

  // bgm test
  let sound_bgm: Howl = new Howl({
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

  // SE test
  se1 = new Howl({
    src: [resources.obj_7_data.url],
    autoplay: false,
    loop: false,
    volume: 0.2,
    onend: () => {
      console.log("SE1 finished.");
      se1Flag = true;
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

  // text version
  let version: string = `PixiJS: ver.${PIXI.VERSION}`;
  text_libVersion = setText(version, "Arial", 16, 0xf0fff0, "left", "normal");
  container.addChild(text_libVersion);
  text_libVersion.x = WIDTH - text_libVersion.width - offset;
  text_libVersion.y = HEIGHT - text_libVersion.height - 5;

  // text description
  let description: string = "Treature Hunter";
  text_description = setText(
    description,
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
  container.addChild(text_description);
  text_description.x = WIDTH / 2 - text_description.width / 2;
  text_description.y = HEIGHT - text_description.height;

  // text message
  let message_navi: string = "HP:";
  text_message = setText(
    message_navi,
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
  container.addChild(text_message);
  text_message.x = 305;
  text_message.y = 5;

  // text fps
  text_fps = setText(`FPS: ${fps}`, "Impact", 16, 0xf0fff0, "left", "normal");
  container.addChild(text_fps);
  text_fps.x = offset;
  text_fps.y = HEIGHT - text_fps.height - 5;

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

  // Subscribe Cursor Key
  const left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);

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
