import * as PIXI from "pixi.js";
// webpack v5 error. import { loader } from "webpack";
import { WebpackPluginInstance as loader } from "webpack";
// window.PIXI = PIXI;
import { STAGES, ASSETS, GAMES } from "./constants";
import { setText } from "./setText";
import Stats from "stats.js";

console.log(PIXI);

// stats
let stats: Stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

// constant
const WIDTH: number = STAGES.WIDTH;
const HEIGHT: number = STAGES.HEIGHT;
const BG_COLOR: number = STAGES.BG_COLOR;

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
let animate = () => {
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
  gameLoop(deltaTime);

  stats.end();
};

// loader
let loader: PIXI.Loader = new PIXI.Loader();

// asset
const ASSET_BG: string = ASSETS.ASSET_BG;
const ASSET_OBJ1: string = ASSETS.ASSET_OBJ1;
const ASSET_OBJ2: string = ASSETS.ASSET_OBJ2;
const ASSET_OBJ3: string = ASSETS.ASSET_OBJ3;
// const ASSET_OBJ4: string = ASSETS.ASSET_OBJ4;

// init
let bg: PIXI.Sprite;

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

// container for add particle
let container_effect: PIXI.Container = new PIXI.Container();

let cat: PIXI.Sprite;
let gameState: string = "init";
let atras: PIXI.Sprite;
let gameLoopFlag: boolean = false;

// game sprite
let dungeon: PIXI.Sprite;
let door: PIXI.Sprite;
let explorer: PIXI.Sprite;
let treasure: PIXI.Sprite;

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
loader.add("obj_1_data", ASSET_OBJ1);
// loader.add("obj_2_data", ASSET_OBJ2); //   loader.add("images/atras.json").load(setup);
loader.add("obj_3_data", ASSET_OBJ3);
// loader.add("obj_4_data", ASSET_OBJ4);

// Text loading
let text_loading: PIXI.Text;
text_loading = new PIXI.Text(`Loading asset data ....`, {
  fontFamily: "Arial",
  fontSize: 10,
  fill: 0xff0033,
  align: "left",
  fontWeight: "bold",
  stroke: "#000000",
  strokeThickness: 4,
  dropShadow: false,
  dropShadowColor: "#666666",
  lineJoin: "round",
});
container.addChild(text_loading);
text_loading.x = 10;
text_loading.y = 10;

loader.load((loader: PIXI.Loader, resources: any) => {
  console.log(loader);
  console.log(resources);

  container.removeChild(text_loading);

  // bg
  if (ASSET_BG !== "") {
    bg = new PIXI.Sprite(resources.bg_data.texture);
    container.addChild(bg);
  }

  // cat
  cat = new PIXI.Sprite(resources.obj_1_data.texture);
  container.addChild(cat);
  cat.x = WIDTH / 2 - cat.width / 2;
  cat.y = HEIGHT / 2 - cat.height / 2;

  // text
  let offset: number = 10;

  // text version
  // let version: string = "PixiJS: 5.3.3\nwebpack: 4.44.0\nTypeScript: 4.0.2";
  let version: string = `PixiJS: ver.${PIXI.VERSION}`;
  text_libVersion = setText(version, "Arial", 16, 0xf0fff0, "left", "normal");
  container.addChild(text_libVersion);
  text_libVersion.x = offset;
  text_libVersion.y = offset;

  // text description
  let description: string = "Character Move Test";
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
  text_description.y = offset;

  // text message
  let message: string = "Use cursor key";
  text_message = setText(
    message,
    "Arial",
    24,
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
  text_message.x = WIDTH / 2 - text_message.width / 2;
  text_message.y = HEIGHT - text_message.height - offset;

  // text fps
  text_fps = setText(`FPS: ${fps}`, "Impact", 16, 0xf0fff0, "left", "normal");
  container.addChild(text_fps);
  text_fps.x = offset;
  text_fps.y = HEIGHT - text_fps.height - offset;

  // app start
  // requestAnimationFrame(animate);

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
const gameLoop = (delta: number) => {
  // console.log("gameLoop()", delta);
  // 現在のゲームの状態をループで実行し、スプライトをレンダリングします。
};

const gamePlay = () => {
  console.log("gamePlay()");
  // すべてのゲームロジックはここにあります
};

const gameEnd = () => {
  console.log("gameEnd()");
  // ゲーム終了時に実F行されるべきすべてのコードがあります。
};

// テクスチャアトラス画像がロードされるとすぐに、setup()関数が実行されます。
// それは一度だけ実行され、あなたはあなたのゲームのために一度だけセットアップタスクを実行することを可能にします。
// オブジェクト、スプライト、ゲームシーンの作成や初期化、データ配列の生成、ロードされたJSONゲームデータの解析を行うのに最適な場所です。

// これがTreasure Hunterのセットアップ機能とそれが実行するタスクの概要です。

// 最後の2行のコード、state = play。 そしてgameLoop()がおそらく最も重要です。
// PixiのティッカーにgameLoop()を追加すると、ゲームのエンジンがオンになり、play()関数が連続ループで呼び出されます。
// しかし、それがどのように機能するのかを見る前に、setup()関数内の特定のコードが何をするのか見てみましょう。
const gameSetup = (resources: any) => {
  console.log("gameSetup()");
  // ゲームスプライトを初期化し、ゲームの `state`を` play`に設定して 'gameLoop'を起動します

  //Create the `gameScene` group

  //Create the `door` sprite

  //Create the `player` sprite

  //Create the `treasure` sprite

  //Make the enemies

  //Create the health bar

  //Add some text for the game over message

  //Create a `gameOverScene` group

  //Assign the player's keyboard controllers

  // ■1.ゲームのシーンを作成する

  // setup()関数は、gameSceneとgameOverSceneという2つのコンテナグループを作成します。
  // これらのそれぞれがステージに追加されます。
  let gameScene: PIXI.Container = new PIXI.Container();
  container.addChild(gameScene);

  let gameOverScene: PIXI.Container = new PIXI.Container();
  container.addChild(gameOverScene);
  gameScene.x = 0;
  gameScene.y = 0;

  // メインゲームの一部であるスプライトはすべてgameSceneグループに追加されます。
  // ゲーム終了時に表示されるべきゲームオーバーテキストは、gameOverSceneグループに追加されます。

  // これはsetup()関数内で作成されますが、ゲームが最初に起動したときにgameOverSceneが表示されないようにする必要があります。
  // そのため、そのvisibleプロパティはfalseに初期化されています。
  gameOverScene.visible = false;

  // ゲームが終了すると、gameOverSceneのvisibleプロパティがtrueに設定され、
  // ゲームの終わりに表示されるテキストが表示されます。
  // （※シーン切り替えの考え方）

  // ■2.ダンジョン、ドア、探検家、宝箱の作成

  // プレイヤー（探検家）、出口のドア、宝箱、ダンジョンの背景画像はすべてテクスチャアトラスフレームから作られたスプライトです。
  // 非常に重要なことに、それらはすべてgameSceneの子（children）として追加されています。

  // テクスチャアトラスフレームIDのエイリアスを作成します。
  // id = resources["images/treasureHunter.json"].textures;

  //（２）loaderのresourcesを使ってテクスチャにアクセスする
  // let car = new PIXI.Sprite(resources["images/atras.json"].textures["pic_car.png"]);

  let id: any = resources.obj_3_data.textures;

  // ダンジョン
  dungeon = new PIXI.Sprite(id["dungeon.png"]);
  dungeon.x = 400;
  dungeon.y = 200;
  gameScene.addChild(dungeon);

  // ドア
  door = new PIXI.Sprite(id["door.png"]);
  door.position.set(500, 10);
  gameScene.addChild(door);

  // プレイヤー（探検家）
  explorer = new PIXI.Sprite(id["explorer.png"]);
  explorer.x = 500;
  explorer.y = 50;
  // explorer.y = gameScene.height / 2 - explorer.height / 2;
  // explorer.vx = 0; //errなのでオブジェクトで持たせとく？
  // explorer.vy = 0;
  gameScene.addChild(explorer);

  // 宝箱
  treasure = new PIXI.Sprite(id["treasure.png"]);
  // treasure.x = gameScene.width - treasure.width - 48;
  // treasure.y = gameScene.height / 2 - treasure.height / 2;
  treasure.x = 500;
  treasure.y = 90;
  gameScene.addChild(treasure);

  // それら（ダンジョン、ドア、プレイヤー、宝箱）をgameSceneグループにまとめておくと、ゲームが終了したときにgameSceneを非表示にして
  // gameOverSceneを表示するのが簡単になります。
  //（※シーン切り替えをスマートにする考え方）

  // 3.モンスターの作成

  // 6つのブロブ（BLOB：小さい固まり）モンスターが1つのループ内に作成されます。
  // 各ブロブにはランダムな初期位置とvelocity（速度）が与えられます。
  // 垂直方向の速度は、各ブロブに対して交互に1または-1で乗算されます。
  // そのため、各ブロブは隣の方向とは反対方向に移動します。
  // 作成されたそれぞれのブロブモンスターは、blobsと呼ばれる配列にプッシュ（で格納）されます。

  let numberOfBlobs: number = 6,
    spacing: number = 48,
    xOffset: number = 150,
    speed: number = 2,
    direction: number = 1;

  // すべてのブロブモンスターを格納するための配列
  let blobs: PIXI.Sprite[] = [];

  // `numberOfBlobs`と同数のブロブを作成します
  for (let i: number = 0; i < numberOfBlobs; i++) {
    // ブロブを作成する
    let blob: PIXI.Sprite = new PIXI.Sprite(id["blob.png"]); // `xOffset`は最初のブロブが追加されるべき画面の左からの位置を決定します

    // `spacing`の値に従って各ブロブを水平方向に間隔を空けます。
    let x: number = spacing * i + xOffset;

    // ブロブにランダムな「y」位置を与える
    let y: number = randomInt(0, stage.height - blob.height);

    // ブロブの位置を設定する
    blob.x = x;
    blob.y = y;

    // ブロブの垂直方向の速度を設定します。
    // directionは、1か-1のどちらかになります。
    // 「1」は敵が下に移動することを意味し、「-1」はブロブが上に移動することを意味します。
    //　`direction`を` speed`で乗算すると、ブロブの垂直方向が決まります。
    // blob.vy = speed * direction;
    let blob_vy: number = speed * direction; // ★後で動かすのでglobalに保存しておく

    // 次のブロブの方向を逆にする
    direction *= -1;

    // ブロブを`blobs`配列にプッシュ（追加）します
    blobs.push(blob);

    // ブロブを`gameScene`に追加します
    gameScene.addChild(blob);
  }

  // ゲームのステートを`play`に設定する
  // state = play;
  gameState = "play";

  // ゲームのループをスタートする
  // app.ticker.add(delta => gameLoop(delta));

  // app start
  requestAnimationFrame(animate); // フラグ管理の代わりにここで初めてEnterFrame
};

// The game's helper functions:
// ゲームのヘルパー関数：
//　「キーボード（keyboard）」、「ヒットテスト（hitTestRectangle）」「コンテイン（contain）」「ランダム数値（randomInt）」

// The `randomInt` helper function
const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
