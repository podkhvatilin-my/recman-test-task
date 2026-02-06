import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/styles/global.css";
import { BoardContextProvider } from "./application/context/BoardContext";
import { SearchContextProvider } from "./application/context/SearchContext";
import { FilterContextProvider } from "./application/context/FilterContext";
import { SelectionContextProvider } from "./application/context/SelectionContext";
import { ActiveColumnContextProvider } from "./application/context/ActiveColumnContext";
import { AppLayout } from "./ui/layout/AppLayout";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BoardContextProvider>
      <SearchContextProvider>
        <FilterContextProvider>
          <SelectionContextProvider>
            <ActiveColumnContextProvider>
              <AppLayout />
            </ActiveColumnContextProvider>
          </SelectionContextProvider>
        </FilterContextProvider>
      </SearchContextProvider>
    </BoardContextProvider>
  </StrictMode>,
);
