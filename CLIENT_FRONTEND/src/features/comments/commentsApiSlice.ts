import { apiSlice } from "../../app/api/apiSlice";
import { IComment } from "../../types/types";

export const commentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllComments: builder.query<IComment[], number>({
      query: (postId) => ({
        url: "/comments?postId=" + postId,
        method: "GET",
      }),
      providesTags: ["comments"],
    }),
    createComment: builder.mutation<
      void,
      { commentDescription: string; postId: number }
    >({
      query: (body) => ({
        url: "/comments/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["comments"],
    }),
    deleteComment: builder.mutation<void, number>({
      query: (commentId) => ({
        url: "/comments/" + commentId,
        method: "DELETE",
      }),
      invalidatesTags: ["comments"],
    }),
  }),
});

export const {
  useGetAllCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} = commentsApiSlice;
