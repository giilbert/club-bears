import { createRef, useEffect } from "react";
import Game from "./Game";

const App: React.FC = () => {
  const canvasRef = createRef<HTMLCanvasElement>();

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    window.__ClubBears = {
      ...window.__ClubBears,
      game: new Game(canvas),
    };
  }, [canvasRef.current]);

  return (
    <>
      <canvas ref={canvasRef} />
    </>
  );
};

export default App;
