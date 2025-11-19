# 배포 가이드 (Deployment Guide)

## CORS 문제 해결 방법

공공 와이파이 API는 브라우저에서 직접 호출 시 CORS 오류가 발생합니다.

### 개발 환경 (Development)

Vite 프록시를 사용하여 CORS 우회:
```bash
npm run dev
```

프록시 설정 (`vite.config.ts`):
```typescript
proxy: {
  '/api/wifi': {
    target: 'https://www.wififree.kr',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api\/wifi/, '/openapi/wifi')
  }
}
```

### 프로덕션 환경 (Production)

프로덕션에서는 다음 중 하나의 방법을 선택해야 합니다:

#### 옵션 1: Vercel Serverless Functions (추천)

1. `api/wifi.ts` 파일 생성:
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { lat, lng, radius, pageNo, numOfRows, type } = req.query;
  const apiKey = process.env.VITE_WIFI_API_KEY;

  try {
    const response = await fetch(
      `https://www.wififree.kr/openapi/wifi/location?` +
      `serviceKey=${encodeURIComponent(apiKey as string)}` +
      `&lat=${lat}&lng=${lng}&radius=${radius}` +
      `&pageNo=${pageNo}&numOfRows=${numOfRows}&type=${type}`
    );
    
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'API call failed' });
  }
}
```

2. `vercel.json` 설정:
```json
{
  "rewrites": [
    { "source": "/api/wifi/:path*", "destination": "/api/wifi" }
  ]
}
```

#### 옵션 2: Netlify Functions

1. `netlify/functions/wifi.ts` 생성:
```typescript
import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  const { lat, lng, radius, pageNo, numOfRows, type } = event.queryStringParameters || {};
  const apiKey = process.env.VITE_WIFI_API_KEY;

  try {
    const response = await fetch(
      `https://www.wififree.kr/openapi/wifi/location?` +
      `serviceKey=${encodeURIComponent(apiKey)}` +
      `&lat=${lat}&lng=${lng}&radius=${radius}` +
      `&pageNo=${pageNo}&numOfRows=${numOfRows}&type=${type}`
    );
    
    const data = await response.json();
    
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API call failed' }),
    };
  }
};
```

2. `netlify.toml` 설정:
```toml
[[redirects]]
  from = "/api/wifi/*"
  to = "/.netlify/functions/wifi"
  status = 200
```

#### 옵션 3: AWS Lambda + API Gateway

1. Lambda 함수 생성 (Node.js)
2. API Gateway에서 CORS 활성화
3. 환경 변수에 API 키 설정
4. React 앱에서 Lambda URL로 요청

#### 옵션 4: 자체 백엔드 서버

Express.js 예시:
```javascript
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

app.get('/api/wifi/location', async (req, res) => {
  const { lat, lng, radius, pageNo, numOfRows, type } = req.query;
  
  try {
    const response = await axios.get(
      'https://www.wififree.kr/openapi/wifi/location',
      {
        params: {
          serviceKey: process.env.WIFI_API_KEY,
          lat, lng, radius, pageNo, numOfRows, type
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'API call failed' });
  }
});

app.listen(3001);
```

### API 키 없이 사용하기

API 키가 없거나 프로덕션 프록시 설정이 없으면 자동으로 Mock 데이터를 사용합니다.
콘솔에 경고 메시지가 표시되지만 앱은 정상 작동합니다.

## 환경 변수 설정

### Vercel
```bash
vercel env add VITE_WIFI_API_KEY
```

### Netlify
Netlify Dashboard → Site Settings → Environment Variables

### AWS
Lambda 함수 설정 → Environment Variables

## 보안 주의사항

⚠️ **중요**: API 키를 절대 클라이언트 코드에 노출하지 마세요!
- ✅ 서버리스 함수나 백엔드 서버의 환경 변수에 저장
- ❌ React 코드나 `.env` 파일을 Git에 커밋하지 말 것
- ❌ 브라우저 개발자 도구에서 API 키가 보이면 안 됨

## 추천 배포 플랫폼

1. **Vercel** - 가장 쉬운 설정, Serverless Functions 내장
2. **Netlify** - Functions 지원, 무료 플랜 충분
3. **Cloudflare Pages** - Workers로 프록시 구현 가능
4. **AWS Amplify** - Lambda와 통합
