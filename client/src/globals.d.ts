import Game from "./Game";

declare global {
  interface Window {
    __ClubBears: {
      game: Game;
      gl: WebGL2RenderingContext;
    };
  }
}
