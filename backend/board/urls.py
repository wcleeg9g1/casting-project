from django.urls import path, include
from .views import PostListCreateView, PostRetrieveUpdateDestroyView
from rest_framework.routers import DefaultRouter
from .views import PostViewSet

router = DefaultRouter()
router.register(r"posts", PostViewSet)

urlpatterns = [
    # path("posts/", PostListCreateView.as_view(), name = "post-list-create"),
    # path("posts/<int:pk>/", PostListCreateView.as_view(), name = "post-list-create"),
    path("", include(router.urls)), 
]
