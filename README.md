# ShongShong-Tour ( 3차 프로젝트 )
- 과정명 : 오르미 프론트엔드 개발자 양성
- 기간 : 2025.10.16 ~ 2026.03.05
- 3차 프로젝트 : 2026.02.03 ~ 2026.03.05

## 빠른 링크
- 피그마 슬라이드 : https://www.figma.com/slides/fl9n9joG0tqarQrM8X93Et
- 배포 : https://shongshong-tour.vercel.app/
- ERD : https://supabase.com/dashboard/project/yitjrbalphdirtyijsjn/sql/26cbb059-a163-44df-af88-511c3d7afe5d

## 1. 프로젝트 개요

### 1-1. 목표

#### AI 기술을 활용하여 여행 상품 정보를 효율적으로 관리하고 생성하는 서비스.
- 상품명, 가격, 출발 일정 등의 기본 정보를 입력하면
- AI가 자동으로 상품 상세 설명을 생성하여 
- 관리자의 상품 등록 및 관리 업무를 간소화

### 1-2. 팀원
| 이름 | 역할 | 주요 담당 | 연락 |
| --- | --- | --- | --- |
| 신찬섭 | 팀장 | 디자인, ERD, 메인페이지, 결제페이지, 로그인/회원가입페이지 구현 | haini000@naver.com |
| 김두현 | 팀원 | 디자인, Supabase, Git 병합, 메인페이지, 관리자 페이지 구현 | duhyeon467@gmail.com |
| 이세나 | 팀원 | 장바구니 페이지 구현 | tpsk1545@gmail.com |

### 1-3. 마일스톤

#### 1주차 : 기획
- 기술스택 정리 및 테마 선택
- 여행사 사이트 벤치마킹
- Git , Figma 생성

#### 2주차 : 디자인
- ERD , 스토리보드 작성
- 스토리 보드 활용 stitch 디자인 출력

#### 3주차 : 설계
- 장바구니 + 결제 ( CRUD )
- 관리자 AI 상세 설명 + 상품 목록 ( CRUD )

#### 4주차 : 주요 기능 구현
1. 사용자
- 회원가입 / 로그인 (Supabase Auth)
- 장바구니 기능 (Local + DB 연동)

2. 관리자
- 상품 CRUD
- AI 상세 설명 자동 생성

## 2. 개발 환경
Frontend
- Framework : React - 컴포넌트 기반 구조로 재사용성과 유지보수성 확보
- Language : TypeScript - 정적 타입으로 런타임 오류 최소화
- Styling : SCSS - 변수 및 중첩 구조를 활용한 스타일 관리
- Routing : React Vite - 빠른 빌드 속도와 개발 생산성 향상

Backend
- Datebase : Supabase
- Auth : Supabase
- Storage : Supabase

Tools
- Design : Figma
- Deployment : Vercel
- Version Control : Git & GitHub

## 3. 라우트 구조
| 경로 | 설명 | 접근 권한 |
| / | 메인 | 전체 |
| /login | 로그인 | 전체 |
| /join | 회원가입 | 전체 |
| /cart | 장바구니 | 개인 |
| /checkout | 결제 | 개인 |
| /admin | 관리자 대시보드 | 관리자 |
| /admin/products/new | 상품 추가 | 관리자 |
| /admin/products/:id/edit | 상품 수정 | 관리자 |

## 4. 시스템 구조

User → React (Vite) → Supabase (Auth, DB, Storage)
                        ↓
                      OpenAI API (AI 상품 설명 생성)