// stage settings
export const STAGES: { WIDTH: number; HEIGHT: number; BG_COLOR: number } = {
  WIDTH: 512,
  HEIGHT: 512,
  BG_COLOR: 0x000000
};

// path for assets
export const ASSETS: {
  ASSET_BG: string;
  ASSET_OBJ1: string;
  ASSET_OBJ2: string;
  ASSET_OBJ3: string;
  ASSET_OBJ4: string;
  ASSET_OBJ5: string;
  ASSET_OBJ6: string;
  ASSET_OBJ7: string;
  ASSET_OBJ8: string;
} = {
  ASSET_BG: "assets/images/pic_bg_night.jpg",
  ASSET_OBJ1: "assets/images/cat.png",
  ASSET_OBJ2: "assets/images/atras.json",
  ASSET_OBJ3: "assets/images/treasureHunter.json",
  ASSET_OBJ4: "assets/images/pic_arrow_white.png",
  ASSET_OBJ5: "assets/images/pic_arrow_red.png",
  ASSET_OBJ6: "assets/sounds/LittleBirdInTheGrass.mp3",
  ASSET_OBJ7: "assets/sounds/8bitgame_001.mp3",
  ASSET_OBJ8: "assets/sounds/8bitgame_300.mp3"
  // TODO: load manifest file
};

export const GAMES: { FPS: number } = {
  FPS: 60 // framerate ex. 30
};
