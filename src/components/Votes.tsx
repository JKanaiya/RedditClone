import { useContext, useState } from "react";
import { BiUpvote, BiSolidUpvote } from "react-icons/bi";
import vote from "../styles/votes.module.css";
import type { Comment, Post, Vote } from "../App";
import UserContext from "../UserContext";
import ApiCall from "../apiCalls";

function Votes({
  post,
  comment,
}: {
  post: Post | null;
  comment: Comment | null;
}) {
  const { user } = useContext(UserContext);

  const userVote = post
    ? post.votes.find((obj) => obj.userId == user.id)
    : comment
      ? comment.votes.find((obj) => obj.userId == user.id)
      : [];

  const voteValues = post
    ? post.votes.map((vote) => (vote.positive ? 1 : -1))
    : comment
      ? comment.votes.map((vote) => (vote.positive ? 1 : -1))
      : [];

  const votes = voteValues.reduce((acc, curr) => acc + curr, 0);

  const updateVote = async (positive: boolean) => {
    if (post) {
      const userVote = post.votes.find((vote) => vote.userId == user.id);
      if (userVote && userVote?.positive == positive) {
        await ApiCall.deleteVote(null, post.id);
      } else {
        const vote = await ApiCall.voteOnPost(post.id, positive);
        console.log(vote);
      }
    } else if (comment) {
      const userVote = comment.votes.find((vote) => vote.userId == user.id);
      if (userVote && userVote?.positive == positive) {
        await ApiCall.deleteVote(comment.id, null);
      } else {
        const vote = await ApiCall.voteOnComment(comment.id, positive);
        console.log(vote);
      }
    }
  };

  return (
    <div className={vote.container}>
      {userVote ? (
        userVote.positive == true ? (
          <>
            <BiSolidUpvote
              style={{ color: "orange" }}
              onClick={() => updateVote(true)}
            />
            <p>{votes}</p>
            <BiUpvote
              style={{ rotate: "180deg" }}
              onClick={() => updateVote(false)}
            />
          </>
        ) : (
          <>
            <BiUpvote onClick={() => updateVote(true)} />
            <p>{votes}</p>
            <BiSolidUpvote
              style={{ rotate: "180deg", color: "orange" }}
              onClick={() => updateVote(false)}
            />
          </>
        )
      ) : (
        <>
          <BiUpvote onClick={() => updateVote(true)} />
          <p>{votes}</p>
          <BiUpvote
            style={{
              rotate: "180deg",
            }}
            onClick={() => updateVote(false)}
          />
        </>
      )}
    </div>
  );
}

export default Votes;
