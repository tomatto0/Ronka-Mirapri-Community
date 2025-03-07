<div align="center">
 <a href="https://lookbook.ronkacloset.com/">
<img alt="lookbook logo" src="ronka-mirapri-community/public/img/titlelogo.svg" height="50">
  <h1>RONKA LOOKBOOK</h1>
  </a>
</div>

## 프로젝트 소개

본 프로젝트는 [롱카의 옷장?](https://ronkacloset.com/) 서브 프로젝트로, 간단하게 <strong>파이널판타지14의 코디 이미지를 생성</strong>하여 백업 & 자랑할 수 있는 커뮤니티입니다.
1차 프로젝트 [🔗FFXIV-KOR MIRAPRI GENERATOR 바로가기](https://github.com/tomatto0/Ronka-Mirapri)의 투영기록 생성기는 Generator Page에 포함되었습니다.

### 작업기간

2025/1/15 ~ 2024/2/28(1차 배포)

<br/>

## 주요 기술 요약

#### GCS를 통한 이미지 관리

- **Google Cloud Storage (GCS)**를 활용한 이미지 업로드, 저장 및 관리 시스템 구축
- 업로드된 이미지의 최적화 (WebP 변환, 크기 조정 등)
- Next.js API Routes를 이용한 이미지 업로드 핸들링

#### NextAuth를 통한 권한 관리

- NextAuth.js를 이용한 세션 기반의 인증 시스템
- Google OAuth 2.0 API를 통한 유저 인증 시스템 구축
- 사용자 역할(Role) 및 권한(Role-based Access Control) 관리

#### Infinite Scroll 구현

- useInfiniteQuery를 활용한 데이터 무한 로딩
- Intersection Observer를 활용한 최적화된 스크롤 감지
- 서버에서 페이지네이션 API를 이용한 효율적인 데이터 로딩

<br/>

## Skills

![Next JS](https://img.shields.io/badge/NextJs-black?style=for-the-badge&logo=next.js&logoColor=white)
![Canvas API](https://img.shields.io/badge/Canvas%20API-%234DC730.svg?style=for-the-badge&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Pandas](https://img.shields.io/badge/pandas-%23150458.svg?style=for-the-badge&logo=pandas&logoColor=white)
![Prettier](https://img.shields.io/badge/prettier-%23F7B93E.svg?style=for-the-badge&logo=prettier&logoColor=black)
![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white)
![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white)

## 팀원 소개

<div align="center">
  
|<img src="readme_image/profile_tomato.jpg" width="100" height="100"/>|<img src="readme_image/profile_cdtd.png" width="100" height="100"/>|
|:---:|:---:|
| [최수진](https://github.com/tomatto0) | [박건](https://github.com/C-dtd) |

</div>

</br>

## Flow chart

<details>
<summary>게시글 작성페이지 유저플로우</summary>
![flowImg](ronka-mirapri-community/public/readme/write-userflow.jpg)

</details>

<details>
<summary>사용자 인증 유저 플로우 </summary>
![flowImg](ronka-mirapri-community/public/readme/auth-userflow.jpg)
</details>

## 📙 기획 문서

<details>
<summary>프로젝트 노션</summary>

[🔗 Notion 바로가기](https://ronkacloset.notion.site/Beta-16dd5a9efb39804a8e52dc6c8328e950?pvs=4)

[![Notion](readme_image/notion.jpg)](https://ronkacloset.notion.site/Beta-16dd5a9efb39804a8e52dc6c8328e950?pvs=4)

</details>

<details>
<summary>FIGMA</summary>

[🔗 FIGMA 바로가기](https://www.figma.com/design/ouijMd8W4P0kQeEtyWoJs0/Ronka-mirapri-%ED%99%94%EB%A9%B4%EA%B3%84%ED%9A%8D%EC%84%9C-%EC%99%B8%EB%B6%80%EA%B3%B5%EA%B0%9C%EC%9A%A9?node-id=0-1&t=rLXAYgQvFAo3t6Jt-1)

[![피그마 화면계획서](readme_image/figma.jpg)](https://www.figma.com/design/ouijMd8W4P0kQeEtyWoJs0/Ronka-mirapri-%ED%99%94%EB%A9%B4%EA%B3%84%ED%9A%8D%EC%84%9C-%EC%99%B8%EB%B6%80%EA%B3%B5%EA%B0%9C%EC%9A%A9?node-id=0-1&t=rLXAYgQvFAo3t6Jt-1)

</details>

---

## 페이지 주요 기능

#### Gallery

![flowImg](ronka-mirapri-community/public/readme/gallery.gif)

- 필터기능을 사용해서 원하는 종족, 직업, 아이템에 맞는 코디만 볼 수 있습니다.
- 주간인기 TOP 10 아이템 리스트를 롤링으로 제공하여 흥미유도
