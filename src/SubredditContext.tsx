import { createContext } from "react";
import type { SubReddit } from "./App";

export type SubRedditContext = {
  selectedSubreddit: SubReddit | null;
  setSelectedSubreddit: (sub: SubReddit | null) => void;
};

const SubRedditContext = createContext<SubRedditContext>({
  selectedSubreddit: null,
  setSelectedSubreddit: (sub: SubReddit | null) => {},
});

export default SubRedditContext;
