import type { Post, SubReddit } from "../App";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { IoIosAddCircleOutline } from "react-icons/io";
import type { FocusType } from "./Home";
import { FiEdit2 } from "react-icons/fi";
import home from "../styles/home.module.css";
import { IoClose } from "react-icons/io5";
import ApiCall from "../apiCalls";
import { useForm } from "react-hook-form";
import { mutate } from "swr";
import { useRef, useState, type InputEventHandler } from "react";
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
  const specEmail = localStorage.getItem("spec_email");
  const email = specEmail ? specEmail : localStorage.getItem("email");
  const postImageRef = useRef<string | undefined>(undefined);

  const successNotify = (message: string) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  };

  const errorNotify = (message: string) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
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
        successNotify("Updated post successfully");
        mutate(import.meta.env.VITE_BACKEND_URL + "posts");
      }
    } catch (e) {
      errorNotify("Failed to update post!");
      console.log(`Error updating post: ${e}`);
    }
  };

  const createPost = async (formData: FormData) => {
    try {
      const response = await ApiCall.postToSubreddit(
        formData.get("subreddits")?.toString(),
        formData.get("text")?.toString(),
        formData.get("title")?.toString(),
        postImageRef.current != null && postImageRef.current,
      );
      console.log(response);
      if (response.status != 200) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      } else {
        successNotify("Created post successfully");
        postImageRef.current = undefined;
        toggleFocus({ active: false, post: null });
        mutate(import.meta.env.VITE_BACKEND_URL + "posts");
      }
    } catch (e) {
      errorNotify("Failed to create post!");
      console.log(`Error creating post: ${e}`);
    }
  };

  const updatePostImage = async (e) => {
    if (editingPost && editingPost?.postImageUrl) {
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
        errorNotify("Failed to update post!");
        console.log("Err" + error);
      } else {
        successNotify("Updated post successfully");
        mutate(import.meta.env.VITE_BACKEND_URL + "posts");
      }
    } else {
      const now = new Date();
      const newPostImageUrl = now.toISOString();
      const { data, error } = await supabase.storage
        .from("UserData")
        .upload(`${email}/post/${newPostImageUrl}`, e.target.files[0], {
          contentType: "image/png",
          cacheControl: "3600",
        });
      postImageRef.current = `${email}/post/${newPostImageUrl}`;
      if (error) {
        console.log("Err" + error);
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
      <div
        className={home.focus}
        style={{ height: editingPost.postImageUrl ? "80dvh" : "45dvh" }}
      >
        <div className={home.focusHeader}>
          <h4>Editing Post</h4>
          <IoClose onClick={() => toggleFocus({ active: false, post: null })} />
        </div>
        <h5 className={home.focusMetaData}>
          r
          <span style={{ color: "oklch(0.5845 0.2024 35.53)", margin: "none" }}>
            c/
          </span>
          {editingPost.subReddit.name}
        </h5>
        <form
          action={updatePost}
          style={{ minHeight: editingPost.postImageUrl ? "80%" : 0 }}
        >
          <label>
            <span>
              Title:
              <br />
            </span>
            <input
              type="text"
              {...register("title")}
              className={home.focusTitle}
            />
          </label>
          {editingPost.postImageUrl && (
            <>
              <label htmlFor="upload image" className={home.focusEditImage}>
                <div
                  // this section needs to wait for the existence of an actual profile image
                  style={{
                    backgroundImage:
                      postImg.data != null
                        ? `url(${postImg.data.publicUrl})`
                        : "url('/assets/images/generic_profile.png')",
                  }}
                ></div>
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
          <label>
            <span>
              Text:
              <br />
            </span>
            <input
              type="text"
              {...register("text")}
              className={home.focusText}
            />
          </label>
          <button
            type="submit"
            onClick={() => toggleFocus({ active: false, post: null })}
          >
            Submit
          </button>
        </form>
      </div>
    );
  } else {
    return (
      <div className={home.focus}>
        <div className={home.focusHeader}>
          <h2>Create Post</h2>
          <IoClose onClick={() => toggleFocus({ active: false, post: null })} />
        </div>
        <form action={createPost}>
          <label>
            Title:
            <input name="title" type="text" className={home.focusTitle} />
          </label>
          <label>
            Text:
            <input
              placeholder="Text"
              name="text"
              type="text"
              className={home.focusText}
            />
          </label>
          <label>
            Subreddit: <br />
            <select name="subreddits" className={home.focusSubSelect}>
              {subreddits &&
                subreddits.map((sred) => (
                  <option value={sred.name}>
                    <p style={{ color: "oklch(0.5845 0.2024 35.53)" }}>rc</p>/
                    {sred.name}
                  </option>
                ))}
            </select>
          </label>
          <label
            htmlFor="upload file"
            style={{
              minHeight: "30%",
            }}
          >
            <p> Post Image: </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "oklch(0.3109 0.0131 229.38)",
                height: "80%",
                borderRadius: "10px",
                justifyContent: "center",
              }}
            >
              <IoIosAddCircleOutline />
            </div>
          </label>
          <input
            id="upload file"
            type="file"
            name="uploaded_file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updatePostImage(e)
            }
            placeholder=""
            style={{ display: "none" }}
          />
          <button type="submit">Submit</button>
        </form>
        <ToastContainer />
      </div>
    );
  }
}

export default Focus;
