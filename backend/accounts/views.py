from django.shortcuts import render
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from .serializers import RegisterSerializer, UserSerializer
from .models import User

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView

#등록 
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

#로그인 - 토큰을 발급, 리프레시 토큰을 HttpOnly 쿠키로 설정
class ObtainTokenPairWithCookieView(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        resp = super().post(request, *args, **kwargs)
        refresh = resp.data.get("refresh")
        access = resp.data.get("access")
        
        if not refresh or not access:
            return Response({"detail": "Login failed"}, status=400)

        response = Response({"access": access}, status=200)

        # 경로: 토큰 갱신 엔드포인트 전용, settings의 DEBUG 값에 따라 secure 플래그 설정
        secure_flag = request.scheme != "http" and True  # 간단한 확인용: 운영 환경에서는 settings.DEBUG를 사용
        # 개발 환경에서는 비보안(Non-Secure) 허용
        response.set_cookie(
            "refresh_token", 
            refresh, 
            httponly=True,
            secure=False, # 운영(https) 일 경우 True로 변경 
            samesite="Lax", 
            path="/api/auth/token/refresh/",
        )

        return response

# Refresh: 쿠키에서 refresh 토큰 읽기 
class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            # return Response({"detail": "No refresh token cookie"}, status=status.HTTP_401_UNAUTHORIZED)
            return Response({"detail": "http_401: No refresh token cookie"})
        request.data["refresh"] = refresh_token
        resp = super().post(request, *args, **kwargs)
        new_refresh = resp.data.get("refresh")
        access = resp.data.get("access")
        response = Response({"access": access}, status=200)
        if new_refresh:
            response.set_cookie(
                "refresh_token",
                new_refresh,
                httponly=True,
                secure=False,  # CHANGE to True in production
                samesite="Lax",
                path="/api/auth/token/refresh/",
            )
        return response

# 로그아웃 - 리프레시 토큰을 블랙리스트에 등록하고 쿠키를 삭제
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                pass
        res = Response({"detail": "logged out"}, status=status.HTTP_200_OK)
        res.delete_cookie("refresh_token", path="/api/auth/token/refresh/")
        return res

# 나의 정보
class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)