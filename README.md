# Wapple - 공공 와이파이 지도 (Public WiFi Map)

React + TypeScript + Vite + Tailwind CSS + Mapbox를 사용한 공공 와이파이 지도 웹 애플리케이션입니다.

## 기능 (Features)

- 🗺️ Mapbox 기반 인터랙티브 지도
- 📍 현재 위치 감지 및 검색
- 📶 주변 공공 와이파이 지점 표시
- 🌏 다국어 지원 (한국어, 영어, 일본어)
- 🎯 반경 설정 기능
- 📱 반응형 디자인

## 아키텍처 (Architecture)

FSD (Feature-Sliced Design) 아키텍처를 따릅니다:

```
src/
├── app/          # 앱 초기화 및 프로바이더
├── widgets/      # 독립적인 UI 블록
├── features/     # 사용자 시나리오 및 기능
├── entities/     # 비즈니스 엔티티
└── shared/       # 재사용 가능한 코드
```

## 설정 (Setup)

1. 환경 변수 설정:
```bash
cp .env
```

2. `.env` 파일에 API 키 추가:
```
VITE_MAPBOX_TOKEN=your_mapbox_token_here
VITE_WIFI_API_KEY=your_wifi_api_key_here
```

3. 의존성 설치:
```bash
npm install
```

4. 개발 서버 실행:
```bash
npm run dev
```

> **중요**: API를 사용하려면 개발 서버를 재시작해야 Vite 프록시 설정이 적용됩니다.

## API 키 발급

### Mapbox Token (필수)
1. https://account.mapbox.com/ 접속
2. 회원가입 또는 로그인
3. "Create a token" 클릭
4. 생성된 토큰을 `.env` 파일의 `VITE_MAPBOX_TOKEN`에 추가

### 공공 와이파이 API (필수)
1. https://www.wififree.kr/ 접속
2. 회원가입 및 로그인
3. API 인증키 신청 메뉴로 이동
4. 신청 후 승인 대기
5. 승인된 API 키를 `.env` 파일의 `VITE_WIFI_API_KEY`에 추가

**API 상세 정보:**
- API Endpoint: https://www.wififree.kr/getApList.do
- Method: POST (form-data)
- Response: JSON
- API 문서: https://www.wififree.kr/pu/oa/L01.do

**검색 파라미터 (택 1):**
- 위치 기반: searchLat, searchLon, searchDistance (km)
- 주소 기반: searchAddrState, searchAddrCity, searchApName

## 기술 스택 (Tech Stack)

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Mapbox GL JS
- React-Map-GL
- i18next (다국어)
- Axios

## 빌드 (Build)

```bash
npm run build
```

## 배포 (Deployment)

프로덕션 환경에서는 CORS 문제로 인해 프록시 서버가 필요합니다.
자세한 내용은 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참고하세요.

**추천 배포 방법:**
- Vercel (Serverless Functions)
- Netlify (Functions)
- Cloudflare Pages (Workers)

## 라이선스 (License)

MIT
# wapple
