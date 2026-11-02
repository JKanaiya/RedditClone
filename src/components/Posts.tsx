import type { Post } from "../App.tsx";
import { useNavigate } from "react-router";
import axios from "axios";
import useSWR from "swr";
import PostComponent from "./Post.tsx";

function Posts({ subName }: { subName: string | null }) {
  const nav = useNavigate();
  const token = localStorage.getItem("token");

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const getPosts = async (url: string) => {
    const posts = await axios.get(url, config).catch(function (err) {
      console.log(err);
      if (401 == err.response.status) {
        console.error("Unauthorized");
      }
      return err.response;
    });
    console.log(posts);
    return posts.data;
  };

  const {
    data: posts,
    error,
    mutate,
    isLoading: loading,
  } = useSWR(import.meta.env.VITE_BACKEND_URL + "posts", getPosts);

  if (loading) return <p>loading...</p>;
  if (error) nav("/error");

  return (
    <div>
      {subName
        ? posts
            .filter((post: Post) => post.subReddit.name == subName)
            .map((post: Post) => <PostComponent post={post} key={post.id} />)
        : posts.map((post: Post) => (
            <PostComponent post={post} key={post.id} />
          ))}
    </div>
  );
}

export default Posts;
