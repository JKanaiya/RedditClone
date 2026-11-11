import type { Comment as CommentType } from "../App";
import { GoReply } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";
import { useContext, useState } from "react";
// import comments from "../styles/comments.module.css";
// import text from "../styles/text.module.css";
// import home from "../styles/home.module.css";
// import icons from "../styles/icons.module.css";
// import { GoTriangleUp } from "react-icons/go";
// import { GoTriangleDown } from "react-icons/go";
// import { MdDeleteOutline } from "react-icons/md";
// import { FaCheck } from "react-icons/fa6";
// import { GoReply } from "react-icons/go";
// import { FiEdit2 } from "react-icons/fi";
import AuthContext from "../AuthContext";
import ApiCall from "../apiCalls";
import Votes from "./Votes";
import UserContext from "../UserContext";
import { mutate } from "swr";

function Comment({
  comment,
  offset,
  toggleEditingComment,
  selectedComment,
  toggleSelectedComment,
}: {
  comment: CommentType;
  offset: number;
  selectedComment: CommentType | null;
  toggleEditingComment: (comment: CommentType | null) => void;
  toggleSelectedComment: (comment: CommentType | null) => void;
}) {
  const { user } = useContext(UserContext);

  const now = new Date();
  const deletedString = "Comment has been deleted.";
  const oldDate = new Date(comment?.created);
  // TODO change the logic here to grant the user the ability to
  // edit comments at any time, but the diff should determine whether the
  // comment should include 'edited'
  const diff = Math.abs(now - oldDate) / 60 / 1000;

  const editable =
    diff <= 30 && user.id == comment.userId && comment.text != deletedString;

  const deleteComment = async () => {
    try {
      const response = await ApiCall.deleteComment(comment.id);
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
      // errorNotify("Failed to delete comment!");
      console.log(`Error deleting comment: ${e}`);
    }
  };
  return (
    <div
      style={{
        paddingLeft: offset,
        backgroundColor:
          selectedComment && selectedComment.id == comment.id
            ? "green"
            : "white",
      }}
    >
      <h5
        style={{
          fontStyle: comment.text === deletedString ? "italic" : "none",
        }}
      >
        <p>uc/{comment.User.name}</p>
        {comment.text}
        {comment.edited && comment.text != deletedString && (
          <p style={{ fontStyle: "italic" }}>Edited</p>
        )}
      </h5>
      <Votes post={null} comment={comment} />
      <GoReply onClick={() => toggleSelectedComment(comment)} />
      {user!.id == comment.userId && comment.text != deletedString && (
        <MdDeleteOutline onClick={() => deleteComment()} />
      )}
      {editable && (
        <MdOutlineEdit onClick={() => toggleEditingComment(comment)} />
      )}
      {comment.subComments &&
        comment.subComments.map((c: CommentType) => (
          <Comment
            comment={c}
            offset={offset + 2}
            selectedComment={selectedComment}
            toggleEditingComment={toggleEditingComment}
            toggleSelectedComment={toggleSelectedComment}
            key={c.id}
          />
        ))}
    </div>
  );
}

export default Comment;
