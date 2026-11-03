import type { User } from "../App";
import PostComponent from "./Post";

function Profile({ user }: { user: User }) {
  return (
    <div>
      <h4>Posts</h4>
      {user.posts.map((post) => (
        <PostComponent post={post} />
      ))}
      <h4>Following</h4>
      {user.following.map((u) => (
        <li>
          {u.name}
          {u.email}
        </li>
      ))}
      <h4>Followers</h4>
      {user.followers.map((u) => (
        <li>
          {u.name}
          {u.email}
        </li>
      ))}
    </div>
  );
}

export default Profile;
