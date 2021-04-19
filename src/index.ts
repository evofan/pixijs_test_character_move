import * as PIXI from "pixi.js";
// webpack v5 error. import { loader } from "webpack";
import { WebpackPluginInstance as loader } from "webpack";
// window.PIXI = PIXI;
import { STAGES, ASSETS, GAMES } from "./constants";
import { setText } from "./helper/setText";
import { randomInt } from "./helper/randomInt";
import { keyboard } from "./helper/keyboard";
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

let gameState: string = "init";
let atras: PIXI.Sprite;
let gameLoopFlag: boolean = false;

// game sprite
let dungeon: PIXI.Sprite;
let door: PIXI.Sprite;
let explorer: PIXI.Sprite;
let treasure: PIXI.Sprite;

// explorer 
let explorer_vx: number = 0;
let explorer_vy: number = 0;
let explorer_speed: number = 3;

// 体力バー用コンテナ
let healthBar: PIXI.Container = new PIXI.Container();

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
  requestAnimationFrame(animate);

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
const gameLoop: Function = (delta: number): void => {
  console.log("gameLoop()", delta);
  // 現在のゲームの状態をループで実行し、スプライトをレンダリングします。

  // Use the explorer's velocity to make it move
  explorer.x += explorer_vx;
  explorer.y += explorer_vy;
};

const gamePlay: Function = (): void => {
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

const gameEnd: Function = (): void => {
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
const gameSetup: Function = (resources: any): void => {
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
  gameOverScene.visible = false;
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
  dungeon.x = 0;
  dungeon.y = 0;
  gameScene.addChild(dungeon);

  // ドア
  door = new PIXI.Sprite(id["door.png"]);
  door.position.set(480, 30);
  gameScene.addChild(door);

  // プレイヤー（探検家）
  explorer = new PIXI.Sprite(id["explorer.png"]);
  explorer.x = 250;
  explorer.y = 50;
  // explorer.y = gameScene.height / 2 - explorer.height / 2;
  // explorer.vx = 0; //errなのでオブジェクトで持たせとく？
  // explorer.vy = 0;
  explorer_vx = 0;
  explorer_vy = 0;
  gameScene.addChild(explorer);

  // 宝箱
  treasure = new PIXI.Sprite(id["treasure.png"]);
  // treasure.x = gameScene.width - treasure.width - 48;
  // treasure.y = gameScene.height / 2 - treasure.height / 2;
  treasure.x = 250;
  treasure.y = 90;
  gameScene.addChild(treasure);

  // それら（ダンジョン、ドア、プレイヤー、宝箱）をgameSceneグループにまとめておくと、ゲームが終了したときにgameSceneを非表示にして
  // gameOverSceneを表示するのが簡単になります。
  //（※シーン切り替えをスマートにする考え方）

  // ■3.モンスターの作成

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

  // ■4.ヘルス（体力）バーの作成

  // Treasure Hunterをプレイすると、探検家が敵の1人に触れると、画面の右上隅にあるhealthBar（体力バー）の幅が狭くなります。
  // この体力バーはどうやって作られたのですか？ それはちょうど同じ位置にある2つの重なっている長方形です。
  // 後ろの黒い長方形と前の赤い長方形です。 それらは1つの体力バーグループにまとめられています。
  // その後、体力バーがgameSceneに追加され、ステージ上に配置されます。

  // 体力バーを作成する
  // healthBar = new PIXI.Container();
  healthBar.position.set(570, 4);
  // healthBar.x = stage.width - 170;
  // healthBar.y = 4;
  gameScene.addChild(healthBar);

  // 黒い背景の四角形を作成する
  let innerBar: PIXI.Graphics = new PIXI.Graphics();
  innerBar.beginFill(0x000000);
  innerBar.drawRect(0, 0, 128, 8);
  innerBar.endFill();
  healthBar.addChild(innerBar);

  // 前面の赤い長方形を作成する
  let outerBar = new PIXI.Graphics();
  outerBar.beginFill(0xff3300);
  outerBar.drawRect(0, 0, 128, 8);
  outerBar.endFill();
  healthBar.addChild(outerBar);

  // healthBar.outer = outerBar; // err
  // outerというプロパティがhealthBarに追加されたことがわかります。
  // 後でアクセスするのに便利なように、outerBar（赤い長方形）を参照するだけです。
  // healthBar.outer = outerBar;
  // それはかなりきれいで読みやすいです、それで我々はそれを守ります！
  // あなたはこれをする必要はありません。 しかし、なぜそうではないのでしょう！
  // つまり、赤いouterBarの幅を制御したい場合は、次のような滑らかなコードを書くことができます。
  // healthBar.outer.width = 30;

  // ■5.メッセージテキストの作成

  // ゲームが終了すると、ゲームの結果に応じて「あなたは勝ちました」または「あなたは負けました」というテキストが表示されます。
  // これはテキストスプライトを使用してそれをgameOverSceneに追加することで行われます。
  // ゲームの開始時にgameOverSceneのvisibleプロパティはfalseに設定されているため、このテキストは表示されません。
  // これは、メッセージテキストを作成してそれをgameOverSceneに追加するsetup関数のコードです。
  let style = new PIXI.TextStyle({
    fontFamily: "Futura",
    fontSize: 64,
    fill: "white",
  });
  let message = new PIXI.Text("The End!", style);
  message.x = 120;
  message.y = 120;
  gameOverScene.addChild(message);
  // gameScene.addChild(message); // 位置確認用

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

//// ゲームのヘルパー関数 ////
// →外部化

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
};
left.release = () => {
  console.log("left.release");
  if (!right.isDown && explorer_vy === 0) {
    // この判別入れると逆キー押した場合は離したキーよりそちらが優先される（一旦停止しない、滑らかに動く）
    explorer_vx = 0;
  }
  // keyboard(37).unsubscribe(); // ok
};

// Up Cursor Key
up.press = () => {
  console.log("up.press");
  explorer_vx = 0;
  explorer_vy = -explorer_speed;

};
up.release = () => {
  console.log("up.release");
  if (!down.isDown && explorer_vx === 0) {
    explorer_vy = 0;
  }
};

// Right Cursor Key
right.press = () => {
  console.log("right.press");
  explorer_vx = explorer_speed;
  explorer_vy = 0;
};
right.release = () => {
  console.log("right.release");
  if (!left.isDown && explorer_vy === 0) {
    explorer_vx = 0;
  }
};

// Down Cursor Key
down.press = () => {
  console.log("down.press");
  explorer_vx = 0;
  explorer_vy = explorer_speed;
};
down.release = () => {
  console.log("down.release");
  if (!up.isDown && explorer_vx === 0) {
    explorer_vy = 0;
  }
};
