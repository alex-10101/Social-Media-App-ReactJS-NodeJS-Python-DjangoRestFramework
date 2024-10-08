from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from django.contrib.auth import get_user_model
from comments.models import Comment
from authentication.serializers import UserSerializer, UpdateUserSerializer
from posts.models import Post
from rest_framework.parsers import MultiPartParser, FormParser

User = get_user_model()

# Create your views here.

class GetPostAuthorApiView(APIView):
    """Class based view to get the author of a comment."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, postId):
        """Get the author of a comment. The postId is request parameter."""

        post = Post.objects.get(id=postId)
        user = User.objects.get(id=post.user.id)

        serializer = UserSerializer(user)

        return Response(serializer.data, status=status.HTTP_200_OK)


class GetCommentAuthorApiView(APIView):
    """Class based view to get the author of a post."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, commentId):
        """Get the author of a post. The commentId is request parameter."""

        comment = Comment.objects.get(id=commentId)
        user = User.objects.get(id=comment.user.id)

        serializer = UserSerializer(user)

        return Response(serializer.data, status=status.HTTP_200_OK)


class GetUserApiView(APIView):
    """Class based view to get the profile of a particular user."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, userId):
        """Get the author of a post. The userId is a request parameter."""
        user = User.objects.get(id=userId)

        serializer = UserSerializer(user)

        return Response(serializer.data, status=status.HTTP_200_OK)

class UpdateUserApiView(APIView):
    """Class based view to update the profile of a particular user."""

    permission_classes = [permissions.IsAuthenticated]
    # parser_classes are used because we are dealing with request data that comes in as FormData
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request):
        """Creates a new post."""

        data = {
            "user": request.user.id, 
        }

        if "username" in request.data and request.data["username"]:
            data["username"] = request.data["username"]

        if "city" in request.data and request.data["city"]:
            data["city"] = request.data["city"]
        
        if "website" in request.data and request.data["website"]:
            data["website"] = request.data["website"]

        if "cover" in request.data and request.data["cover"]:
            data["coverPicture"] = request.data["cover"]

        if "profile" in request.data and request.data["profile"]:
            data["profilePicture"] = request.data["profile"]


        serializer = UpdateUserSerializer(data=data, partial=True, instance=request.user)

        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(
            {"detail": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST)
