import type { Post, SubReddit } from "../App.tsx";
import { IoClose } from "react-icons/io5";
import { useContext } from "react";
import UserContext from "../UserContext.tsx";
import { useNavigate } from "react-router";
import useSWR from "swr";
import PostComponent from "./Post.tsx";
import ApiCall from "../apiCalls.ts";
import SubRedditContext from "../SubredditContext.tsx";

function Posts({
  subId,
  subName,
  filterByFollowing,
  toggleSelctedSubreddit,
  filter,
}: {
  subId: number | undefined;
  subName: string | undefined;
  filterByFollowing: boolean;
  toggleSelctedSubreddit: (subReddit: SubReddit | null) => void;
  filter: string;
}) {
  const nav = useNavigate();
  const { user } = useContext(UserContext);

  const { setSelectedSubreddit, selectedSubreddit } =
    useContext(SubRedditContext);

  const {
    data: posts,
    error,
    mutate,
    isLoading: loading,
  } = useSWR(import.meta.env.VITE_BACKEND_URL, ApiCall.getPosts);

  if (loading) return <p>loading...</p>;
  if (error) nav("/error");

  if (subId != undefined) {
    return (
      <div>
        {subName && (
          <div>
            <IoClose onClick={() => setSelectedSubreddit(null)} />
            <h3>r/{subName}</h3>
          </div>
        )}
        {filter
          ? posts
              .filter((post: Post) => post.subRedditId == subId)
              .filter(
                (post: Post) =>
                  post.text.toLowerCase().includes(filter.toLowerCase()) ||
                  post.title.toLowerCase().includes(filter.toLowerCase()),
              )
              .map((post: Post) => <PostComponent post={post} key={post.id} />)
          : posts
              .filter((post: Post) => post.subRedditId == subId)
              .map((post: Post) => <PostComponent post={post} key={post.id} />)}
      </div>
    );
  } else if (filterByFollowing) {
    const follPosts = posts.filter((post: Post) => {
      for (let foll in user?.followers) {
        console.log(foll);
        if (post.user.id == foll.id) {
          return true;
        } else return false;
      }
    });
    return (
      <div>
        {filter
          ? follPosts
              .filter(
                (post: Post) =>
                  post.text.toLowerCase().includes(filter.toLowerCase()) ||
                  post.title.toLowerCase().includes(filter.toLowerCase()),
              )
              .map((post: Post) => <PostComponent post={post} key={post.id} />)
          : follPosts.map((post: Post) => (
              <PostComponent post={post} key={post.id} />
            ))}
      </div>
    );
  } else {
    return (
      <div>
        {filter
          ? posts
              .filter(
                (post: Post) =>
                  post.text.toLowerCase().includes(filter.toLowerCase()) ||
                  post.title.toLowerCase().includes(filter.toLowerCase()),
              )
              .map((post: Post) => <PostComponent post={post} key={post.id} />)
          : posts.map((post: Post) => (
              <PostComponent post={post} key={post.id} />
            ))}
      </div>
    );
  }
}

export default Posts;
