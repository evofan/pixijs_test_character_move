import * as PIXI from "pixi.js";

// 探検家はキーボードを使用して制御されます。
// それを実行するコードは、以前に学習したキーボード制御コードと非常によく似ています。
// キーボードオブジェクトは探検家の速度を変更し、その速度はplay機能内の探検家の位置に追加されます。

// explorer.x += explorer.vx;
// explorer.y += explorer.vy;

// 1.動きを抑制する

// しかし新しいことは、探検家の動きがダンジョンの壁の内側に抑制されているということです。
// 緑色のアウトラインは、探検家の動きの限界を示しています。

// これは、contain()というカスタム関数を使用して行われます。

// contain(explorer, {x: 28, y: 10, width: 488, height: 480});

// contain()は2つの引数を取ります。 1つ目はあなたが封じ込めておきたいスプライトです。
// 2番目は、矩形領域を定義するx、y、width、およびheightの各プロパティを持つオブジェクトです。
// この例では、包含オブジェクトはステージからわずかにオフセットされ、ステージよりも小さい領域を定義します。
// それはダンジョンの壁の寸法に合っています。

// これが、このすべての作業を実行するcontain()関数です。
// この関数は、スプライトが包含オブジェクトの境界を越えたかどうかを確認します。
// ある場合は、コードはスプライトをその境界に戻します。
// contain関数は、境界のどちら側にスプライトがヒットしたかに応じて、値 "top"、 "right"、 "bottom"、
// または "left"を持つ衝突変数も返します。
//（スプライトがどの境界にも当たらなかった場合、衝突は未定義（undefined）のままになります）

/**
 *
 * @param sprite
 * @param container
 * @returns
 */
export const contain = (sprite: PIXI.Sprite, container: PIXI.Container) => {
  let collision = undefined;

  // Left
  if (sprite.x < container.x) {
    sprite.x = container.x;
    collision = "left";
  }

  // Top
  if (sprite.y < container.y) {
    sprite.y = container.y;
    collision = "top";
  }

  // Right
  if (sprite.x + sprite.width > container.width) {
    sprite.x = container.width - sprite.width;
    collision = "right";
  }

  // Bottom
  if (sprite.y + sprite.height > container.height) {
    sprite.y = container.height - sprite.height;
    collision = "bottom";
  }

  // Return the `collision` value
  return collision;
};

// ブロブ0モンスターを上下のダンジョンの壁の間で前後に移動させるために、
// 衝突の戻り値が前方のコードでどのように使用されるかがわかります。
