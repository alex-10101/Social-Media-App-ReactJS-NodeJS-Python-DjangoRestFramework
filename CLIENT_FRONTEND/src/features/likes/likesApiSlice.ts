import { apiSlice } from "../../app/api/apiSlice";
import { ILike } from "../../types/types";

export const likesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllLikes: builder.query<ILike[], number>({
      query: (postId) => ({ url: "/likes?postId=" + postId, method: "GET" }),
      providesTags: ["likes"],
    }),
    handleLikeAndUnlike: builder.mutation<
      void,
      { userId: number; postId: number }
    >({
      query: (body) => ({
        url: `/likes/?postId=${body.postId}&userId=${body.userId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["likes"],
    }),
  }),
});

export const { useGetAllLikesQuery, useHandleLikeAndUnlikeMutation } =
  likesApiSlice;
