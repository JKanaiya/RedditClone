import { useContext, useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { RiSubredditFill } from "react-icons/ri";
import { socket } from "../socket";
import { MdOutlineEdit } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import type { Comment as CommentType, Post } from "../App";
import postStyle from "../styles/post.module.css";
import useSWR, { mutate } from "swr";
import ApiCall from "../apiCalls.ts";
import PostContext from "../PostContext.tsx";
import AuthContext from "../AuthContext.tsx";
import Comments from "./Comments.tsx";
import Votes from "./Votes.tsx";
import UserContext from "../UserContext.tsx";
import { supabase } from "../supabase.ts";
import SubRedditContext from "../SubredditContext.tsx";

function PostComponent({ post }: { post: Post }) {
  const voteValues = post.votes.map((vote) => (vote ? 1 : -1));
  const { selectedPost, setSelectedPost, toggleSelectedPost } =
    useContext(PostContext);

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

  const [selectedComment, setSelectedComment] = useState<CommentType | null>(
    null,
  );

  socket.on("connect_error", (err) => {
    // the reason of the error, for example "xhr poll error"
    console.log(err.message);

    // some additional description, for example the status code of the initial HTTP response
    console.log(err.description);

    // some additional context, for example the XMLHttpRequest object
    console.log(err.context);
  });

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, [selectedPost]);

  const toggleSelectedComment = (comment: CommentType | null) => {
    console.log(comment);

    setSelectedComment(comment);
  };

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
        socket.emit("comment-on-comment", {
          commentId: selectedComment.id,
          text: formData.get("comment")?.toString(),
        });
        // const response = await ApiCall.commentOnComment(
        //   selectedComment.id,
        //   formData.get("comment")!.toString(),
        // );
        //
        // if (response.status != 200) {
        //   throw new Error(`HTTP Error! Status: ${response.status}`);
        // } else {
        //   mutate(import.meta.env.VITE_BACKEND_URL + "comments");
        // }
        // successNotify("Successfully added comment!");
      } catch (e) {
        // errorNotify("Failed to add comment!");
        console.log(`Error adding comment: ${e}`);
      }
    } else {
      try {
        socket.emit("comment-on-post", {
          postId: post.id,
          text: formData.get("comment")?.toString(),
        });
        // const response = await ApiCall.commentOnPost(
        //   post.id,
        //   formData.get("comment")!.toString(),
        // );
        //
        // if (response.status != 200) {
        //   throw new Error(`HTTP Error! Status: ${response.status}`);
        // } else {
        //   mutate(import.meta.env.VITE_BACKEND_URL + "posts");
        // }
        // successNotify("Successfully added comment!");
      } catch (e) {
        // errorNotify("Failed to add comment!");
        console.log(`Error adding comment: ${e}`);
      }
    }
  };

  const editComment = async (formData: FormData) => {
    try {
      socket.emit("edit-comment", {
        commentId: editingCommentId,
        text: formData.get("comment")?.toString(),
      });
    } catch (e) {
      console.log(`Error editing comment: ${e}`);
    }
    // try {
    //   const response = await ApiCall.updateComment(
    //     editingCommentId!,
    //     formData.get("comment")!.toString(),
    //   );
    //
    //   if (response.status != 200) {
    //     throw new Error(`HTTP Error! Status: ${response.status}`);
    //   } else {
    //     mutate(import.meta.env.VITE_BACKEND_URL + "comments");
    //   }
    //
    //   // NOTE: this functionality would be replaced with socketio
    //   // updateComments(selectedPost, {
    //   //   id: response.data.id,
    //   //   text: formData.get("comment"),
    //   //   postId: selectedPost.id,
    //   //   subComments: [""],
    //   //   selectedCommentId: selectedComment.id,
    //   //   User: { email },
    //   // });
    //
    //   // successNotify("Successfully edited comment!");
    // } catch (e) {
    //   // errorNotify("Failed to edit comment!");
    //   console.log(`Error editing comment: ${e}`);
    // }
  };
  socket.on("updated-comments", () => {
    console.log("?");
    try {
      mutate(import.meta.env.VITE_BACKEND_URL + "comments");
    } catch (e) {
      console.log("error: " + e);
    }
  });

  debugger;
  const userImg =
    post.user.profileImageUrl &&
    supabase.storage
      .from("UserData")
      .getPublicUrl(
        post.user.email + "/profileImage/" + post.user.profileImageUrl!,
      );

  const postImg =
    post?.postImageUrl != null &&
    supabase.storage.from("UserData").getPublicUrl(post.postImageUrl);

  return (
    <div className={postStyle.section}>
      {selectedPost && <IoClose onClick={() => toggleSelectedPost(null)} />}
      <div
        onClick={() => setSelectedPost(post)}
        className={postStyle.component}
      >
        <div className={postStyle.details}>
          <h5
            style={{ display: "flex", alignItems: "center", columnGap: "5px" }}
            className={postStyle.h5}
          >
            <RiSubredditFill style={{ fontSize: "17.5px" }} />
            rc/{post.subReddit.name}
          </h5>
          <h5
            style={{ display: "flex", alignItems: "center", columnGap: "5px" }}
            className={postStyle.h5}
          >
            {userImg && userImg.data != null ? (
              <div
                style={{
                  fontSize: "17.5px",
                  minWidth: 20,
                  minHeight: 20,
                  backgroundSize: "cover",
                  borderRadius: "50%",
                  backgroundImage: `url(${userImg.data.publicUrl})`,
                }}
              />
            ) : (
              <CgProfile />
            )}
            uc/{post.user?.name}
          </h5>
        </div>
        <h4>{post.title}</h4>
        {selectedPost && <p>{post.text}</p>}
        {/* {post.user.id == user.id && <MdOutlineEdit />} */}
        {postImg && (
          <div
            className={postStyle.image}
            style={{
              backgroundImage: `url(${postImg.data.publicUrl})`,
              backgroundSize: "cover",
            }}
          ></div>
        )}

        <div className={postStyle.metaData}>
          {/* these would have a container that is a lighter color, it should follow  */}
          {/* that they would have the same css attributer */}
          <span className={postStyle.metaDataContainer}>
            <Votes post={post} comment={null} />
          </span>
          <span className={postStyle.metaDataContainer}>
            <FaRegComment /> {post.comments.length}
          </span>
        </div>
        {/* {might need to kick selectedPost in the cases where post is being showed outside of a Posts component} */}
        {selectedPost && post.comments && (
          <Comments
            postId={post.id}
            selectedComment={selectedComment}
            toggleEditingComment={toggleEditingComment}
            toggleSelectedComment={toggleSelectedComment}
          />
        )}
        {!selectedPost && (
          <hr style={{ height: 2, border: 0, background: "#333" }} />
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
