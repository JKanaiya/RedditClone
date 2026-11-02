import { createContext } from "react";
import type { Post } from "./App";

export type PostContext = {
  selectedPost: Post | null;
  setSelectedPost: (post: Post) => void;
};

const PostContext = createContext<PostContext>({
  selectedPost: null,
  setSelectedPost: (post: Post) => {},
});

export default PostContext;
