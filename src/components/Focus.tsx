import type { Post, SubReddit } from "../App";
import type { FocusType } from "./Home";
import home from "../styles/home.module.css";
import { IoClose } from "react-icons/io5";
import ApiCall from "../apiCalls";
import { useForm } from "react-hook-form";
import { mutate } from "swr";

function Focus({
  editingPost,
  toggleFocus,
  subreddits,
}: {
  editingPost: Post | null;
  toggleFocus: (focus: FocusType) => void;
  subreddits: SubReddit[];
}) {
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
    try {
      const response = await ApiCall.postToSubreddit(
        formData.get("subreddits")?.toString(),
        formData.get("text")?.toString(),
        formData.get("title")?.toString(),
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
          <button type="submit">submit</button>
        </form>
      </div>
    );
  }
}

export default Focus;
