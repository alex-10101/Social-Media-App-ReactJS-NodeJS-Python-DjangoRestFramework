from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from user_relationships.models import Relationship
from posts.models import Post
from .serializers import RelationshipSerializer, CreateRelationshipSerializer
import os

# Create your views here.

class GetAddOrRemoveUserRelationshipApiView(APIView):
    """
    Class based view for getting a particular user relationship, 
    The follower is the current user (the user making the request).
    """
    permission_classes=[permissions.IsAuthenticated]

    def get(self, request):
        """
        Get a particular user relationship.
        The followedUserId is a query parameter.
        """
        followed_user_id = request.query_params.get("followedUserId")
        relationship = None
        try:
            relationship = Relationship.objects.get(followedUser=followed_user_id)
        except Relationship.DoesNotExist:
            pass

        serializer = RelationshipSerializer(relationship)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        """
        Delete a particular post. The userId is a query parameter.
        """
        user_id = request.query_params.get("userId")
        relationship = None
        
        try:
            relationship = Relationship.objects.get(followedUser=user_id)
        except Relationship.DoesNotExist:
            pass

        if relationship is not None and relationship.followerUser.id == request.user.id:
            relationship.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        data = {
            "followerUser": request.user.id, 
            "followedUser": user_id, 
        }

        serializer = CreateRelationshipSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(
            {"detail": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST)


class GetAllUserRelationshipsApiView(APIView):
    """
    Class based view for getting a all user relationships, 
    where the follower is the current user (the user making the request).
    """
    permission_classes=[permissions.IsAuthenticated]

    def get(self, request):
        """
        Get a all user relationships, where the follower is the current user (the user making the request)."""
        all_relationships_with_the_current_user = Relationship.objects.filter(followerUser=request.user)

        serializer = RelationshipSerializer(all_relationships_with_the_current_user, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)



        

