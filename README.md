# Datarize Frontend 과제 전형

## 🚀 프로젝트 설정 및 실행 방법

### 📋 요구 사항

- **Node.js**: 20.13.1
- **Yarn**: 1.22.22

### 📦 설치 및 실행

1. **의존성 설치**

   ```bash
   cd apps
   yarn install
   ```

2. **서버 실행**
   ```bash
   # 터미널 1: 백엔드 서버 실행
   yarn start-server
   ```
3. **클라이언트 실행**

   ```bash
   # 터미널 2: 프론트엔드 개발 서버 실행
   yarn start-client
   ```

4. **브라우저에서 확인**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

### 🧪 테스트 실행 방법

프로젝트에는 API 함수와 React 컴포넌트에 대한 유닛 테스트가 포함되어 있습니다.

```bash
# 프론트엔드 디렉토리로 이동
cd apps/frontend

# 모든 테스트 실행 (단일 실행)
yarn test

# 테스트 결과 및 커버리지 확인
yarn test:coverage

# 테스트 UI로 실행 (브라우저에서 확인)
yarn test:ui
```

**테스트 구성:**

- **API 테스트**: fetch 모킹을 통한 API 함수 단위 테스트 (8개)
- **컴포넌트 테스트**: React Testing Library를 사용한 UI 컴포넌트 테스트 (7개)
- **총 15개 테스트 케이스** 모두 통과 확인됨

## 🛠️ 기술 스택

### Frontend

- **React 18** + **TypeScript**
- **Vite** (빌드 도구)
- **TailwindCSS** (스타일링)
- **React Query (@tanstack/react-query)** (서버 상태 관리)
- **Recharts** (차트 라이브러리)
- **date-fns** (날짜 처리)

### Testing

- **Vitest** (테스트 프레임워크)
- **React Testing Library** (컴포넌트 테스트)
- **jsdom** (브라우저 환경 시뮬레이션)

## 📁 프로젝트 구조

```
datarize-fe-assignments/
├── apps/
│   ├── backend/                 # 백엔드 서버 (수정 금지)
│   │   ├── src/
│   │   │   ├── routes/         # API 라우트
│   │   │   └── data/           # JSON 데이터 파일
│   │   └── assets/imgs/        # 제품 이미지
│   └── frontend/               # 프론트엔드 애플리케이션
│       ├── src/
│       │   ├── components/     # 공통 컴포넌트
│       │   │   ├── Tabs.tsx    # 탭 네비게이션
│       │   │   └── ErrorBoundary.tsx  # 에러 처리
│       │   ├── features/       # 주요 기능 컴포넌트
│       │   │   ├── PurchaseFrequencyChart.tsx
│       │   │   ├── CustomerList.tsx
│       │   │   └── CustomerDetail.tsx
│       │   ├── lib/           # 유틸리티 라이브러리
│       │   │   └── api.ts     # API 통신 함수
│       │   ├── types/         # TypeScript 타입 정의
│       │   └── __tests__/     # 테스트 파일들
│       ├── vite.config.ts     # Vite 설정 (Vitest 포함)
│       └── package.json
└── README.md
```

## ✨ 주요 기능

### 1. 가격대별 구매 빈도 차트

- **바 차트 시각화**: Recharts 라이브러리 사용
- **날짜 범위 선택**: from/to 날짜로 기간 조회
- **가격대 구분**: 2만원 이하 ~ 10만원 이상 (만원 단위)
- **반응형 디자인**: 모바일/태블릿/데스크톱 대응

### 2. 고객 목록 및 검색 기능

- **정렬 기능**: ID순, 구매금액 오름차순/내림차순
- **실시간 검색**: 고객 이름으로 부분 일치 검색
- **테이블 형태**: ID, 이름, 구매 횟수, 총 구매 금액 표시
- **행 클릭**: 고객 상세 정보 모달 열기

### 3. 고객 상세 정보

- **모달 형태**: 오버레이로 상세 정보 표시
- **구매 내역**: 날짜, 제품명, 가격, 썸네일 이미지
- **그리드 레이아웃**: 반응형 카드 형태 디스플레이
- **이미지 최적화**: 제품 썸네일 자동 리사이징

## 🎯 개선사항 (구현 완료)

### 1. 코드 품질 향상

- **상세한 주석**: 모든 컴포넌트와 함수에 JSDoc 주석 추가
- **타입 안전성**: TypeScript 엄격 모드 적용
- **코드 구조화**: 관심사 분리 및 재사용 가능한 컴포넌트

### 2. 테스트 커버리지

- **API 함수 테스트**: fetch 모킹, 에러 처리 검증
- **컴포넌트 테스트**: 렌더링, 사용자 상호작용 테스트
- **자동화된 테스트**: CI/CD 파이프라인 연동 가능

### 3. 에러 처리 강화

- **Error Boundary**: React 에러 포착 및 복구
- **사용자 친화적 에러 메시지**: 단계별 에러 안내
- **개발/프로덕션 모드**: 환경별 에러 정보 표시

### 4. UX/UI 개선

- **로딩 상태**: 모든 데이터 요청에 로딩 인디케이터
- **반응형 디자인**: 다양한 디바이스 크기 대응
- **접근성**: 키보드 네비게이션 및 스크린 리더 지원

## 🔧 개발 가이드라인

### 코딩 컨벤션

- **ESLint + Prettier**: 코드 스타일 자동 포맷팅
- **TypeScript Strict Mode**: 타입 안전성 보장
- **함수형 컴포넌트**: React Hooks 기반 개발
- **명명 규칙**: PascalCase (컴포넌트), camelCase (함수/변수)

### API 통신

- **React Query**: 서버 상태 관리 및 캐싱
- **에러 처리**: try-catch 및 에러 바운더리 조합
- **타입 검증**: API 응답 타입 안전성 보장

### 스타일링

- **TailwindCSS**: 유틸리티 퍼스트 CSS 프레임워크
- **반응형 클래스**: sm:, md:, lg: 브레이크포인트 활용
- **컬러 시스템**: neutral, blue 색상 팔레트 통일

## 📊 성능 최적화

- **React Query 캐싱**: API 응답 자동 캐시 및 백그라운드 업데이트
- **코드 스플리팅**: 동적 import를 통한 번들 크기 최적화
- **이미지 최적화**: 적응형 이미지 로딩
- **메모화**: useMemo, useCallback을 통한 렌더링 최적화
