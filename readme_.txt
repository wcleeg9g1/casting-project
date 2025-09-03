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
#### 장고 프로젝트 생성하기 
C:\>mkdir projects  
C:\>cd projects  
C:\projects>   
C:\projects> C:\venvs\mysite\Scripts\activate  
(mysite) C:\projects>  
(mysite) C:\projects>mkdir mysite  
(mysite) C:\projects\mysite>django-admin startproject config .  # 장고 프로젝트 생성 
(mysite) C:\projects\mysite>python manage.py runserver   # 기본 실행 테스트  http://127.0.0.1:8000/  

##### 장고 앱생성 
(mysite) C:\projects\mysite> django-admin startapp board


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

## git ##
### 초기 git 등록 
> git init
> git add *
> git commit -m "casting project 최초 커밋"   


> github 저장소 create 후에 
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/wcleeg9g1/casting-project.git
git push -u origin main

(example_app) D:\...\example_project> git branch -M main  # 원격 저장소에 저장 (초기에)
(example_app) D:\...\example_project> git push -u origin main  # 원격 저장소에 저장 (초기에)



# 작업한 내용을 원격 저장소에 저장하는 순서 간단 정리# # # # # # # # # # # # # # # # # # # # # # # 
-프로그램 변경 작업하기
-git add <파일명> 또는 git add * 명령 수행하기
-git commit -m "변경사항 요약" 명령 수행하기
-git push 명령 수행하기

# 필수 git 명령어
git init : 현재 디렉터리에 새로운 Git 저장소를 초기화합니다.
git clone : 원격 저장소의 복사본을 로컬 머신에 생성합니다.
git status : 작업 디렉터리의 상태를 표시하며, 아직 커밋되지 않은 변경 사항을 보여줍니다.
git add : 커밋을 준비하기 위해 변경 사항을 스테이징 영역에 추가합니다.
git commit : 스테이징 영역에 있는 변경 사항으로 새로운 커밋을 생성합니다.
git pull : 원격 저장소에서 변경 사항을 가져와 로컬 브랜치에 병합합니다.
git push : 로컬 변경 사항을 원격 저장소에 푸시합니다.
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 

## 프로그램 추가시 순서 
1. 게시판 모델 (models.py)
2. 시리얼라이저 (serializers.py)
3. 뷰 (views.py)
4. URL설정 (urls.py)