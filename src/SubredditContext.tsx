import { createContext } from "react";
import type { SubReddit } from "./App";

export type SubRedditContext = {
  selectedSubreddit: SubReddit | null;
  setSelectedSubreddit: (sub: SubReddit) => void;
};

const SubRedditContext = createContext<SubRedditContext>({
  selectedSubreddit: null,
  setSelectedSubreddit: (sub: SubReddit) => {},
});

export default SubRedditContext;
