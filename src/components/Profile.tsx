import { useContext, useState } from "react";
import { FaRegCircleCheck, FaCheck } from "react-icons/fa6";
import { FiEdit2 } from "react-icons/fi";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { RiUserUnfollowFill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { IoMdCloseCircleOutline } from "react-icons/io";
import type { User } from "../App";
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
  const { user: loggedInUser, upsertUser } = useContext(UserContext);

  const [editing, setEditing] = useState(false);
  const [file, setFile] = useState<null | File>(null);

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

  const followingWithRequests = (user: User) => {
    if (user.followRequests) {
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

  const specEmail = localStorage.getItem("spec_email");
  const email = specEmail ? specEmail : localStorage.getItem("email");

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

    setFile(e.target.files[0]);
    if (user.profileImageUrl) {
      const { data, error } = await supabase.storage
        .from("userData")
        .remove([`${email}/profileImage/${user.profileImageUrl}`]);

      error ? console.log("Err" + error) : console.log("Data" + data);
    }

    const response = await ApiCall.setProfileImage(`${newProfileImageUrl}`);

    if (response.status != 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    } else {
      const { data, error } = await supabase.storage
        .from("userData")
        .upload(`${email}/profileImage/${newProfileImageUrl}`, file, {
          contentType: "image/png",
        });
      const updatedUser = { ...user, profileImageUrl: newProfileImageUrl };
      error ? console.log("Err" + error) : upsertUser(updatedUser);
    }
  };

  // TODO figure this out
  const userImg =
    user.profileImageUrl != null &&
    supabase.storage
      .from("userData")
      .getPublicUrl(email + "/profileImage/" + user.profileImageUrl!);

  const toggleEditing = () => {
    setEditing(editing ? false : true);
  };

  const isSelected = (section: string) => section == selectedSection;

  return (
    <div>
      <section className={profile.userBar}>
        <IoMdCloseCircleOutline onClick={() => toggleSelectedUser(null)} />
        <label htmlFor="upload file">
          <div
            className={profile.editImage}
            // this section needs to wait for the existence of an actual profile image
            style={{ backgroundImage: `url(${userImg.data.publicUrl})` }}
          >
            {/* <img src={userImg.data.publicUrl} style={{ borderRadius: "50%" }} /> */}
            <FiEdit2 />
          </div>
        </label>
        <input
          id="upload file"
          type="file"
          name="uplaoded_file"
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
          followingWithRequests(user)
        ) : selectedSection == "following" ? (
          user.following.map((u) => (
            <li>
              <p>Name: {u.name}</p>
              <p>Email: {u.email}</p>
              <RiUserUnfollowFill />
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
            {loggedInUser.id == user.id
              ? user.posts.map((post) => (
                  <>
                    <PostComponent post={post} />
                    <MdOutlineEdit
                      onClick={() => toggleFocus({ active: true, post: post })}
                    />
                    <MdDeleteOutline onClick={() => deletePost(post.id)} />
                  </>
                ))
              : user.posts.map((post) => <PostComponent post={post} />)}
          </section>
          <aside className={profile.following}>
            <h4>Following</h4>
            {user.following.map((u) => (
              <li>
                <p>Name: {u.name}</p>
                <p>Email: {u.email}</p>
                <RiUserUnfollowFill onClick={() => unfollowUser(u.id)} />
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
