from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from .models import Comment
from .serializers import CommentSerializer, CreateCommentSerializer

# Create your views here.

class CommentListCreateApiView(APIView):
    """
    Class based view for getting all comments on a particular post and for creating a new post.
    """
    permission_classes=[permissions.IsAuthenticated]

    def get(self, request):
        """
        Get all the comments on a particular post. The post_id is a query parameter.
        """
        post_id = request.query_params.get("postId")
        post_comments = Comment.objects.filter(post__id=post_id)
        serializer = CommentSerializer(post_comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    def post(self, request):
        """
        Add a comment on a particular post.
        """
        data = {
            "commentDescription": request.data["commentDescription"], 
            "post": request.data["postId"], 
            "user": request.user.id
        }

        serializer = CreateCommentSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        
        print(serializer.errors)

        return Response(
            {"detail": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST)


class CommentDetailApiView(APIView):
    """
    Class based view for deleting a particular comment.
    """
    permission_classes=[permissions.IsAuthenticated]

    def delete(self, request, commentId):
        """
        Delete a particular post. The commentId is a request parameter.
        """
        comment = None
        try:
            comment = Comment.objects.get(id=commentId, user__id = request.user.id)
        except Comment.DoesNotExist:
            return Response(
                {"detail": "The comment with the given id and user id does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )

        comment.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)



