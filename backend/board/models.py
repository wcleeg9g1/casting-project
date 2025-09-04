from django.db import models
from django.conf import settings

# 게시판 모델 
class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, # custom 유저 
        on_delete=models.CASCADE,
        related_name="posts"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self): 
        return self.title
    
#다중파일 모델 추가 
class PostFile(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="files")
    file = models.FileField(upload_to="uploads/") # media/uploads/ 에 저장됨
