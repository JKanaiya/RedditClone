import { createContext } from "react";
import type { Post } from "./App";

export type PostContext = {
  selectedPost: Post | null;
  setSelectedPost: (post: Post | null) => void;
  toggleSelectedPost: (post: Post | null) => void;
};

const PostContext = createContext<PostContext>({
  selectedPost: null,
  setSelectedPost: (post: Post | null) => {},
  toggleSelectedPost: (post: Post | null) => {},
});

export default PostContext;
