import { useContext, useState } from "react";
import { socket } from "../socket";
import { MdOutlineEdit } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { IoIosAddCircleOutline } from "react-icons/io";
import type { Comment as CommentType, Post } from "../App";
import useSWR, { mutate } from "swr";
import ApiCall from "../apiCalls.ts";
import PostContext from "../PostContext.tsx";
import AuthContext from "../AuthContext.tsx";
import Comments from "./Comments.tsx";
import Votes from "./Votes.tsx";
import UserContext from "../UserContext.tsx";

function PostComponent({ post }: { post: Post }) {
  const voteValues = post.votes.map((vote) => (vote ? 1 : -1));
  const { selectedPost, setSelectedPost, toggleSelectedPost } =
    useContext(PostContext);

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

  const [selectedComment, setSelectedComment] = useState<CommentType | null>(
    null,
  );

  const toggleSelectedComment = (comment: CommentType | null) =>
    setSelectedComment(comment);

  const toggleEditingComment = (comment: CommentType | null) =>
    setEditingCommentId(comment ? comment.id : null);
  //
  // const updateSelectedComment = (editedText: string) => {
  //   setSelectedComment({ ...selectedComment, text: editedText });
  // };

  const { logout, isLoggedIn, login } = useContext(AuthContext);
  const { user } = useContext(UserContext);

  const addComment = async (formData: FormData) => {
    if (selectedComment) {
      try {
        const response = await ApiCall.commentOnComment(
          selectedComment.id,
          formData.get("comment")!.toString(),
        );

        if (response.status != 200) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        } else {
          mutate(import.meta.env.VITE_BACKEND_URL + "comments");
        }

        // NOTE: this functionality would be replaced with socketio
        // updateComments(selectedPost, {
        //   id: response.data.id,
        //   text: formData.get("comment"),
        //   postId: selectedPost.id,
        //   subComments: [""],
        //   selectedCommentId: selectedComment.id,
        //   User: { email },
        // });

        // successNotify("Successfully added comment!");
      } catch (e) {
        // errorNotify("Failed to add comment!");
        console.log(`Error adding comment: ${e}`);
      }
    } else {
      try {
        const response = await ApiCall.commentOnPost(
          post.id,
          formData.get("comment")!.toString(),
        );

        if (response.status != 200) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        } else {
          mutate(import.meta.env.VITE_BACKEND_URL + "posts");
        }

        // NOTE: this functionality would be replaced with socketio
        // updateComments(selectedPost, {
        //   id: response.data.id,
        //   text: formData.get("comment"),
        //   subComments: [""],
        //   postId: selectedPost.id,
        //   User: { email },
        // });

        // successNotify("Successfully added comment!");
      } catch (e) {
        // errorNotify("Failed to add comment!");
        console.log(`Error adding comment: ${e}`);
      }
    }
  };

  const editComment = async (formData: FormData) => {
    try {
      const response = await ApiCall.updateComment(
        editingCommentId!,
        formData.get("comment")!.toString(),
      );

      if (response.status != 200) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      } else {
        mutate(import.meta.env.VITE_BACKEND_URL + "comments");
      }

      // NOTE: this functionality would be replaced with socketio
      // updateComments(selectedPost, {
      //   id: response.data.id,
      //   text: formData.get("comment"),
      //   postId: selectedPost.id,
      //   subComments: [""],
      //   selectedCommentId: selectedComment.id,
      //   User: { email },
      // });

      // successNotify("Successfully edited comment!");
    } catch (e) {
      // errorNotify("Failed to edit comment!");
      console.log(`Error editing comment: ${e}`);
    }
  };

  return (
    <div>
      {selectedPost && <IoClose onClick={() => toggleSelectedPost(null)} />}
      <div onClick={() => setSelectedPost(post)}>
        <h4>{post.title}</h4>
        <p>{post.text}</p>
        {/* {post.user.id == user.id && <MdOutlineEdit />} */}

        <Votes post={post} comment={null} />
        {/* {might need to kick selectedPost in the cases where post is being showed outside of a Posts component} */}
        {selectedPost && post.comments && (
          <Comments
            postId={post.id}
            selectedComment={selectedComment}
            toggleEditingComment={toggleEditingComment}
            toggleSelectedComment={toggleSelectedComment}
          />
        )}
      </div>
      {!isLoggedIn ? (
        // <p className={text.italicText}>to join the conversation</p>

        <>
          <h1>Sign in</h1>
          <p>to join the conversation</p>
        </>
      ) : (
        selectedPost && (
          <form action={editingCommentId ? editComment : addComment}>
            <input
              type="text"
              name="comment"
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
