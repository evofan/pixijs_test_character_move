 /**
 * ランダムな値を返す
 * @param min 最小値
 * @param max 最大値
 * @returns 最小値以上～最大値以下の値
 */
export const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};