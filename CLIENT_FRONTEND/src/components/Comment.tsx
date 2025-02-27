import Container from "react-bootstrap/Container";
import { useAppSelector } from "../app/hooks";
import { useDeleteCommentMutation } from "../features/comments/commentsApiSlice";
import { useGetCommentAuthorQuery } from "../features/users/usersApiSlice";
import { IComment } from "../types/types";
import Button from "react-bootstrap/esm/Button";
import FetchBaseError from "./FetchBaseError";

/**
 *
 * @param comment
 * @returns A component which shows a particular comment with its author.
 */
function Comment({ comment }: { comment: IComment }) {
  const currentUser = useAppSelector((state) => state.auth.user);

  const [deleteComment, { error: deleteCommentError }] =
    useDeleteCommentMutation();

  const { data: commentAuthor, error: getCommentAuthorError } =
    useGetCommentAuthorQuery(comment.id);

  /**
   * Make a DELETE request to delete a comment when the user clicks the "Delete Comment" button.
   * @param e
   */
  async function handleDeleteComment(
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) {
    e.preventDefault();
    await deleteComment(comment.id).unwrap();
  }

  return (
    <Container className="border mb-3 rounded">
      <h6 className="my-2">{commentAuthor?.username}</h6>
      <p className="mb-2">{comment.commentDescription}</p>
      {/* show the delete button only if it was written by the current user */}
      {currentUser && currentUser.id === comment.user && (
        <Button
          variant="outline-danger"
          className="mb-3"
          onClick={handleDeleteComment}
        >
          Delete Comment
        </Button>
      )}
      {/* display the error message from the server if an error occured */}
      {getCommentAuthorError && (
        <FetchBaseError error={getCommentAuthorError} />
      )}

      {/* display the error message from the server if an error occured */}
      {deleteCommentError && <FetchBaseError error={deleteCommentError} />}
    </Container>
  );
}

export default Comment;
