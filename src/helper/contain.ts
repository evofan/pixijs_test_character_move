import * as PIXI from "pixi.js";

/**
 * Check if the sprite has crossed the bounds of the contained object.
 * @param Sprite Sprite you want to keep
 * @param Container {x: number, y: number, width: number, height: number} A rectangular area
 * @returns collision direction or undefined
 */
export const contain = (
  sprite: PIXI.Sprite,
  container: { x: number; y: number; width: number; height: number }
) => {
  let collision: string | undefined = undefined;

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
