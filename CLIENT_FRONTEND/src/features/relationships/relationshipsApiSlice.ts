import { apiSlice } from "../../app/api/apiSlice";
import { IRelationship } from "../../types/types";

export const relationshipsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRelationship: builder.query<IRelationship, number>({
      query: (followedUserId) => ({
        url: "/relationships?followedUserId=" + followedUserId,
        method: "GET",
      }),
      providesTags: () => ["relationships"],
    }),
    getAllFollowedUsers: builder.query<IRelationship[], void>({
      query: () => ({ url: "/relationships/all", method: "GET" }),
      providesTags: ["relationships"],
    }),
    createAndDeleteRelationship: builder.mutation<void, number>({
      query: (userId) => ({
        url: "/relationships/?userId=" + userId,
        method: "POST",
      }),
      invalidatesTags: ["relationships", "posts"],
    }),
  }),
});

export const {
  useGetRelationshipQuery,
  useGetAllFollowedUsersQuery,
  useCreateAndDeleteRelationshipMutation,
} = relationshipsApiSlice;
