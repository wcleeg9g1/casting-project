from rest_framework import serializers
from .models import Post, PostFile

# 업로드 파일관련 시리얼라이저
class PostFileSerializer(serializers.ModelSerializer):
    class Meta: 
        model = PostFile
        fields = ["id", "file"]

# 기본 게시판 시리얼라이저 
class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')  # 작성자 읽기 전용
    files = PostFileSerializer(many=True, read_only=True) #Post에 연결된 파일 포함 

    class Meta:
        model = Post
        fields = ["id", "title", "content", "author", "author_username", "created_at", "updated_at", "files"]
        read_only_fields = ["author", "author_username", "created_at", "updated_at","files"]