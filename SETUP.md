# Wapple 설치 및 실행 가이드

## 프로젝트 개요
React + TypeScript + Tailwind CSS + Mapbox를 사용한 공공 와이파이 지도 웹 애플리케이션입니다.
FSD (Feature-Sliced Design) 아키텍처를 따릅니다.

## 필수 요구사항

- Node.js 18.x 이상
- npm 9.x 이상

## 설치 방법

### 1. 의존성 설치
```bash
npm install
```

만약 설치 중 문제가 발생하면:
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
VITE_MAPBOX_TOKEN=your_mapbox_token_here
VITE_WIFI_API_KEY=your_wifi_api_key_here
```

#### API 키 발급 방법:

**Mapbox Token:**
1. https://account.mapbox.com/ 접속
2. 회원가입 또는 로그인
3. Access tokens 메뉴에서 새 토큰 생성
4. Public scopes 권한이 있는 토큰 복사

**공공 와이파이 API (선택사항):**
1. https://www.wififree.kr/pu/oa/L01.do 접속  
2. API 신청 (현재는 Mock 데이터 사용)

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:5173 접속

### 4. 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

### 5. 프리뷰

```bash
npm run preview
```

## 주요 기능

- 🗺️ Mapbox 기반 인터랙티브 지도
- 📍 현재 위치 감지 및 검색
- 📶 주변 공공 와이파이 지점 표시
- 🌏 다국어 지원 (한국어, 영어, 일본어)
- 🎯 반경 설정 (500m ~ 5km)
- 📱 반응형 디자인

## 프로젝트 구조 (FSD Architecture)

```
src/
├── app/                    # 애플리케이션 초기화
│   ├── App.tsx            # 메인 앱 컴포넌트
│   └── providers/         # 전역 프로바이더
├── widgets/               # 페이지 레벨 UI 블록
│   ├── header/           # 헤더 위젯
│   └── map/              # 지도 위젯
├── features/              # 사용자 기능
│   ├── language-switcher/ # 언어 전환
│   ├── search-location/   # 위치 검색
│   └── wifi-list/         # 와이파이 목록
├── entities/              # 비즈니스 엔티티
│   ├── wifi/             # 와이파이 엔티티
│   └── location/         # 위치 엔티티
└── shared/                # 공유 리소스
    ├── api/              # API 클라이언트
    ├── config/           # 설정
    ├── lib/              # 유틸리티
    ├── types/            # TypeScript 타입
    └── ui/               # 공용 UI 컴포넌트
```

## 트러블슈팅

### Vite를 찾을 수 없는 경우

```bash
npx vite dev
```

또는

```bash
./node_modules/.bin/vite
```

### TypeScript 에러가 발생하는 경우

```bash
npx tsc --noEmit
```

타입 검사만 실행하여 오류 확인

### Mapbox 토큰 오류

.env 파일이 프로젝트 루트에 있는지 확인하고, VITE_ 접두사가 올바르게 붙어있는지 확인하세요.

## 기술 스택

- **Frontend Framework:** React 19
- **Language:** TypeScript 5.9
- **Build Tool:** Vite 5.4
- **Styling:** Tailwind CSS 4.x
- **Map:** Mapbox GL JS + React-Map-GL
- **i18n:** i18next + react-i18next
- **HTTP Client:** Axios
- **Linting:** ESLint

## 라이선스

MIT

## 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.
