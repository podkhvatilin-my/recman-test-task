import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../assets/styles/global.css";
import { BoardContextProvider } from "../application/context/BoardContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BoardContextProvider>
      <></>
    </BoardContextProvider>
  </StrictMode>,
);
