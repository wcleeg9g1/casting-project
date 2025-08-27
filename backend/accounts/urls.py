from django.urls import path
from .views import RegisterView, ObtainTokenPairWithCookieView, CookieTokenRefreshView, LogoutView, MeView
from rest_framework_simplejwt.views import TokenVerifyView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("token/", ObtainTokenPairWithCookieView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", CookieTokenRefreshView.as_view(), name="token_refresh"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", MeView.as_view(), name="me"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
]