import { apiSlice } from "../../app/api/apiSlice";
import { IUser } from "../../types/types";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCommentAuthor: builder.query<IUser, number>({
      query: (commentId) => ({
        url: "/users/findCommentAuthor/" + commentId,
        method: "GET",
      }),
      providesTags: () => ["users"],
    }),
    getPostAuthor: builder.query<IUser, number>({
      query: (postId) => ({
        url: "/users/findPostAuthor/" + postId,
        method: "GET",
      }),
      providesTags: () => ["users"],
    }),
    getUser: builder.query<IUser, number>({
      query: (userId) => ({
        url: "/users/findUser/" + userId,
        method: "GET",
      }),
      providesTags: () => ["users"],
    }),
    updateUser: builder.mutation<void, FormData>({
      query: (body) => ({
        url: "/users/update/",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const {
  useGetCommentAuthorQuery,
  useGetPostAuthorQuery,
  useGetUserQuery,
  useUpdateUserMutation,
} = usersApiSlice;
