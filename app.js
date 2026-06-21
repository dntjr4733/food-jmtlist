const FILTERS = ["전체", "밥집", "카페", "술집", "디저트", "가고 싶은 곳", "재방문"];

const state = {
  restaurants: [],
  filter: "전체",
  query: "",
  markers: new Map(),
};

const elements = {
  list: document.querySelector("#restaurant-list"),
  empty: document.querySelector("#empty-state"),
  filters: document.querySelector("#filters"),
  search: document.querySelector("#search-input"),
  resultCount: document.querySelector("#result-count"),
  totalCount: document.querySelector("#total-count"),
  visitedCount: document.querySelector("#visited-count"),
  revisitCount: document.querySelector("#revisit-count"),
  detailDialog: document.querySelector("#detail-dialog"),
  detailContent: document.querySelector("#detail-content"),
};

const map = L.map("map", { zoomControl: false }).setView([37.556, 126.978], 12);
L.control.zoom({ position: "bottomright" }).addTo(map);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const markerLayer = L.layerGroup().addTo(map);

function loadRestaurants() {
  state.restaurants = [...RESTAURANTS];
}

function createFilters() {
  FILTERS.forEach((filter) => {
    const button = document.createElement("button");
    button.className = `filter-button${filter === state.filter ? " active" : ""}`;
    button.type = "button";
    button.textContent = filter;
    button.addEventListener("click", () => {
      state.filter = filter;
      document.querySelectorAll(".filter-button").forEach((item) => {
        item.classList.toggle("active", item.textContent === filter);
      });
      render();
    });
    elements.filters.append(button);
  });
}

function getFilteredRestaurants() {
  const query = state.query.trim().toLocaleLowerCase("ko");
  return state.restaurants.filter((restaurant) => {
    const matchesFilter =
      state.filter === "전체" ||
      state.filter === restaurant.category ||
      (state.filter === "가고 싶은 곳" && !restaurant.visited) ||
      (state.filter === "재방문" && restaurant.revisit);
    const searchable = [
      restaurant.name,
      restaurant.area,
      restaurant.category,
      restaurant.recommendedMenu,
      ...restaurant.menus.flatMap((menu) => [menu.name, menu.price, menu.note]),
      restaurant.note,
    ]
      .join(" ")
      .toLocaleLowerCase("ko");
    return matchesFilter && (!query || searchable.includes(query));
  });
}

function render() {
  const restaurants = getFilteredRestaurants();
  renderCards(restaurants);
  renderMarkers(restaurants);
  elements.resultCount.textContent = `${restaurants.length}개의 장소`;
  elements.empty.hidden = restaurants.length !== 0;
  updateStats();
}

function renderCards(restaurants) {
  elements.list.replaceChildren();
  const template = document.querySelector("#card-template");

  restaurants.forEach((restaurant) => {
    const card = template.content.firstElementChild.cloneNode(true);
    card.dataset.id = restaurant.id;
    card.querySelector(".category-badge").textContent = restaurant.category;
    card.querySelector(".visit-badge").textContent = restaurant.visited ? "다녀옴" : "가고 싶음";
    card.querySelector(".rating").textContent = restaurant.visited
      ? `★ ${restaurant.rating.toFixed(1)}`
      : "☆ 미방문";
    card.querySelector("h3").textContent = restaurant.name;
    card.querySelector(".area").textContent = restaurant.area;
    card.querySelector(".menu").textContent =
      restaurant.recommendedMenu || "아직 추천 메뉴가 없어요";
    card.querySelector(".price").textContent = restaurant.priceRange;
    card.addEventListener("click", () => focusRestaurant(restaurant));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        focusRestaurant(restaurant);
      }
    });
    card.addEventListener("mouseenter", () => {
      state.markers.get(restaurant.id)?.openPopup();
    });
    elements.list.append(card);
  });
}

function createMarkerIcon(restaurant) {
  return L.divIcon({
    className: "",
    html: `<div class="map-pin ${restaurant.visited ? "" : "wish"}"><span>${
      restaurant.visited ? "●" : "♡"
    }</span></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 34],
    popupAnchor: [0, -31],
  });
}

function renderMarkers(restaurants) {
  markerLayer.clearLayers();
  state.markers.clear();
  restaurants.forEach((restaurant) => {
    const marker = L.marker([restaurant.lat, restaurant.lng], {
      icon: createMarkerIcon(restaurant),
      title: restaurant.name,
    });
    marker.bindPopup(
      `<div class="popup-title">${escapeHtml(restaurant.name)}</div>
       <div class="popup-area">${escapeHtml(restaurant.area)} · ${escapeHtml(restaurant.category)}</div>`,
    );
    marker.on("click", () => {
      selectCard(restaurant.id);
      showDetails(restaurant.id);
    });
    marker.addTo(markerLayer);
    state.markers.set(restaurant.id, marker);
  });
}

function focusRestaurant(restaurant) {
  map.flyTo([restaurant.lat, restaurant.lng], 15, { duration: 0.8 });
  state.markers.get(restaurant.id)?.openPopup();
  selectCard(restaurant.id);
  showDetails(restaurant.id);
}

function selectCard(id) {
  document.querySelectorAll(".restaurant-card").forEach((card) => {
    card.classList.toggle("selected", card.dataset.id === id);
  });
}

function fitFilteredMarkers() {
  const restaurants = getFilteredRestaurants();
  if (!restaurants.length) return;
  const bounds = L.latLngBounds(restaurants.map(({ lat, lng }) => [lat, lng]));
  map.fitBounds(bounds, { padding: [45, 45], maxZoom: 15 });
}

function updateStats() {
  elements.totalCount.textContent = state.restaurants.length;
  elements.visitedCount.textContent = state.restaurants.filter(({ visited }) => visited).length;
  elements.revisitCount.textContent = state.restaurants.filter(({ revisit }) => revisit).length;
}

function showDetails(id) {
  const restaurant = state.restaurants.find((item) => item.id === id);
  if (!restaurant) return;
  const kakaoQuery = encodeURIComponent(`${restaurant.name} ${restaurant.area}`);
  const sortedMenus = [...restaurant.menus].sort((a, b) => Number(b.tried) - Number(a.tried));

  elements.detailContent.innerHTML = `
    <div class="detail-cover">
      <div>
        <span>${escapeHtml(restaurant.category)} · ${
          restaurant.visited ? "다녀온 곳" : "가고 싶은 곳"
        }</span>
        <h2>${escapeHtml(restaurant.name)}</h2>
        <p>${escapeHtml(restaurant.area)}</p>
      </div>
    </div>
    <div class="detail-body">
      <div class="detail-grid">
        <div class="detail-item"><small>내 평점</small><strong>${
          restaurant.visited ? `★ ${restaurant.rating.toFixed(1)}` : "아직 미방문"
        }</strong></div>
        <div class="detail-item"><small>나의 추천</small><strong>${
          restaurant.recommendedMenu
            ? escapeHtml(restaurant.recommendedMenu)
            : "아직 추천 메뉴 없음"
        }</strong></div>
        <div class="detail-item"><small>가격대</small><strong>${escapeHtml(
          restaurant.priceRange,
        )}</strong></div>
        <div class="detail-item"><small>재방문 여부</small><strong>${
          restaurant.revisit ? "또 갈래요" : "아직 고민 중"
        }</strong></div>
      </div>
      <div class="detail-note">“${escapeHtml(restaurant.note)}”</div>
      <section class="menu-section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">MENU NOTES</p>
            <h3>메뉴</h3>
          </div>
          <span>먹어본 메뉴부터 표시해요</span>
        </div>
        <ol class="menu-list">
          ${sortedMenus
            .map(
              (menu) => `
                <li class="${menu.tried ? "tried" : "not-tried"}">
                  <div class="menu-main">
                    <strong>${escapeHtml(menu.name)}</strong>
                    <span>${escapeHtml(menu.price || "가격 미정")}</span>
                    ${
                      restaurant.recommendedMenu === menu.name
                        ? '<mark>나의 추천</mark>'
                        : ""
                    }
                  </div>
                  <p>${escapeHtml(menu.tried ? menu.note : menu.note || "아직 먹어보지 않음")}</p>
                </li>`,
            )
            .join("")}
        </ol>
      </section>
      <a class="primary-button" href="https://map.kakao.com/link/search/${kakaoQuery}" target="_blank" rel="noopener noreferrer">
        카카오맵으로 가기 ↗
      </a>
    </div>
  `;
  if (!elements.detailDialog.open) {
    elements.detailDialog.showModal();
  }
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = String(value);
  return div.innerHTML;
}

elements.search.addEventListener("input", (event) => {
  state.query = event.target.value;
  render();
});

document.querySelector("#fit-map").addEventListener("click", fitFilteredMarkers);

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => document.querySelector(`#${button.dataset.close}`).close());
});

document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

loadRestaurants();
createFilters();
render();
fitFilteredMarkers();
