import axios from "axios";

const ApiCall = (function () {
  const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
      "Content-Type": "application/json", // Common content type
    },
  });

  // Add an interceptor to include the token with every request
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // WARN: kinda iffy about this scope

  const signUp = async function (formData: FormData) {
    const result = await api
      .post("sign-up", {
        email: formData.get("email"),
        password: formData.get("password"),
        passwordConfirm: formData.get("passwordConfirm"),
      })
      .catch(function (err) {
        return err.response;
      });
    return result;
  };

  // TODO: value to be determined

  // const spectatorSignUp = async function () {
  //   const now = new Date();
  //   const specEmail = `spec${Math.floor(Math.random() * 1000)}_${Math.floor(Math.random() * 1000)}_${now.getMinutes()}@fakemail.com`;
  //
  //   const specPass = `=specPass${now.getDay()}_${now.getMinutes()}=`;
  //
  //   localStorage.setItem("messaging_app_spec_email", specEmail);
  //   localStorage.setItem("messaging_app_spec_pass", specPass);
  //
  //   try {
  //     const result = await api.post("sign-up", {
  //       email: specEmail,
  //       password: specPass,
  //       passwordConfirm: specPass,
  //       spectator: true,
  //     });
  //     return result;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  //
  // const spectatorLogin = async function () {
  //   const specEmail = localStorage.getItem("messaging_app_spec_email");
  //   const specPass = localStorage.getItem("messaging_app_spec_pass");
  //
  //   const result = await api
  //     .post("log-in", {
  //       email: specEmail,
  //       password: specPass,
  //       passwordConfirm: specPass,
  //     })
  //     .catch(function (err) {
  //       if (401 == err.response.status) {
  //         console.log("error logging in" + err);
  //       }
  //       return err.response;
  //     });
  //   localStorage.setItem("token", result.data.token);
  //
  //   return result;
  // };

  const logOut = function () {
    return api.get("log-out");
  };

  const logIn = async function (formData: FormData) {
    const result = await api
      .post("log-in", {
        email: formData.get("email"),
        password: formData.get("password"),
      })
      .catch(function (err) {
        if (401 === err.response?.status) {
          console.log("Unauthorized");
        }
        return err.response;
      });
    return result;
  };

  // TODO: Value to be determined
  // const setProfileImage = async function (piUrl: string) {
  //   const email = localStorage.getItem("messaging_app_email");
  //   const result = await api
  //     .post("profile-image", {
  //       email,
  //       piUrl,
  //     })
  //     .catch(function (err) {
  //       return err.response;
  //     });
  //   return result;
  // };

  const updateUserName = async function (formData: FormData) {
    const result = await api
      .patch("name", {
        newName: formData.get("newName"),
      })
      .catch(function (err) {
        return err.response;
      });
    return result;
  };

  const authCheck = async function () {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const result = fetch(import.meta.env.VITE_BACKEND_URL + "auth-check", {
      method: "GET",
      headers,
    })
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => console.error(err));
    return result;
  };

  const subscribe = async function (subName: string) {
    const result = await api
      .post("subscribe", {
        name: subName,
      })
      .catch(function (err) {
        if (401 === err.response?.status) {
          console.log("Unauthorized");
        }
        return err.response;
      });
    return result;
  };

  const createSubreddit = async function (subName: string) {
    const result = await api
      .post("subreddit", {
        name: subName,
      })
      .catch(function (err) {
        return err.response;
      });
    return result;
  };

  const postToSubreddit = async function (
    subName: string,
    text: string,
    title: string,
  ) {
    const result = await api
      .post("sub-post", {
        subName,
        text,
        title,
      })
      .catch(function (err) {
        return err.response;
      });
    return result;
  };

  const voteOnPost = async function (postId: number, positive: boolean) {
    const result = await api
      .post("vote-post", {
        postId,
        positive,
      })
      .catch(function (err) {
        return err.response;
      });
    return result;
  };

  const voteOnComment = async function (commentId: number, positive: boolean) {
    const result = await api
      .post("vote-comment", {
        commentId,
        positive,
      })
      .catch(function (err) {
        return err.response;
      });
    return result;
  };

  const commentOnPost = async function (postId: number, text: string) {
    const result = await api
      .post("comment", {
        postId,
        text,
      })
      .catch(function (err) {
        return err.response;
      });
    return result;
  };

  const commentOnComment = async function (commentId: number, text: string) {
    const result = await api
      .post("sub-comment", {
        commentId,
        text,
      })
      .catch(function (err) {
        return err.response;
      });
    return result;
  };

  const deleteComment = async function (commentId: number) {
    const result = await api.delete("comment", {
      params: {
        commentId,
      },
    });
    return result;
  };

  const updateComment = async function (commentId: number, text: string) {
    const result = await api.post("delete-comment", {
      commentId,
      text,
    });
    return result;
  };

  const getUserPosts = async function () {
    const result = await api.get("user-posts").catch(function (err) {
      return err.response;
    });
    return result;
  };

  const getPosts = async () => {
    const posts = await api.get("posts").catch(function (err) {
      console.log(err);
      if (401 == err.response.status) {
        console.error("Unauthorized");
      }
      return err.response;
    });
    return posts.data;
  };

  const acceptFollowRequest = async function (follReqId: number) {
    const result = await api
      .get("accept-follow-request", { params: { follReqId } })
      .catch(function (err) {
        return err.response;
      });
    return result;
  };

  const rejectFollowRequest = async function (follReqId: number) {
    const result = await api
      .get("reject-follow-request", { params: { follReqId } })
      .catch(function (err) {
        return err.response;
      });
    return result;
  };

  const sendFollowRequest = async function (receiverEmail: string) {
    const result = await api
      .post("follow-request", {
        receiverEmail,
      })
      .catch(function (err) {
        return err.response;
      });
    return result;
  };

  const getUsers = async function () {
    const result = await api.get("users").catch(function (err) {
      return err.response;
    });
    return result.data;
  };

  return {
    signUp,
    authCheck,
    logOut,
    logIn,
    sendFollowRequest,
    acceptFollowRequest,
    rejectFollowRequest,
    getUserPosts,
    subscribe,
    createSubreddit,
    postToSubreddit,
    voteOnComment,
    voteOnPost,
    commentOnComment,
    commentOnPost,
    deleteComment,
    updateComment,
    // setProfileImage,
    // spectatorSignUp,
    // spectatorLogin,
    getUsers,
    getPosts,
    updateUserName,
  };
})();

export default ApiCall;
