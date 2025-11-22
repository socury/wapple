Wapple UI 스타일 가이드

1. 컬러 팔렛트
  Primary: #2563EB (blue-600)
  Secondary: #10B981 (green-500)
  Success: #10B981 (green-500)
  Error: #EF4444 (red-500)
  Background: #FFFFFF (white)
  Text: #374151 (gray-700)

2. 타이포그래피
  폰트: system-ui, -apple-system, sans-serif
  크기: text-3xl (제목), text-base (본문), text-sm (보조)
  굵기: font-bold (제목), font-medium (강조), font-normal (본문)

3. 버튼
  Primary: bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md
  Secondary: bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-md
  Success: bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md
  Danger: bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md

4. 입력 필드
  기본: border border-gray-300 rounded-md px-3 py-2 w-full
  포커스: focus:border-blue-500 focus:ring-1 focus:ring-blue-500
  에러: border-red-500
  라벨: text-sm font-medium text-gray-700 mb-2

5. 카드/패널
  기본: bg-white shadow-md rounded-lg p-4
  강조: bg-blue-50 border-l-4 border-blue-500 p-4

6. 반응형 브레이크포인트
  sm: 640px (모바일 가로)
  md: 768px (태블릿)
  lg: 1024px (데스크톱)
  xl: 1280px (큰 화면)

7. 상태 표시
  로딩: animate-spin text-blue-600 w-5 h-5
  성공: bg-green-50 text-green-800 border-l-4 border-green-500
  에러: bg-red-50 text-red-800 border-l-4 border-red-500
  빈 상태: text-gray-500 text-center

8. 애니메이션
  기본 전환: transition-colors duration-200
  호버: hover:shadow-lg, hover:bg-opacity-90
  포커스: focus:outline-none focus:ring-2 focus:ring-blue-500

9. 아이콘 (lucide-react)
  크기: w-5 h-5 (기본), w-4 h-4 (작음), w-8 h-8 (큼)
  색상: text-gray-600 (기본), text-blue-600 (활성)
