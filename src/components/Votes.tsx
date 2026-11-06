import { useContext, useState } from "react";
import { BiUpvote, BiSolidUpvote } from "react-icons/bi";
import vote from "../styles/votes.module.css";
import type { Comment, Post, Vote } from "../App";
import UserContext from "../UserContext";
import { useNavigate } from "react-router";

function Votes({
  post,
  comment,
}: {
  post: Post | null;
  comment: Comment | null;
}) {
  const { user } = useContext(UserContext);
  // NOTE: this would need the apicall to vote on the comment/post
  // const [votes, setVotes] = useState<number | null>(null);
  // const [userVote, setUserVotes] = useState<Vote | null>(null);

  const userVote = post
    ? post.votes.find((obj) => obj.userId == user.id)
    : comment.votes.find((obj) => obj.userId == user.id);

  const voteValues = post
    ? post.votes.map((vote) => (vote ? 1 : -1))
    : comment.votes.map((vote) => (vote ? 1 : -1));
  const votes = voteValues.reduce((acc, curr) => acc + curr, 0);

  const nav = useNavigate();

  return (
    <div className={vote.container}>
      {userVote ? (
        userVote.positive == true ? (
          <>
            <BiSolidUpvote style={{ color: "orange" }} />
            <p>{votes}</p>
            <BiUpvote style={{ rotate: "180deg" }} />
          </>
        ) : (
          <>
            <BiUpvote />
            <p>{votes}</p>
            <BiSolidUpvote style={{ rotate: "180deg", color: "orange" }} />
          </>
        )
      ) : (
        <>
          <BiUpvote />
          <p>{votes}</p>
          <BiUpvote
            style={{
              rotate: "180deg",
            }}
          />
        </>
      )}
    </div>
  );
}

export default Votes;
