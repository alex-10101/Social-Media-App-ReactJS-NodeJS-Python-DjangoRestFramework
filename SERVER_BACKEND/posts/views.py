from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from user_relationships.models import Relationship
from posts.models import Post
from .serializers import PostSerializer, CreatePostSerializer
import os
from rest_framework.parsers import MultiPartParser, FormParser

# Create your views here.

class ListCreatePostsApiView(APIView):
    """
    Class based view for getting all the posts of the current user and the posts of the users,
    that the current user (the user making the request) is following.
    """
    permission_classes=[permissions.IsAuthenticated]

    # parser_classes are used because we are dealing with request data that comes in as FormData
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        """
        Get all the posts of the current user and the posts of the users,
        that the current user (the user making the request) is following.
        """
        # user_id = request.query_params.get("userId")
        user_id = request.user.id

        all_posts_of_the_current_user = Post.objects.filter(user = user_id)

        all_relationships_with_the_current_user = Relationship.objects.filter(followerUser = user_id)

        # Get all the posts of the users the current user (the request user) follows
        all_posts_of_the_follwed_users = []
        for relationship in all_relationships_with_the_current_user:
            all_posts_of_the_follwed_users.extend(list(Post.objects.filter(user = relationship.followedUser.id)))

        # concatenate the two lists
        timeline_posts = list(all_posts_of_the_current_user) + list(all_posts_of_the_follwed_users)

        # sort the post in reverse order of their creation date 
        # (on the client, newest post will be shown first, oldest post will be shown last)
        timeline_posts.sort(key=lambda post: post.createdAt, reverse=True)

        serializer = PostSerializer(timeline_posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        

    def post(self, request):
        """Creates a new post."""

        data = {
            "user": request.user.id, 
        }

        if "postDescription" in request.data:
            data["postDescription"] = request.data["postDescription"]

        if "img" in request.data:
            data["img"] = request.data["img"]


        serializer = CreatePostSerializer(data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(
            {"detail": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST)


class DeletePostApiView(APIView):
    """Class based view for deleting a particular post."""
    permission_classes=[permissions.IsAuthenticated]

    def delete(self, request, postId):
        """
        Delete a particular post. The postId is a request parameter.
        """
        post = None
        try:
            post = Post.objects.get(id=postId, user=request.user)
        except Post.DoesNotExist:
            return Response(
                {"detail": "The post with the given id does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # if the post contains an image, remove the image from media folder
        if post.img:
            os.remove(post.img.path)

        # delete the post from the database
        post.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)



    
