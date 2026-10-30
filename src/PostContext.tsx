import { createContext } from "react";
import type { Post } from "./App";

export type PostContext = {
  post: Post | null;
};

const PostContext = createContext<PostContext>({
  post: null,
});

export default PostContext;
