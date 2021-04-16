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
// const ASSET_OBJ3: string = ASSETS.ASSET_OBJ3;
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
loader.add("obj_2_data", ASSET_OBJ2); //   loader.add("images/atras.json").load(setup);
// loader.add("obj_3_data", ASSET_OBJ3);
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

  //atras = new PIXI.Sprite(resources.obj_2_data.texture);
  //container.addChild(atras); // noerr noview

  //let id = new PIXI.Sprite(resources.obj_2_data);
  //container.addChild(id);
  //console.log(id);
  //let id = resources["images/atras.json"].textures;

  // エイリアスを使ってairplaneを作成する
  //let airplane = new PIXI.Sprite(id["pic_airplane"]);
  //container.addChild(airplane);
  //airplane.y = 100;

    // （１）TextureCacheにアクセス
    // let bicycleTexture = TextureCache["pic_bicycle.png"];
    // bicycle = new Sprite(bicycleTexture);
    // app.stage.addChild(bicycle);
  
    //（２）loaderのresourcesを使ってテクスチャにアクセスする
  // let car = new PIXI.Sprite(resources["images/atras.json"].textures["pic_car.png"]);
  let car = new PIXI.Sprite(resources.obj_2_data.textures["pic_car.png"]);
  car.x = 100;
  car.y = 100;
  container.addChild(car);

  let airplane = new PIXI.Sprite(resources.obj_2_data.textures["pic_airplane.png"]);
  airplane.x = 400;
  airplane.y = 100;
  container.addChild(airplane);

  let bicycle = new PIXI.Sprite(resources.obj_2_data.textures["pic_bicycle.png"]);
  bicycle.x = 100;
  bicycle.y = 300;
  container.addChild(bicycle);

  let pic_man2= new PIXI.Sprite(resources.obj_2_data.textures["pic_man2.png"]);
  pic_man2.x = 400;
  pic_man2.y = 300;
  container.addChild(pic_man2);

  // particle resource reference
  // particleResourceAry[0] = resources.obj_1_data.texture;
  // particleResourceAry[1] = resources.obj_2_data.texture;
  // particleResourceAry[2] = resources.obj_3_data.texture;
  // particleResourceAry[3] = resources.obj_4_data.texture;

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

  gameSetup();
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
const gameSetup = () => {
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

  // ゲームのステートを`play`に設定する
  // state = play;
  gameState = "play";

  // ゲームのループをスタートする
  // app.ticker.add(delta => gameLoop(delta));

  // app start
  requestAnimationFrame(animate);
};

//The game's helper functions:
// ゲームのヘルパー関数：
//　「キーボード（keyboard）」、「ヒットテスト（hitTestRectangle）」「コンテイン（contain）」「ランダム数値（randomInt）」


// テクスチャアトラスのロード
/*
loader.add("images/atras.json").load(setup);

let bicycle, car, airplane, id;

function setup() {
  // テクスチャアトラス枠からスプライトを作る方法は3つある

  // （１）TextureCacheにアクセス
  let bicycleTexture = TextureCache["pic_bicycle.png"];
  bicycle = new Sprite(bicycleTexture);
  app.stage.addChild(bicycle);

  //（２）loaderのresourcesを使ってテクスチャにアクセスする
  car = new Sprite(resources["images/atras.json"].textures["pic_car.png"]);
  car.x = 100;
  app.stage.addChild(car);

  // 画面中央に配置
  car.y = app.stage.width / 2 - app.stage.height / 2;

  // (3) すべてのテクスチャアトラスに対して `id`というオプションのエイリアスを作成する
  id = PIXI.loader.resources["images/atras.json"].textures;

  // エイリアスを使ってairplaneを作成する
  airplane = new Sprite(id["pic_airplane.png"]);
  app.stage.addChild(airplane);
  airplane.y = 100;
}
*/
