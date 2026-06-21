# 한입지도

Leaflet과 OpenStreetMap을 사용한 개인 맛집 지도입니다. 서버나 빌드 과정 없이 HTML, CSS,
JavaScript 정적 파일만으로 작동하며 GitHub Pages에 바로 배포할 수 있습니다.

## 파일 구조

```text
.
├── index.html       # 화면 구조
├── style.css        # 반응형 디자인
├── app.js           # 지도, 검색, 필터, 카드, 로컬 데모 기능
├── restaurants.js   # 맛집 데이터
└── README.md
```

## 맛집 추가하기

`restaurants.js`의 `RESTAURANTS` 배열에 기존 객체 하나를 복사한 뒤 내용을 수정합니다.

```js
{
  id: "unique-id",
  name: "맛집 이름",
  area: "서울 성수동",
  category: "중식", // 한식, 일식, 중식, 카페-디저트, 기타
  rating: 4.8,
  recommendedMenu: "짬뽕",
  menus: [
    {
      name: "짬뽕",
      price: "6,000원",
      note: "단순한 짬뽕",
      tried: true
    },
    {
      name: "양장피",
      price: "가격 미정",
      note: "아직 먹어보지 않음",
      tried: false
    }
  ],
  priceRange: "1~2만원",
  note: "내 메모",
  visited: true,
  revisit: true,
  lat: 37.5447,
  lng: 127.0557
}
```

- `id`는 다른 맛집과 겹치지 않게 작성합니다.
- `category`는 `한식`, `일식`, `중식`, `카페-디저트`, `기타` 중 하나를 사용합니다.
- 가고 싶은 곳은 `visited: false`로 설정합니다.
- `menus`에는 메뉴를 원하는 만큼 추가할 수 있습니다.
- 먹어본 메뉴는 `tried: true`, 아직 안 먹어본 메뉴는 `tried: false`로 적습니다.
- 화면에서는 먹어본 메뉴가 자동으로 위에 표시됩니다.
- `recommendedMenu`에는 `menus`에 입력한 메뉴 중 하나의 이름을 똑같이 적습니다.
- 위도와 경도는 지도 서비스에서 장소를 검색해 확인할 수 있습니다.
- 파일을 수정해 GitHub에 다시 올리면 배포 사이트에도 반영됩니다.

코드를 직접 수정하기 어렵다면 [`맛집-등록-양식.md`](맛집-등록-양식.md)의 양식을 복사해
메모에 작성한 뒤 Codex에게 추가를 요청하면 됩니다.

## 로컬에서 확인하기

`index.html`을 직접 열어도 기본 화면은 작동합니다. 다만 브라우저 보안 정책에 따라 일부 기능이
제한될 수 있으므로 간단한 로컬 서버 사용을 권장합니다.

```bash
python3 -m http.server 8000
```

그다음 브라우저에서 `http://localhost:8000`을 엽니다.

## GitHub Pages 배포 방법

1. GitHub에서 새 저장소(repository)를 만듭니다.
2. 이 폴더의 `index.html`, `style.css`, `app.js`, `restaurants.js`, `README.md`를 저장소
   최상단에 업로드합니다.
3. 저장소의 **Settings → Pages**로 이동합니다.
4. **Build and deployment**의 Source를 **Deploy from a branch**로 선택합니다.
5. Branch를 `main`, 폴더를 `/(root)`로 선택하고 **Save**를 누릅니다.
6. 잠시 후 표시되는 `https://사용자명.github.io/저장소명/` 주소로 접속합니다.

## 관리자와 코멘트 기능

첫 공개 버전에서는 관리자 로그인과 방문자 코멘트 기능을 포함하지 않았습니다.

GitHub Pages만으로 비밀번호와 댓글을 구현하면 실제 보안을 제공할 수 없고, 댓글도 작성한 사람의
브라우저에만 보여 혼란이 생기기 때문입니다. 현재는 `restaurants.js`를 수정해 맛집을 관리하는
방식이 가장 안전하고 단순합니다.

나중에 이 기능이 꼭 필요해지면 별도 서버를 직접 운영하기보다 **Supabase** 같은 관리형 서비스를
연결하는 방식을 권장합니다. 그때 관리자 로그인, 공용 댓글 저장, 댓글 수정·삭제 권한을 함께
구현할 수 있습니다.

## 외부 서비스

- 지도: [Leaflet](https://leafletjs.com/)
- 지도 타일: [OpenStreetMap](https://www.openstreetmap.org/)
- 길찾기/장소 검색: 카카오맵 검색 링크

인터넷 연결이 있어야 지도 타일과 웹 폰트를 불러올 수 있습니다.
