# Test to move character with cursor key, on pixijs.

<img src="https://evofan.github.io/pixijs_test_character_move/screenshot/pic_screenshot2.jpg" width="50%">  

Demo  
[https://evofan.github.io/pixijs_test_character_move/dist/](https://evofan.github.io/pixijs_test_character_move/dist/)  

reference  

kittykatattack / learningPixi  
[https://github.com/kittykatattack/learningPixi](https://github.com/kittykatattack/learningPixi)  
>chap34- Case study: Treasure Hunter  

PixiJS v4.5.5 -> v6.0.2  
JavaScript -> TypeScript  
add webpack  
add sound  
add GSAP with PixiPlugin  

goldfire / howler.js  
[https://github.com/goldfire/howler.js](https://github.com/goldfire/howler.js)  

Free BGM sound asset site "nakano sound"  
[http://www.nakano-sound.com/free/cute.html](http://www.nakano-sound.com/free/cute.html)  
Use 草原の小鳥.mp3  

「SOUNDICONS」Free Digital Sound Effects  
[https://www.brainstorm-inc.jp/](https://www.brainstorm-inc.jp/)  
Use 8bitgame_001.wav  
Use 8bitgame_300.wav  

PixiPlugin Docs - GreenSock  
[https://greensock.com/docs/v3/Plugins/PixiPlugin](https://greensock.com/docs/v3/Plugins/PixiPlugin)  
>Be sure to include the PixiPlugin correctly:  
```
import * as PIXI from "pixi.js";a
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

// register the plugin
gsap.registerPlugin(PixiPlugin);

// give the plugin a reference to the PIXI object
PixiPlugin.registerPIXI(PIXI);
```
