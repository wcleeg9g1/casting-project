casting-project/
├─ backend/
│  ├─ manage.py
│  ├─ backend/
│  │  ├─ __init__.py
│  │  ├─ settings.py
│  │  ├─ urls.py
│  │  └─ wsgi.py
│  ├─ accounts/
│  │  ├─ __init__.py
│  │  ├─ admin.py
│  │  ├─ apps.py
│  │  ├─ models.py
│  │  ├─ serializers.py
│  │  ├─ views.py
│  │  ├─ urls.py
│  │  └─ migrations/
│  └─ requirements.txt
└─ frontend/
   ├─ package.json
   └─ src/
      ├─ main.jsx
      ├─ index.html
      ├─ App.jsx
      ├─ auth/
      │  ├─ AuthContext.jsx
      │  └─ fetchWithAuth.js
      └─ pages/
         ├─ Home.jsx
         ├─ Login.jsx
         └─ Register.jsx


npm install axios



## 개발시 ######################################################################################## 

### python ############################################################################ 
cd casting-project/backend
python -m venv .venv
source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 

### react + vite ############################################################################ 
cd casting-project/frontend
npm install
npm run dev
#################################################################################################


## 보안 / 프로덕션 참고 — 꼭 바꿔야 할 것들 (요약) ###################################################### 

1. settings.py: DEBUG=False, SECRET_KEY 환경변수, ALLOWED_HOSTS 설정, HTTPS 강제 및 cookie secure=True.

2. JWT: 개발은 HS256로 가능하나 프로덕션에서는 RS256(비대칭) 사용 권장 — 개인키/공개키 파일을 안전하게 관리.

3. Cookie secure=True, samesite 정책 확인. 백엔드에서 쿠키에 refresh 저장 시 secure=True.

4. Refresh 토큰에 대한 블랙리스트 / rotation은 이미 SimpleJWT 설정으로 활성화됨 — 운영에서 동작확인 필요.

5. CSP, XSS 보호, Rate limiting(로그인 엔드포인트), 로그인 실패 제한 등 인프라 레이어 적용 권장.

######################################################################################################