import useSWR from "swr";
import axios from "axios";
import { useNavigate } from "react-router";
import type { Comment as CommentType } from "../App";
import Comment from "./Comment";

function Comments({
  postId,
  selectedComment,
  toggleEditingComment,
  toggleSelectedComment,
}: {
  postId: number;
  selectedComment: CommentType | null;
  toggleEditingComment: (comment: CommentType | null) => void;
  toggleSelectedComment: (comment: CommentType | null) => void;
}) {
  const token = localStorage.getItem("token");
  const nav = useNavigate();
  const getComments = async (url: string) => {
    const comments = await axios
      .get(url, {
        params: { postId: postId },
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch(function (err) {
        console.log(err);
        if (401 == err.response.status) {
          console.error("Unauthorized");
        }
        return err.response;
      });
    return comments.data;
  };

  const {
    data: comments,
    error,
    mutate,
    isLoading: loading,
  } = useSWR(import.meta.env.VITE_BACKEND_URL + "comments", getComments);

  if (loading) return <p>loading...</p>;
  if (error) nav("/error");

  return (
    <div>
      {comments &&
        comments.map((comment: CommentType) => (
          <Comment
            comment={comment}
            offset={25}
            selectedComment={selectedComment}
            toggleEditingComment={toggleEditingComment}
            toggleSelectedComment={toggleSelectedComment}
          />
        ))}
    </div>
  );
}

export default Comments;
