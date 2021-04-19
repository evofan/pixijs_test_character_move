/**
 * Subscribe Key event
 * @param keyCode
 * @returns key object
 */
export const keyboard: Function = (keyCode: number) => {
  // console.log("keyboard()");
  let key: any = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;

  // The `downHandler`
  key.downHandler = (event: KeyboardEvent): void => {
    // console.log("key.downHandler");
    if (event.keyCode === key.code) {
      // `event.keyCode` isn't recommended, but it doesn't work with the writing below.
      // if (event.key === key.value) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  // The `upHandler`
  key.upHandler = (event: KeyboardEvent): void => {
    // console.log("key.upHandler");
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  // Attach event listeners
  window.addEventListener("keydown", key.downHandler.bind(key), false);
  window.addEventListener("keyup", key.upHandler.bind(key), false);

  key.unsubscribe = (): void => {
    window.removeEventListener("keydown", key.downListener);
    window.removeEventListener("keyup", key.upListener);
  };

  // Return the `key` object
  return key;
};
