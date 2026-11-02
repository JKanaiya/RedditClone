import { useContext } from "react";
import type { Post } from "../App";
import Comment from "./Comment.tsx";
import PostContext from "../PostContext.tsx";

function PostComponent({ post }: { post: Post }) {
  const voteValues = post.votes.map((vote) => (vote ? 1 : -1));
  const votes = voteValues.reduce((acc, curr) => acc + curr, 0);
  const { selectedPost } = useContext(PostContext);
  return (
    <div>
      <h4>{post.title}</h4>
      {post.text}
      {post.text}
      {votes}
      {/* {might need to kick selectedPost in the cases where post is being showed outside of a Posts component} */}
      {selectedPost &&
        post.comments &&
        post.comments.map((comment) => (
          <Comment comment={comment} selectedPost={selectedPost} />
        ))}
    </div>
  );
}

export default PostComponent;
