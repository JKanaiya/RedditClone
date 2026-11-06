import { useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import type { User } from "../App";
import profile from "../styles/profile.module.css";
import PostComponent from "./Post";

function Profile({
  user,
  toggleSelectedUser,
}: {
  user: User;
  toggleSelectedUser: (user: User | null) => void;
}) {
  const [selectedSection, setSelectedSection] = useState<string | null>(
    "posts",
  );

  const isSelected = (section: string) => section == selectedSection;

  return (
    <div>
      <section className={profile.userBar}>
        <IoMdCloseCircleOutline onClick={() => toggleSelectedUser(null)} />
        <h3>uc/{user.name}</h3>
      </section>
      {window.innerWidth < 800 && (
        <div className={profile.sectionSelection}>
          <h4
            style={{ color: isSelected("posts") ? "orange" : "black" }}
            onClick={() => setSelectedSection("posts")}
          >
            Posts
          </h4>
          <h4
            style={{ color: isSelected("following") ? "orange" : "black" }}
            onClick={() => setSelectedSection("following")}
          >
            Following
          </h4>
          <h4
            style={{ color: isSelected("followers") ? "orange" : "black" }}
            onClick={() => setSelectedSection("followers")}
          >
            Followers
          </h4>
        </div>
      )}
      {/* change the format from (following aside | posts |  followers aside) to ( option posts OR option followers OR option following) depending on screenwidth */}
      {window.innerWidth < 800 ? (
        selectedSection == "followers" ? (
          user.followers.map((u) => (
            <li>
              <p>Name: {u.name}</p>
              <p>Email: {u.email}</p>
            </li>
          ))
        ) : selectedSection == "following" ? (
          user.following.map((u) => (
            <li>
              <p>Name: {u.name}</p>
              <p>Email: {u.email}</p>
            </li>
          ))
        ) : (
          <section className={profile.posts}>
            {user.posts.map((post) => (
              <PostComponent post={post} />
            ))}
          </section>
        )
      ) : (
        <div className={profile.container}>
          <h4>Posts</h4>
          <section className={profile.posts}>
            {user.posts.map((post) => (
              <PostComponent post={post} />
            ))}
          </section>
          <aside className={profile.following}>
            <h4>Following</h4>
            {user.following.map((u) => (
              <li>
                <p>Name: {u.name}</p>
                <p>Email: {u.email}</p>
              </li>
            ))}
          </aside>
          <aside className={profile.followers}>
            <h4>Followers</h4>
            {user.followers.map((u) => (
              <li>
                <p>Name: {u.name}</p>
                <p>Email: {u.email}</p>
              </li>
            ))}
          </aside>
        </div>
      )}
    </div>
  );
}

export default Profile;
