import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCSRFCookie } from "../../djangoCSRFCookie/getCSRFCookie";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/api/",
  credentials: "include",
  prepareHeaders: (headers) => {
    const csrfCookie = getCSRFCookie("csrftoken");
    if (csrfCookie) {
      headers.set("X-CSRFToken", csrfCookie);
    }
    return headers;
  },
});
export const apiSlice = createApi({
  baseQuery: baseQuery,
  tagTypes: ["posts", "comments", "likes", "relationships", "users", "uploads"],
  // underscore `_` is added to please typescript (variable not used (?))
  endpoints: (_builder) => ({}),
});
