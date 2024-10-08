from rest_framework import serializers
from .models import Comment
from utils.sanitizeUserInput import sanitize_user_input

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"

    
class CreateCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["commentDescription", "post", "user"]


    def validate(self, data):
        return sanitize_user_input(data)
