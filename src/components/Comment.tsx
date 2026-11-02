import type { Comment } from "../App";

function Comment({ comment }: { comment: Comment }) {
  return (
    <div>
      {comment.text}
      {comment.userId}
    </div>
  );
}

export default Comment;
