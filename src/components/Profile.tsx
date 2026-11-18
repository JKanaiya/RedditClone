import { useContext, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaRegCircleCheck, FaCheck } from "react-icons/fa6";
import { FiEdit2 } from "react-icons/fi";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { RiUserUnfollowFill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { IoMdCloseCircleOutline } from "react-icons/io";
import type { Post, User } from "../App";
import profile from "../styles/profile.module.css";
import icons from "../styles/icons.module.css";
import PostComponent from "./Post";
import UserContext from "../UserContext";
import type { FocusType } from "./Home";
import ApiCall from "../apiCalls";
import { mutate } from "swr";
import { supabase } from "../supabase";

function Profile({
  user,
  toggleFocus,
  toggleSelectedUser,
}: {
  user: User;
  toggleSelectedUser: (user: User | null) => void;
  toggleFocus: (focus: FocusType) => void;
}) {
  const [selectedSection, setSelectedSection] = useState<string | null>(
    "posts",
  );
  const deletedString = "Post has been deleted.";
  const [editing, setEditing] = useState(false);

  const specEmail = localStorage.getItem("spec_email");
  const email = specEmail ? specEmail : localStorage.getItem("email");

  const { user: loggedInUser, upsertUser } = useContext(UserContext);

  const unfollowUser = async (otherUserId: number) => {
    try {
      const response = await ApiCall.unfollowUser(otherUserId);
      if (response.status != 200) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
    } catch (e) {
      // errorNotify("Failed to add comment!");
      console.log(`Error unfollowing user: ${e}`);
    }
  };

  const acceptFollowRequest = async (follReqId: number) => {
    try {
      const response = await ApiCall.acceptFollowRequest(follReqId);
      if (response.status != 200) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
    } catch (e) {
      // errorNotify("Failed to add comment!");
      console.log(`Error accpeting follow request: ${e}`);
    }
  };

  const denyFollowRequest = async (follReqId: number) => {
    try {
      const response = await ApiCall.rejectFollowRequest(follReqId);
      if (response.status != 200) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
    } catch (e) {
      // errorNotify("Failed to add comment!");
      console.log(`Error rejecting follow request, nothing was changed: ${e}`);
    }
  };

  const updateUserName = async (formData: FormData) => {
    try {
      const response = await ApiCall.updateUserName(formData);
      if (response.status != 200) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      } else {
        mutate(import.meta.env.VITE_BACKEND_URL + "posts");
      }
    } catch (e) {
      // errorNotify("Failed to add comment!");
      console.log(`Error updating user name: ${e}`);
    }
  };

  const deletePost = async (postId: number) => {
    try {
      const response = await ApiCall.deletePost(postId);
      if (response.status != 200) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      } else {
        mutate(import.meta.env.VITE_BACKEND_URL + "posts");
      }
    } catch (e) {
      // errorNotify("Failed to add comment!");
      console.log(`Error updating post: ${e}`);
    }
  };

  const updateProfileImage = async (e) => {
    const now = new Date();
    const newProfileImageUrl = now.toISOString();

    if (user.profileImageUrl) {
      const { data, error } = await supabase.storage
        .from("UserData")
        .remove([`${email}/profileImage/${user.profileImageUrl}`]);

      error ? console.log("Err" + error) : console.log("Data" + data);
    }

    const response = await ApiCall.setProfileImage(`${newProfileImageUrl}`);

    if (response.status != 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    } else {
      const { data, error } = await supabase.storage
        .from("UserData")
        .upload(
          `${email}/profileImage/${newProfileImageUrl}`,
          e.target.files[0],
          {
            contentType: "image/png",
            cacheControl: "3600",
          },
        );
      const updatedUser = { ...user, profileImageUrl: newProfileImageUrl };
      error ? console.log("Err" + error) : upsertUser(updatedUser);
    }
  };

  const userFollowing = () => {
    if (loggedInUser?.following.length != 0) {
      for (let foll in loggedInUser?.following) {
        if (foll.id == loggedInUser.id) {
          return true;
        } else return false;
      }
    }
  };

  const editablePost = (post: Post) =>
    post.text != deletedString && post.title != deletedString;

  // TODO figure this out
  const userImg =
    user.profileImageUrl != null &&
    supabase.storage
      .from("UserData")
      .getPublicUrl(email + "/profileImage/" + user.profileImageUrl!);

  const toggleEditing = () => {
    setEditing(editing ? false : true);
  };

  const isSelected = (section: string) => section == selectedSection;

  const followingWithRequests = (user: User) => {
    if (user.followRequests && user.id == loggedInUser.id) {
      return (
        <div>
          {user.followRequests.map((u) => (
            <li>
              <p>Name: {u.sender.name}</p>
              <p>Email: {u.sender.email}</p>
              <FaRegCircleCheck onClick={() => acceptFollowRequest(u.id)} />
              <IoClose onClick={() => denyFollowRequest(u.id)} />
            </li>
          ))}
          {user.followers.map((u) => (
            <li>
              <p>Name: {u.name}</p>
              <p>Email: {u.email}</p>
            </li>
          ))}
        </div>
      );
    } else {
      <div>
        {user.followers.map((u) => (
          <li>
            <p>Name: {u.name}</p>
            <p>Email: {u.email}</p>
          </li>
        ))}
      </div>;
    }
  };

  return (
    <div className={profile.page}>
      <section className={profile.userBar}>
        <IoClose
          style={{ color: "oklch(0.5845 0.2024 35.53)", width: 25, height: 25 }}
          onClick={() => toggleSelectedUser(null)}
        />
        {user.id == loggedInUser.id ? (
          <div className={profile.userContainer}>
            <label htmlFor="upload file">
              {userImg.data != null ? (
                <div
                  className={profile.editImage}
                  style={{
                    backgroundImage: `url(${userImg.data.publicUrl})`,
                  }}
                >
                  <FiEdit2 />
                </div>
              ) : (
                <CgProfile className={profile.editImage} />
              )}
            </label>
            <input
              id="upload file"
              type="file"
              name="uploaded_file"
              onChange={updateProfileImage}
              placeholder=""
              style={{ display: "none" }}
            />
            {editing ? (
              <form action={updateUserName}>
                <input type="text" name="editedName" defaultValue={user.name} />
                <button type="submit" style={{ display: "flex" }}>
                  <FaCheck className={icons.edit} />
                </button>
              </form>
            ) : (
              <h3>uc/{user.name}</h3>
            )}
            {user.id == loggedInUser!.id && (
              <span onClick={toggleEditing} className={icons.commentEdit}>
                <FiEdit2 />
              </span>
            )}
          </div>
        ) : (
          <div className={profile.bar}>
            <div className={profile.userContainer}>
              {userImg.data != null ? (
                <div
                  className={profile.nonUserProfileImage}
                  style={{
                    backgroundImage: `url(${userImg.data.publicUrl})`,
                  }}
                >
                  <FiEdit2 />
                </div>
              ) : (
                <CgProfile className={profile.nonUserProfileImage} />
              )}
              <h3>uc/{user.name}</h3>
            </div>
            {!userFollowing() ? (
              <button className={profile.followButton}>Follow</button>
            ) : (
              <button
                className={profile.followButton}
                style={{ backgroundColor: "oklch(0.3109 0.0131 229.38)" }}
              >
                Following
              </button>
            )}
          </div>
        )}
      </section>
      {window.innerWidth < 800 && (
        <div className={profile.sectionSelection}>
          <h4
            style={{
              color: isSelected("posts")
                ? "oklch(0.5845 0.2024 35.53)"
                : "oklch(85% 0 90)",
            }}
            onClick={() => setSelectedSection("posts")}
          >
            Posts
          </h4>
          <h4
            style={{
              color: isSelected("following")
                ? "oklch(0.5845 0.2024 35.53)"
                : "oklch(85% 0 90)",
            }}
            onClick={() => setSelectedSection("following")}
          >
            Following
          </h4>
          <h4
            style={{
              color: isSelected("followers")
                ? "oklch(0.5845 0.2024 35.53)"
                : "oklch(85% 0 90)",
            }}
            onClick={() => setSelectedSection("followers")}
          >
            Followers
          </h4>
        </div>
      )}
      {/* change the format from (following aside | posts |  followers aside) to ( option posts OR option followers OR option following) depending on screenwidth */}
      {window.innerWidth < 800 ? (
        selectedSection == "followers" ? (
          followingWithRequests(user)
        ) : selectedSection == "following" ? (
          user.following.map((u) => (
            <li style={{ fontWeight: "bold" }}>
              <span
                style={{
                  color: "oklch(0.5845 0.2024 35.53)",
                }}
              >
                uc/
              </span>
              {u.name}
              {user.id == loggedInUser.id && <RiUserUnfollowFill />}
            </li>
          ))
        ) : (
          <section className={profile.posts}>
            {user.posts.map((post) => (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <PostComponent post={post} />
                <span
                  style={{
                    minHeight: 100,
                    display: "flex",
                    fontSize: "1.3rem",
                    flexDirection: "column",
                    justifyContent: "space-around",
                  }}
                >
                  <MdOutlineEdit
                    onClick={() => toggleFocus({ active: true, post: post })}
                  />
                  {editablePost(post) && (
                    <MdDeleteOutline onClick={() => deletePost(post.id)} />
                  )}
                </span>
              </span>
            ))}
          </section>
        )
      ) : (
        <div className={profile.container}>
          <aside className={profile.following}>
            <h4>Following</h4>
            {user.following.map((u) => (
              <li style={{ fontWeight: "bold" }}>
                <span
                  style={{
                    color: "oklch(0.5845 0.2024 35.53)",
                  }}
                >
                  uc/
                </span>
                {u.name}
                {user.id == loggedInUser.id && <RiUserUnfollowFill />}
              </li>
            ))}
          </aside>
          <section className={profile.posts}>
            <h4>Posts</h4>
            {loggedInUser.id == user.id
              ? user.posts.map((post) => (
                  <span className={profile.postContainer}>
                    <PostComponent post={post} />
                    <span
                      style={{
                        minHeight: 100,
                        display: "flex",
                        fontSize: "1.3rem",
                        flexDirection: "column",
                        justifyContent: "space-around",
                      }}
                    >
                      {editablePost(post) && (
                        <>
                          <MdDeleteOutline
                            onClick={() => deletePost(post.id)}
                          />
                          <MdOutlineEdit
                            onClick={() =>
                              toggleFocus({ active: true, post: post })
                            }
                          />
                        </>
                      )}
                    </span>
                  </span>
                ))
              : user.posts.map((post) => (
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexDirection: "column",
                    }}
                  >
                    <PostComponent post={post} />
                  </span>
                ))}
          </section>
          <aside className={profile.followers}>
            <h4>Followers</h4>
            {user.followers.map((u) => (
              <li style={{ fontWeight: "bold" }}>
                <p>
                  <span
                    style={{
                      color: "oklch(0.5845 0.2024 35.53)",
                    }}
                  >
                    uc/
                  </span>
                  {u.name}
                </p>
              </li>
            ))}
          </aside>
        </div>
      )}
    </div>
  );
}

export default Profile;
