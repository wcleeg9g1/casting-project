from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')  # 작성자 읽기 전용

    class Meta:
        model = Post
        fields = ["id", "title", "content", "author", "author_username", "created_at", "updated_at"]
        read_only_fields = ["author", "author_username", "created_at", "updated_at"]