import ApiCall from "../apiCalls";
import PostComponent from "./Post.tsx";
import type { Post, User } from "../App";
import useSWR from "swr";
import { useContext } from "react";
import UserContext from "../UserContext.tsx";

function PostFilter({
  subName,
  filterByFollowing,
  filterUser,
}: {
  subName: string | null;
  filterByFollowing: boolean;
  filterUser: User | null;
}) {
  const { user } = useContext(UserContext);
  const {
    data: posts,
    error,
    mutate,
    isLoading: loading,
  } = useSWR(import.meta.env.VITE_BACKEND_URL, ApiCall.getPosts);

  if (subName) {
    return (
      <div>
        {posts
          .filter((post: Post) => post.subReddit.name == subName)
          .map((post: Post) => (
            <PostComponent post={post} />
          ))}
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
        {follPosts.map((post: Post) => (
          <PostComponent post={post} />
        ))}
      </div>
    );
  } else if (filterUser) {
    return <div></div>;
  }
}

export default PostFilter;
