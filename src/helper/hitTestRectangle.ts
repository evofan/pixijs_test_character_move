import * as PIXI from "pixi.js";

/**
 * Make a collision detection between two sprites.
 * @param r1 Sptite1
 * @param r2 Sptite2
 * @returns isHit true or false
 */
export const hitTestRectangle = (r1: PIXI.Sprite, r2: PIXI.Sprite) => {
  // Define the variables we'll need to calculate、計算する必要のある変数を定義
  let hit: boolean,
    combinedHalfWidths: number,
    combinedHalfHeights: number,
    vx: number,
    vy: number;

  // hit will determine whether there's a collision、ヒットは衝突があるかどうかを判別する
  hit = false;

  // Find the center points of each sprite、各スプライトの中心点を探す
  let r1_centerX = r1.x + r1.width / 2;
  let r1_centerY = r1.y + r1.height / 2;
  let r2_centerX = r2.x + r2.width / 2;
  let r2_centerY = r2.y + r2.height / 2;

  // Find the half-widths and half-heights of each sprite、各スプライトの半分の幅と半分の高さを探す
  let r1_halfWidth = r1.width / 2;
  let r1_halfHeight = r1.height / 2;
  let r2_halfWidth = r2.width / 2;
  let r2_halfHeight = r2.height / 2;

  // Calculate the distance vector between the sprites、スプライト間の距離ベクトルを計算する
  vx = r1_centerX - r2_centerX;
  vy = r1_centerY - r2_centerY;

  // Figure out the combined half-widths and half-heights、半分の幅と半分の高さの組み合わせを計算する
  combinedHalfWidths = r1_halfWidth + r2_halfWidth;
  combinedHalfHeights = r1_halfHeight + r2_halfHeight;

  // Check for a collision on the x axis、x軸の衝突を確認する
  if (Math.abs(vx) < combinedHalfWidths) {
    // A collision might be occurring. Check for a collision on the y axis、衝突が発生している可能性があり、y軸の衝突をチェックする
    if (Math.abs(vy) < combinedHalfHeights) {
      // There's definitely a collision happening、間違いなく衝突が起こっている
      hit = true;
    } else {
      // There's no collision on the y axis、y軸に衝突はなし
      hit = false;
    }
  } else {
    // There's no collision on the x axis、x軸に衝突はなし
    hit = false;
  }

  // `hit` will be either `true` or `false`、`hit`は` true`または `false`のいずれかになる
  return hit;
};
