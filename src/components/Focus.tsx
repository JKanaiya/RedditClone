import type { Post, SubReddit } from "../App";
import { IoIosAddCircleOutline } from "react-icons/io";
import type { FocusType } from "./Home";
import { FiEdit2 } from "react-icons/fi";
import home from "../styles/home.module.css";
import { IoClose } from "react-icons/io5";
import ApiCall from "../apiCalls";
import { useForm } from "react-hook-form";
import { mutate } from "swr";
import { useState, type InputEventHandler } from "react";
import { supabase } from "../supabase";
import { SiEclipseide } from "react-icons/si";

function Focus({
  editingPost,
  toggleFocus,
  subreddits,
}: {
  editingPost: Post | null;
  toggleFocus: (focus: FocusType) => void;
  subreddits: SubReddit[];
}) {
  const [file, setFile] = useState<null | File>(null);
  // TODO this is not doing, or being used for what it says it is
  const [postImageUrl, setPostImageUrl] = useState<null | string>(null);
  const specEmail = localStorage.getItem("spec_email");
  const email = specEmail ? specEmail : localStorage.getItem("email");

  const setPImgUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target);

    setPostImageUrl(e.target.files[0]);
    setFile(e.target.files[0]);
  };

  const updatePost = async (formData: FormData) => {
    try {
      const response = await ApiCall.updatePost(
        editingPost!.id,
        formData.get("text")?.toString(),
        formData.get("title")?.toString(),
      );
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

  const createPost = async (formData: FormData) => {
    const now = new Date();
    const newPostImageUrl = now.toISOString();

    const { data, error } = await supabase.storage
      .from("UserData")
      .upload(`${email}/post/${newPostImageUrl}`, file, {
        contentType: "image/png",
        cacheControl: "3600",
      });
    try {
      const response = await ApiCall.postToSubreddit(
        formData.get("subreddits")?.toString(),
        formData.get("text")?.toString(),
        formData.get("title")?.toString(),
        postImageUrl && `${email}/post/${newPostImageUrl}`,
      );
      if (response.status != 200) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      } else {
        mutate(import.meta.env.VITE_BACKEND_URL + "posts");
      }
    } catch (e) {
      console.log(`Error creating post: ${e}`);
    }
  };

  const updatePostImage = async (e) => {
    if (editingPost?.postImageUrl) {
      await supabase.storage
        .from("UserData")
        .remove([editingPost.postImageUrl]);

      const { data, error } = await supabase.storage
        .from("UserData")
        .upload(editingPost.postImageUrl, e.target.files[0], {
          contentType: "image/png",
          cacheControl: "3600",
        });
      if (error) {
        console.log("Err" + error);
      } else {
        setPostImageUrl(editingPost!.postImageUrl);
        mutate(import.meta.env.VITE_BACKEND_URL + "posts");
      }
    }
  };

  const postImg =
    editingPost?.postImageUrl != null &&
    supabase.storage.from("UserData").getPublicUrl(editingPost.postImageUrl);

  if (editingPost) {
    const { register } = useForm({
      defaultValues: { text: editingPost?.text, title: editingPost.title },
    });
    return (
      <div className={home.focus}>
        <IoClose
          style={{ color: "green" }}
          onClick={() => toggleFocus({ active: false, post: null })}
        />
        <h2>Editing Post</h2>
        <form action={updatePost}>
          <label>
            Title:
            <input type="text" {...register("title")} />
          </label>
          <label>
            Text:
            <input type="text" {...register("text")} />
          </label>
          {editingPost.postImageUrl && (
            <>
              <label htmlFor="upload image">
                <div
                  // this section needs to wait for the existence of an actual profile image
                  style={{
                    backgroundImage:
                      postImg.data != null
                        ? `url(${postImg.data.publicUrl})`
                        : "url('/assets/images/generic_profile.jpg')",
                  }}
                >
                  <img
                    src={postImg.data.publicUrl}
                    style={{ borderRadius: "50%" }}
                  />
                  <FiEdit2 />
                </div>
              </label>
              <input
                id="upload image"
                type="file"
                name="uploaded_image"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  updatePostImage(e);
                }}
                placeholder=""
                style={{ display: "none" }}
              />
            </>
          )}
          <button type="submit">submit</button>
        </form>
      </div>
    );
  } else {
    return (
      <div className={home.focus}>
        <IoClose
          style={{ color: "green" }}
          onClick={() => toggleFocus({ active: false, post: null })}
        />
        <h2>Create Post</h2>
        <form action={createPost}>
          <label>
            Title:
            <input placeholder="Title" name="title" type="text" />
          </label>
          <label>
            Text:
            <input placeholder="Text" name="text" type="text" />
          </label>
          <label>
            Subreddits:
            <select name="subreddits">
              {subreddits &&
                subreddits.map((sred) => (
                  <option value={sred.name}> {sred.name} </option>
                ))}
            </select>
          </label>

          <label htmlFor="upload file">
            <div
              // this section needs to wait for the existence of an actual profile image
              style={{
                backgroundImage:
                  postImg.data != null
                    ? `url(${postImg.data.publicUrl})`
                    : "url('/assets/images/generic_profile.jpg')",
              }}
            >
              {/* <img src={userImg.data.publicUrl} style={{ borderRadius: "50%" }} /> */}
              <IoIosAddCircleOutline />
            </div>
          </label>
          <input
            id="upload file"
            type="file"
            name="uploaded_file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPImgUrl(e)}
            placeholder=""
            style={{ display: "none" }}
          />
          <button type="submit">submit</button>
        </form>
      </div>
    );
  }
}

export default Focus;
