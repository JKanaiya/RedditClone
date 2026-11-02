import useSWR from "swr";
import { useNavigate } from "react-router";
import ApiCall from "../apiCalls";
import { useContext } from "react";
import UserContext from "../UserContext";
import type { Post, User } from "../App";
import PostComponent from "./Post";

function User() {
  const { user } = useContext(UserContext);
  const nav = useNavigate();
  const {
    data: posts,
    error,
    mutate,
    isLoading: loading,
  } = useSWR(
    import.meta.env.VITE_BACKEND_URL + "user-posts",
    ApiCall.getUserPosts,
  );

  if (loading) return <p>loading...</p>;
  if (error) nav("/error");

  return (
    <div>
      {user.name}
      {posts.map((post: Post) => (
        <PostComponent post={post} />
      ))}
    </div>
  );
}

export default User;
