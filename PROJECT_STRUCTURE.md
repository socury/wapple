# 프로젝트 구조

## 개요
이 프로젝트는 일반적인 React 프로젝트 구조를 따릅니다.

## 디렉토리 구조

```
src/
├── components/          # React 컴포넌트
│   ├── header/         # 헤더 컴포넌트
│   ├── map/            # 지도 컴포넌트
│   ├── search/         # 검색 컴포넌트
│   ├── wifi-list/      # WiFi 목록 컴포넌트
│   └── language-switcher/ # 언어 전환 컴포넌트
│
├── pages/              # 페이지 컴포넌트
│   └── Home.tsx        # 메인 페이지
│
├── hooks/              # 커스텀 훅
│   └── geolocation.ts  # 위치 정보 훅
│
├── libs/               # 라이브러리 및 설정
│   ├── env.ts          # 환경 변수 설정
│   ├── i18n.ts         # 다국어 설정
│   └── wifiApi.ts      # WiFi API
│
├── utils/              # 유틸리티 함수 및 타입
│   └── types/          # TypeScript 타입 정의
│       ├── location.ts # 위치 타입
│       └── wifi.ts     # WiFi 타입
│
├── App.tsx             # 앱 엔트리 포인트
└── main.tsx            # React 진입점
```

## 주요 컴포넌트

### Components
- **Header**: 애플리케이션 헤더 (제목, 언어 선택)
- **MapWidget**: Mapbox 지도 표시 및 WiFi 마커
- **SearchLocation**: 위치 검색 및 현재 위치 버튼
- **WifiList**: WiFi 지점 목록 표시
- **LanguageSwitcher**: 언어 전환 (한국어/영어/일본어)

### Pages
- **Home**: 메인 페이지 (모든 컴포넌트 조합)

### Hooks
- **geolocation**: 브라우저 위치 정보 API 래퍼

### Libs
- **env**: 환경 변수 관리
- **i18n**: 다국어 지원 (react-i18next)
- **wifiApi**: 공공 WiFi API 호출 및 데이터 처리

### Utils
- **types**: TypeScript 타입 정의
  - Location: 위치 정보 타입
  - WifiPoint: WiFi 지점 정보 타입

## 기술 스택

- **React 18**: UI 라이브러리
- **TypeScript**: 타입 안전성
- **Vite**: 빌드 도구
- **Tailwind CSS**: 스타일링
- **Mapbox GL JS**: 지도 라이브러리
- **react-i18next**: 다국어 지원
- **axios**: HTTP 클라이언트

## 개발 가이드

### 새 컴포넌트 추가
1. `src/components/` 아래에 새 폴더 생성
2. 컴포넌트 파일 작성 (예: `ComponentName.tsx`)
3. 필요한 경우 타입 정의를 `utils/types/`에 추가

### 새 페이지 추가
1. `src/pages/` 아래에 새 페이지 파일 생성
2. `App.tsx`에서 라우팅 설정 (필요시 React Router 추가)

### 새 API 추가
1. `src/libs/` 아래에 API 파일 생성
2. 관련 타입을 `utils/types/`에 정의

### 새 훅 추가
1. `src/hooks/` 아래에 훅 파일 생성
2. `use`로 시작하는 이름 사용

## 환경 변수

`.env` 파일에 다음 변수 설정:
- `VITE_MAPBOX_TOKEN`: Mapbox 액세스 토큰
- `VITE_WIFI_API_KEY`: 공공 WiFi API 키

## 빌드 및 실행

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```
