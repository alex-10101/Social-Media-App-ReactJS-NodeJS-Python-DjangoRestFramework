from rest_framework import serializers
from utils.compressImage import compress_image
from utils.sanitizeUserInput import sanitize_user_input
from .models import Post
from PIL import Image

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = "__all__"


class CreatePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ["postDescription", "img", "user"]
    
    def validate_img(self, value):
        if not value:
            return
        
        image = Image.open(value)

        media_type = image.get_format_mimetype()
        if media_type != "image/png" and media_type != "image/jpeg":
            raise serializers.ValidationError("Wrong media type. Only png and jpeg.")
        
        format = image.format

        if format != "PNG" and format != "JPEG":
            raise serializers.ValidationError("Wrong file format. Only png and jpeg.")

        try:
            image.verify()
        except:
            raise serializers.ValidationError("File not accepted.")

        # return value        
        return compress_image(value)


    def validate(self, data):
        return sanitize_user_input(data)
