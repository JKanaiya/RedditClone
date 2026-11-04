import { useContext, useState } from "react";
import type { Comment as CommentType, Post } from "../App";
import useSWR from "swr";
import ApiCall from "../apiCalls.ts";
import Comment from "./Comment.tsx";
import PostContext from "../PostContext.tsx";
import AuthContext from "../AuthContext.tsx";

function PostComponent({ post }: { post: Post }) {
  const voteValues = post.votes.map((vote) => (vote ? 1 : -1));
  const votes = voteValues.reduce((acc, curr) => acc + curr, 0);
  const { selectedPost, setSelectedPost, toggleSelectedPost } =
    useContext(PostContext);

  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

  // const toggleSelectedComment = (comment: CommentType) =>
  //   setSelectedComment(comment);
  //
  // const updateSelectedComment = (editedText: string) => {
  //   setSelectedComment({ ...selectedComment, text: editedText });
  // };

  const { logout, isLoggedIn, login, user } = useContext(AuthContext);

  // TODO: this should be an alernate return based on the existing selected post. the swr should be calling a getComments (based on this post's id)
  // i will replace this and add its relating functions in the api, and apiCalls.
  // this should allow me to call mutate() specifically on these comments, removing the need to find a comment recursively

  if (selectedPost) {
    const {
      data: postComments,
      error,
      mutate,
      isLoading: loading,
    } = useSWR(import.meta.env.VITE_BACKEND_URL, ApiCall.getPosts);

    if (loading) return <p>loading...</p>;
    if (error) nav("/error");
  }

  const addComment = async (formData: FormData) => {
    if (selectedComment) {
      try {
        const response = await ApiCall.createComment({
          comment: formData.get("comment"),
          postId: null,
          commentId: selectedComment.id,
          email,
        });

        if (!response.status == 200) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        updateComments(selectedPost, {
          id: response.data.id,
          text: formData.get("comment"),
          postId: selectedPost.id,
          subComments: [""],
          selectedCommentId: selectedComment.id,
          User: { email },
        });

        successNotify("Successfully added comment!");
      } catch (e) {
        errorNotify("Failed to add comment!");
        console.log(`Error adding comment: ${e}`);
      }
    } else {
      try {
        const response = await ApiCall.createComment({
          comment: formData.get("comment"),
          postId: selectedPost.id,
          email,
        });

        if (!response.status == 200) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        updateComments(selectedPost, {
          id: response.data.id,
          text: formData.get("comment"),
          subComments: [""],
          postId: selectedPost.id,
          User: { email },
        });

        successNotify("Successfully added comment!");
      } catch (e) {
        errorNotify("Failed to add comment!");
        console.log(`Error adding comment: ${e}`);
      }
    }
  };

  return (
    <div>
      {selectedPost && (
        <button onClick={() => toggleSelectedPost(null)}>back to posts</button>
      )}
      <div onClick={() => setSelectedPost(post)}>
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
      {isLoggedIn ? (
        // <p className={text.italicText}>to join the conversation</p>

        <>
          <h1>Sign in</h1>
          <p>to join the conversation</p>
        </>
      ) : (
        selectedPost && (
          <form action={addComment} className={home.addComment}>
            <input
              type="text"
              name="comment"
              className={home.input}
              id=""
              placeholder="Share your thoughts"
            />
            <button type="submit">
              <IoIosAddCircleOutline />
            </button>
          </form>
        )
      )}
    </div>
  );
}

export default PostComponent;
