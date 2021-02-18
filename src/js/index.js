// api 요청
function loadCards(classes = "Hunter") {
  toggleLoadingModal("display"); // 로딩바 표시
  return fetch(
    `https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/classes/${classes}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-key": "745f20ba89msh9b59bad4cddf49fp1054dcjsn929dfab44a2a",
        "x-rapidapi-host": "omgvamp-hearthstone-v1.p.rapidapi.com",
      },
    },
  )
    .then((response) => response.json())
    .then((json) => json.filter((item) => item.img && item.cost).slice(0, 20));
}

// 로딩바 모달 제어
function toggleLoadingModal(type) {
  const modal = document.querySelector(".modal");
  if (type === "display") {
    loadModalImg("src/img/loading.gif", modal);
    modal.classList.add("display");
  } else {
    modal.classList.remove("display");
  }
}

// 모달 이미지 로드
function loadModalImg(url, modal) {
  const img = document.createElement("img");
  img.classList = "img__thumbnail";
  img.src = url;
  if (modal.hasChildNodes()) {
    modal.removeChild(modal.firstChild);
  }
  modal.appendChild(img);
}

// dom 동적 추가
function renderCards(cards) {
  const container = document.querySelector(".cards");
  container.innerHTML = cards.map((card) => getHTMLString(card)).join("");
}

// dom 문자열 반환
function getHTMLString(card) {
  return `<li class="card">
            <img
              src="${card.img}"
              alt="${card.name}"
              class="card__thumbnail"
            />
          </li>`;
}

// 모달 이벤트 리스너 등록
function setModalEventListener() {
  const cards = document.querySelector(".cards");
  const modal = document.querySelector(".modal");
  cards.addEventListener("click", (e) => onClickCard(e));
  modal.addEventListener("click", (e) => onClickCard(e));
}

// 카드 클릭 -> 모달 토글
function onClickCard(e) {
  const body = document.querySelector("body");
  const modal = document.querySelector(".modal");

  body.classList.toggle("noModal"); // CSS hover 제어
  setTimeout(() => modal.classList.toggle("display"), 300); // 토글

  if (e.target.tagName !== "IMG") {
    return;
  }
  if (e.target.classList.contains("img__thumbnail")) {
    return;
  }

  // card__thumbnail 클릭한 경우에만 모달 이미지 로드
  loadModalImg(e.target.src, modal);
}

// 버튼 이벤트 리스너 등록
function setBtnEventListener() {
  const buttons = document.querySelector(".buttons");
  buttons.addEventListener("click", (e) => reRenderCards(e));
}

//
function reRenderCards(e) {
  const { key, value } = e.target.dataset;

  if (!key || !value) {
    return;
  }

  // 직업군으로 api 재요청
  loadCards(value).then((cards) => {
    toggleLoadingModal("remove");
    renderCards(cards);
  });
}

/*
1. 페이지 첫 로딩 시 api 요청(디폴트: 사냥꾼) -> promise 반환
2. 데이터 로드 성공 시 카드목록 렌더링
3. 실패 시 실패문구 렌더링 
4. 이벤트 핸들러 등록: 버튼 클릭 시 카드목록 필터링(디스플레이 클래스로 제어)
*/
window.onload = function () {
  loadCards()
    .then((cards) => {
      toggleLoadingModal("remove");
      renderCards(cards); // 렌더

      // 이벤트 핸들러
      setModalEventListener(); // 카드 클릭
      setBtnEventListener(); // 버튼 클릭
    })
    .catch(console.log);
};
