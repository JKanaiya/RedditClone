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
  const diff = Math.abs(now - oldDate) / 60 / 1000;

  console.log(comment);

  const editable =
    diff <= 30 && user.id == comment.userId && comment.text != deletedString;

  const deleteComment = async () => {
    try {
      const response = await ApiCall.deleteComment(comment.id);
      if (response.status != 200) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
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
            : "none",
      }}
    >
      <p
        style={{
          fontStyle: comment.text === deletedString ? "italic" : "none",
        }}
      >
        <h5>uc/{comment.User.name}</h5>
        {comment.text}
        {comment.edited && comment.text != deletedString && (
          <p style={{ fontStyle: "italic" }}>Edited</p>
        )}
      </p>
      <Votes post={null} comment={comment} />
      <GoReply onClick={() => toggleSelectedComment(comment)} />
      {user.id == comment.userId && comment.text != deletedString && (
        <MdDeleteOutline onClick={() => deleteComment()} />
      )}
      {editable && (
        <MdOutlineEdit onClick={() => toggleEditingComment(comment)} />
      )}
      {comment.subComments &&
        comment.subComments.map((comment: CommentType) => (
          <Comment
            comment={comment}
            offset={offset + 2}
            selectedComment={selectedComment}
            toggleEditingComment={toggleEditingComment}
            toggleSelectedComment={toggleSelectedComment}
            key={comment.id}
          />
        ))}
    </div>
  );
}

export default Comment;

// const Comments = ({
//   toggleSelectedComment,
//   selectedComment,
//   updateSelectedComment,
//   comment,
//   errorNotify,
//   successNotify,
//   mutate,
//   selectedPost,
//   updateComments,
// }) => {
//   const [open, setOpen] = useState(true);
//
//   const [editing, setEditing] = useState(false);
//
//   const { email } = useContext(AuthContext);
//
//   const deleteComment = async (commentId: number) => {
//     try {
//       const response = await ApiCall.deleteComment(commentId);
//
//       if (response.status != 200) {
//         throw new Error(`HTTP Error! Status: ${response.status}`);
//       }
//       successNotify("Comment deleted successfully");
//     } catch (e) {
//       errorNotify("Failed to delete comment!");
//
//       console.log(`Error deleting comment: ${e}`);
//     }
//   };
//
//   const updateComment = async (formData: FormData, comment: CommentType) => {
//     const editedText = formData.get("editedText");
//     try {
//       const response = await ApiCall.updateComment(
//         Number(formData.get("commentId")),
//         formData.get("editedText")!.toString(),
//       );
//
//       if (response.status != 200) {
//         throw new Error(`HTTP Error! Status: ${response.status}`);
//       }
//
//       toggleSelectedComment(comment);
//
//       updateSelectedComment({ editedText });
//
//       comment.text = formData.get("editedText")?.toString() || "";
//
//       mutate({ revalidate: true });
//
//       toggleEditing();
//
//       successNotify("Comment updated successfully");
//     } catch (e) {
//       errorNotify("Failed to update comment!");
//       console.log(`Error updating comment: ${e}`);
//     }
//   };
//
//   const toggleOpen = () => {
//     setOpen(!open);
//   };
//
//   const toggleEditing = () => {
//     setEditing(!open);
//   };
//
//   return (
//     <div key={comment.id}>
//       <div
//         className={comments.comment}
//         style={{
//           borderLeft:
//             selectedComment && comment.id === selectedComment.id
//               ? "1px solid oklch(50% 0.6 218)"
//               : "1px solid oklch(0.6424 0.032 260.37)",
//         }}
//       >
//         <div className={comments.content}>
//           <p className={comments.email}>{comment.User.email}</p>
//           {editing ? (
//             <form
//               action={(formData) => updateComment(formData, comment)}
//               className={comments.edit}
//             >
//               <input type="hidden" value={comment.id} name="commentId" />
//               <input
//                 type="text"
//                 name="editedText"
//                 defaultValue={comment.text}
//                 className={home.input}
//               />
//               <button
//                 className={home.button}
//                 type="submit"
//                 style={{ display: "flex" }}
//               >
//                 {/* <FaCheck className={icons.edit} /> */}
//               </button>
//             </form>
//           ) : (
//             <p className={text.baseText}>{comment.text}</p>
//           )}
//           {comment.edited && (
//             <p style={{ marginTop: 20, color: "grey", fontStyle: "italic" }}>
//               Edited
//             </p>
//           )}
//         </div>
//         <div className={comments.actions}>
//           {comment.User.email === email && (
//             <div className={comments.actions}>
//               <span
//                 onClick={() => deleteComment(comment.id)}
//                 className={icons.commentDelete}
//               >
//                 {/* <MdDeleteOutline /> */}
//               </span>
//               <span onClick={toggleEditing} className={icons.commentEdit}>
//                 {/* <FiEdit2 /> */}
//               </span>
//             </div>
//           )}
//           <div
//             style={{ fontSize: 20, color: "grey" }}
//             onClick={() => toggleSelectedComment(comment)}
//           >
//             {/* <GoReply /> */}
//           </div>
//         </div>
//         {/* <span onClick={toggleOpen} className={comments.expand}> */}
//         {/*   {!open ? <GoTriangleDown /> : <GoTriangleUp />} */}
//         {/* </span> */}
//       </div>
//       {comment.subComments &&
//         comment.subComments[0] != "" &&
//         comment.subComments.map((c) => {
//           return (
//             <div
//               key={c.id}
//               style={{
//                 display: open ? "block" : "none",
//                 paddingLeft: 25,
//               }}
//             >
//               <Comments
//                 toggleSelectedComment={toggleSelectedComment}
//                 selectedComment={selectedComment}
//                 updateSelectedComment={updateSelectedComment}
//                 comment={c}
//                 mutate={mutate}
//                 selectedPost={selectedPost}
//                 updateComments={updateComments}
//               />
//             </div>
//           );
//         })}
//     </div>
//   );
// };
//
// export default Comments;
