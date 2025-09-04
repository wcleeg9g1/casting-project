from django.shortcuts import render
from rest_framework import viewsets, generics, permissions, filters
from rest_framework.decorators import api_view, permission_classes  # 🔹 여기서 import
from rest_framework.permissions import AllowAny  # 🔹 인증 없이 공개
from .models import Post, PostFile
from .serializers import PostSerializer
import json, os
from django.http import FileResponse, Http404
from urllib.parse import quote #한글/특수문자 인코딩 처리

# 다운로드 함수 
@api_view(['GET'])
@permission_classes([AllowAny])
def download_file(request, file_id):
    try:
        file_obj = PostFile.objects.get(id=file_id)
        file_path = file_obj.file.path
        filename = os.path.basename(file_path)

        if not os.path.exists(file_path):
            raise Http404("파일을 찾을 수 없습니다.")

        # 🔹 파일 안전하게 열기
        f = open(file_path, 'rb')
        response = FileResponse(f, as_attachment=True)

        quoted_filename = quote(filename)
        response['Content-Disposition'] = (
            f'attachment; filename="{filename}"; filename*=UTF-8\'\'{quoted_filename}'
        )

        return response

    except PostFile.DoesNotExist:
        raise Http404("파일이 존재하지 않습니다.")

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
    filter_backends = [filters.SearchFilter] # 검색 
    search_fields = ["title", "content", "author__username"] # 검색필드 지정 

    def perform_create(self, serializer):
        # Post 객체 저장 
        post = serializer.save(author=self.request.user)  # 로그인한 유저를 자동 author로 저장

        # 🔹 다중파일 저장 처리
        files = self.request.FILES.getlist("files")  # frontend FormData에서 'files' 필드
        for f in files:
            post.files.create(file=f) # 역참조 post에서 => postfile객체 가져옴 
    
    def perform_update(self, serializer):
        # 수정저장
        post = serializer.save()
        # 새로 추가된 파일 저장
        files = self.request.FILES.getlist("files")
        for f in files:
            post.files.create(file=f)
    
        #삭제 파일 처리 
        remove_files = self.request.data.get("removed_files")
        if remove_files:
            removed_ids = json.loads(remove_files)
            post.files.filter(id__in=removed_ids).delete()