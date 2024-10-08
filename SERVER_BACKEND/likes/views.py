from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from .models import Like
from posts.models import Post
from .serializers import LikeSerializer, AddLikeSerializer

# Create your views here.

class LikeUnlikeApiView(APIView):
    """
    Class based view for getting all likes on a particular post and for creating a new post
    and for liking or unliking a particular post. 
    """
    permission_classes=[permissions.IsAuthenticated]

    def get(self, request):
        """
        Get all the likes on a particular post. The postId is a request parameter.
        """
        post_id = request.query_params.get("postId")
        post_likes = Like.objects.filter(post=post_id)
        # post_likes = Like.objects.filter(post__id=post_id)
        serializer = LikeSerializer(post_likes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Like a particular post, or unlike an already appreaciated post.
        The postId is a request parameter.
        """
        post_id = request.query_params.get("postId")
        user_id = request.user.id

        # I should not be able to like my own post :)
        try:
            post = Post.objects.get(id=post_id)
            if post.user.id == user_id:
                return Response(status=status.HTTP_204_NO_CONTENT)
        except Post.DoesNotExist:
            return Response(
                {"detail": "The post with the given id does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )
    
        post_likes = Like.objects.filter(post=post_id)
        # post_likes = Like.objects.filter(post__id=post_id)

        for like in post_likes:
            if like.user.id == user_id:
                # remove like
                Like.objects.get(user=user_id, post=post_id).delete()
                # Like.objects.get(user__id=user_id, post__id=post_id).delete()
                return Response(status=status.HTTP_204_NO_CONTENT)

        # add like
        data = {
            "post": post_id, 
            "user": user_id, 
        }

        serializer = AddLikeSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(
            {"detail": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST)


