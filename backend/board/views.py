from django.shortcuts import render
from rest_framework import viewsets, generics, permissions
from .models import Post
from .serializers import PostSerializer

# 로그인한 사용자만 작성 
class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author = self.request.user)

# 상세 조회, 수정, 삭제
class PostRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView): 
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by("-created_at")
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)  # 로그인한 유저를 자동 author로 저장