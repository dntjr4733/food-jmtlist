/*
 * 맛집 추가 방법
 * 아래 RESTAURANTS 배열에 예시와 같은 객체를 복사해 내용을 바꾸면 됩니다.
 *
 * id: 겹치지 않는 영문/숫자 ID
 * category: "밥집", "카페", "술집", "디저트" 중 하나
 * lat, lng: 구글/카카오맵 등에서 확인한 위도와 경도
 * visited: 방문 여부 (true/false)
 * revisit: 재방문 의사 (true/false)
 * recommendedMenu: 메뉴 목록 중 내가 가장 추천하는 메뉴 이름
 * menus: 메뉴 이름, 가격, 한줄평, 먹어본 여부
 */
const RESTAURANTS = [
  {
    id: "seongsu-noodle",
    name: "성수면옥",
    area: "서울 성수동",
    category: "밥집",
    rating: 4.8,
    recommendedMenu: "들기름 메밀면",
    menus: [
      {
        name: "들기름 메밀면",
        price: "12,000원",
        note: "고소한 향이 진하고 면이 탱글하다",
        tried: true,
      },
      {
        name: "수육",
        price: "18,000원",
        note: "부드럽고 메밀면과 잘 어울린다",
        tried: true,
      },
      {
        name: "비빔 메밀면",
        price: "12,000원",
        note: "아직 먹어보지 않음",
        tried: false,
      },
    ],
    priceRange: "1~2만원",
    note: "면의 고소한 향이 오래 남는다. 평일 점심에도 줄이 있으니 조금 일찍 갈 것.",
    visited: true,
    revisit: true,
    lat: 37.5447,
    lng: 127.0557,
  },
  {
    id: "yeonnam-coffee",
    name: "연남서재",
    area: "서울 연남동",
    category: "카페",
    rating: 4.5,
    recommendedMenu: "무화과 토스트",
    menus: [
      {
        name: "무화과 토스트",
        price: "11,000원",
        note: "과일과 크림의 단맛이 과하지 않다",
        tried: true,
      },
      {
        name: "필터 커피",
        price: "7,000원",
        note: "향이 깨끗하고 토스트와 잘 맞는다",
        tried: true,
      },
      {
        name: "바닐라 라테",
        price: "6,500원",
        note: "아직 먹어보지 않음",
        tried: false,
      },
    ],
    priceRange: "1만원대",
    note: "창가 자리가 좋고 음악이 조용하다. 책 읽으러 혼자 가기 좋은 곳.",
    visited: true,
    revisit: true,
    lat: 37.5624,
    lng: 126.9236,
  },
  {
    id: "euljiro-bar",
    name: "을지로 잔",
    area: "서울 을지로",
    category: "술집",
    rating: 4.3,
    recommendedMenu: "전통주 샘플러",
    menus: [
      {
        name: "전통주 샘플러",
        price: "18,000원",
        note: "취향에 맞는 술을 찾기 좋다",
        tried: true,
      },
      {
        name: "감자전",
        price: "16,000원",
        note: "가장자리가 바삭하고 속은 촉촉하다",
        tried: true,
      },
      {
        name: "두부김치",
        price: "17,000원",
        note: "아직 먹어보지 않음",
        tried: false,
      },
    ],
    priceRange: "2~3만원",
    note: "전통주 설명을 친절하게 해준다. 2차보다는 천천히 시작하는 1차로 추천.",
    visited: true,
    revisit: false,
    lat: 37.5661,
    lng: 126.991,
  },
  {
    id: "mangwon-dessert",
    name: "망원 버터상점",
    area: "서울 망원동",
    category: "디저트",
    rating: 4.7,
    recommendedMenu: "소금 버터 스콘",
    menus: [
      {
        name: "소금 버터 스콘",
        price: "4,500원",
        note: "퍽퍽하지 않고 버터 향이 진하다",
        tried: true,
      },
      {
        name: "레몬 케이크",
        price: "5,500원",
        note: "상큼하고 포장해도 맛있다",
        tried: true,
      },
      {
        name: "초콜릿 쿠키",
        price: "4,000원",
        note: "아직 먹어보지 않음",
        tried: false,
      },
    ],
    priceRange: "1만원 이하",
    note: "스콘이 퍽퍽하지 않고 버터 향이 진하다. 레몬 케이크는 포장해도 맛있다.",
    visited: true,
    revisit: true,
    lat: 37.5562,
    lng: 126.9018,
  },
  {
    id: "haebang-wish",
    name: "해방촌 작은식탁",
    area: "서울 해방촌",
    category: "밥집",
    rating: 0,
    recommendedMenu: "",
    menus: [
      {
        name: "계절 솥밥",
        price: "18,000원",
        note: "아직 먹어보지 않음",
        tried: false,
      },
      {
        name: "된장 전골",
        price: "16,000원",
        note: "아직 먹어보지 않음",
        tried: false,
      },
    ],
    priceRange: "2만원대",
    note: "계절마다 솥밥 구성이 바뀐다고 한다. 다음 해방촌 산책 때 꼭 들러보기.",
    visited: false,
    revisit: false,
    lat: 37.5441,
    lng: 126.9876,
  },
];
