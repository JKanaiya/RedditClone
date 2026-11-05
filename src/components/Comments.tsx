import useSWR from "swr";
function Comments() {
  const {
    data: subreddits,
    error,
    mutate,
    isLoading: loading,
  } = useSWR(import.meta.env.VITE_BACKEND_URL + "subreddits", getSubreddits);
  return <div></div>;
}

export default Comments;
