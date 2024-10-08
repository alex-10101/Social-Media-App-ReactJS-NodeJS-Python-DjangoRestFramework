import Container from "react-bootstrap/Container";
import { useAppSelector } from "../app/hooks";
import {
  useGetAllLikesQuery,
  useHandleLikeAndUnlikeMutation,
} from "../features/likes/likesApiSlice";
import { useDeletePostMutation } from "../features/posts/postsApiSlice";
import { useGetPostAuthorQuery } from "../features/users/usersApiSlice";
import { IPost } from "../types/types";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Collapse from "react-bootstrap/Collapse";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import CommentSection from "./CommentSection";
import { formatDistance } from "date-fns/formatDistance";
import { useGetAllCommentsQuery } from "../features/comments/commentsApiSlice";
import { Link } from "react-router-dom";
import Loading from "./Loading";
import FetchBaseError from "./FetchBaseError";
import useGetImage from "../hooks/useGetImage";
import { useState } from "react";

/**
 *
 * @param param0
 * @returns A component, which displays a particular post
 */
function Post({ post }: { post: IPost }) {
  const {
    data: postAuthor,
    isLoading: postAuthorIsLoading,
    error: getPostAuthorError,
  } = useGetPostAuthorQuery(post.id);

  const {
    data: likes,
    isLoading: postLikesAreLoading,
    error: getPostLikesError,
  } = useGetAllLikesQuery(post.id);

  const {
    data: comments,
    isLoading: postCommentsAreLoading,
    error: getPostCommentsError,
  } = useGetAllCommentsQuery(post.id);

  const [likeAndUnlike, { error: likeAndUnlikeError }] =
    useHandleLikeAndUnlikeMutation();

  const [deletePost, { error: deletePostError }] = useDeletePostMutation();

  const currentUser = useAppSelector((state) => state.auth.user);

  const [open, setOpen] = useState(false);

  const { imgSrc, imgIsLoading } = useGetImage(post.img);

  /**
   * Make a POST request to like a particular post, or unlike an already appreciated post.
   */
  async function handleLikeAndUnlike() {
    await likeAndUnlike({
      userId: currentUser?.id!,
      postId: post.id,
    }).unwrap();
  }

  /**
   * Make a DELETE request to delete a particular post when the user clicks the "Delete Post" button.
   */
  async function handleDeletePost() {
    const post_id = post.id;
    await deletePost(post_id).unwrap();
  }

  if (
    postAuthorIsLoading ||
    postCommentsAreLoading ||
    postLikesAreLoading ||
    imgIsLoading
  ) {
    return <Loading />;
  }

  return (
    <Container>
      <Card className="w-100 m-auto mb-5">
        {/* show the image if the post contains any image */}
        {post.img && post.img !== "" && <Card.Img variant="top" src={imgSrc} />}

        <Card.Body>
          {/* show error from server if an error occured while retrieving the post author */}
          {getPostAuthorError && <FetchBaseError error={getPostAuthorError} />}

          {/* when the username (post author) is clicked, go to this user's profile page  */}
          <Link to={`profile/${postAuthor?.id}`}>
            <Card.Title>{postAuthor?.username}</Card.Title>
          </Link>

          {/* show the description if the post contains any description */}
          {post.postDescription && post.postDescription !== "" && (
            <Card.Text>{post.postDescription}</Card.Text>
          )}

          {/* shows approximately when the post was created */}
          <p>
            {formatDistance(new Date(post.createdAt), new Date(), {
              addSuffix: true,
            })}
          </p>

          <ButtonToolbar aria-label="Toolbar with button groups">
            {likes?.filter((like) => like.user === currentUser?.id).length ===
            0 ? (
              <Button
                variant="outline-secondary"
                className="me-3"
                onClick={handleLikeAndUnlike}
              >
                {/* show 'Like' and the total number of likes on that post if the user did not like another user's post  */}
                Like ({likes?.length})
              </Button>
            ) : (
              <Button
                variant="outline-info"
                className="me-3"
                onClick={handleLikeAndUnlike}
              >
                {/* show 'Liked' and the total number of likes on that post if the user did already liked another user's post  */}
                Liked ({likes?.length})
              </Button>
            )}

            {/* show error from server if an error occured while liking / unliking a post */}
            {likeAndUnlikeError && (
              <FetchBaseError error={likeAndUnlikeError} />
            )}

            {/* show error from server if an error occured while retrieving the likes on a post */}
            {getPostLikesError && <FetchBaseError error={getPostLikesError} />}

            <Button
              variant="outline-secondary"
              onClick={() => setOpen(!open)}
              aria-controls="example-collapse-text"
              aria-expanded={open}
              className="me-3"
            >
              Comments ({comments?.length})
            </Button>

            {/* show error from server if an error occured while retrieving the comments on a post */}
            {getPostCommentsError && (
              <FetchBaseError error={getPostCommentsError} />
            )}

            {/* show the delete button on the current user's posts */}
            {currentUser && currentUser.id === post.user && (
              <ButtonGroup aria-label="Third group">
                <Button
                  variant="outline-danger"
                  className="me-3"
                  onClick={handleDeletePost}
                >
                  Delete Post
                </Button>
              </ButtonGroup>
            )}

            {/* show error from server if an error occured while deleting a post */}
            {deletePostError && <FetchBaseError error={deletePostError} />}
          </ButtonToolbar>

          {/* show the comment section */}
          <Collapse in={open}>
            <div id="example-collapse-text" className="my-3">
              <CommentSection post={post} />
            </div>
          </Collapse>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Post;
