// GLOBALS

const mealDIV = document.querySelector("div.card__container");
const favBtn = document.querySelector("button.favBtn");
const favListDIV = document.querySelector("div.list");
const favDIV = document.querySelector("div.favlist__container");
const mealContainer = document.querySelector(".meal__container");

// FAB LIST ARRAY
let likedMeal = [];
let meals = [];
//  GET ALL MEALS
export const getMeals = async () => {
  let loader = `<center><span class="loader">Loading</span></center>`;
  mealDIV.innerHTML = loader;

  let fetchResp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s="
  );
  let resp = await fetchResp.json();
  meals = resp.meals;
  return meals;
};

// LOAD MEALS
export const loadMeals = (mealData) => {
  let likedMeal = JSON.parse(localStorage.getItem("mealsId"));

  const cardWRAP = document.createElement("div");
  cardWRAP.setAttribute("class", "card__wrap");
  // apply the for each loop
  mealData.forEach((meal, index) => {
    // destructuring the importatant elements
    const { idMeal, strMealThumb, strCategory, strMeal } = meal;
    let isLiked = false;

    // changing the like thumb if liked
    if (likedMeal != null) {
      for (let i = 0; i < likedMeal.length; i++) {
        if (likedMeal[i].idMeal == idMeal) {
          isLiked = true;
        }
      }
    }

    cardWRAP.innerHTML += `
         <div class="card" id="${idMeal}">
                             <div class="card__image" style="background-image: url('${strMealThumb}')"></div>
                             <div class="tags">
                                 <span>${strCategory}</span>
                             </div>
                             <h1>${strMeal}</h1>
                             <div class="card-control">
                               <button class="likeBtn ${
                                 isLiked ? "active" : "unactive"
                               } " id=${idMeal} idx="${index}"> </button>
                               <button class="readMore" data-id=${idMeal}>Read more</button>
                             </div>
                         </div>
         `;
  });

  mealDIV.innerHTML = "";
  mealDIV.append(cardWRAP);
};

// LIKE THUMB EVENT HANDLER
export const likeThumbHandler = (likeThumbsBtns) => {
  Array.from(likeThumbsBtns).forEach((likeThumb) => {
    likeThumb.addEventListener("click", (e) => {
      var mealId = e.target.getAttribute("id");
      if (e.target.classList.contains("active")) {
        removeMealFromList(mealId);
        e.target.classList.remove("active");
      } else {
        addMealToList(mealId);
        e.target.classList.add("active");
      }
    });
  });
};

// ADD MEAL TO LIST

const addMealToList = (mealId) => {
  let mealsId = mealId;
  var mealObj = { idMeal: mealsId };

  if (localStorage.getItem("mealsId") == null) {
    likedMeal.push(mealObj);
    localStorage.setItem("mealsId", JSON.stringify(likedMeal));
  } else {
    let mealsId = JSON.parse(localStorage.getItem("mealsId"));
    if (mealId != mealsId) {
      likedMeal.push(mealObj);
      localStorage.setItem("mealsId", JSON.stringify(likedMeal));
    }
  }

  // UPDATE FAV LIST
  updateFavList();
};

// REMOVE FAv MEAL FROM LIST
const removeMealFromList = () => {
  if (localStorage.getItem("mealsId")) {
    likedMeal = JSON.parse(localStorage.getItem("mealsId"));
    let count = likedMeal.length - 1;
    likedMeal.splice(count, 1);
    localStorage.setItem("mealsId", JSON.stringify(likedMeal));
  }

  updateFavList();
};

// UPDATE FAV LIST
export const updateFavList = () => {
  // GET ALL THE FAV LIST FROM LOCAL STORAGE
  let favListNumber = JSON.parse(localStorage.getItem("mealsId"));
  const span = document.querySelector("span.totalItem");
  if (favListNumber != null) {
    if (favListNumber.length < 9) {
      span.textContent = "0" + favListNumber.length;
    } else {
      // UPDATE THE FAV LIST NUMBER
      span.textContent = favListNumber.length;
    }
  }
};

// DISPLAY FAV LIST SIDE BAR
export const sideBarFavriteSlider = (sidebar) => {
  sidebar.addEventListener("click", () => {
    let state = favDIV.getAttribute("aria-hidden");
    state === "true"
      ? favDIV.setAttribute("aria-hidden", "false")
      : favDIV.setAttribute("aria-hidden", "true");

    showFavList();
    document.querySelector(".fav-list-wrapper").style.visibility = "visible";
  });
};

//SHOW FAV LIST
export const showFavList = () => {
  let likedMeal = JSON.parse(localStorage.getItem("mealsId"));
  favDIV.children[1].textContent = "Total item:" + likedMeal.length;
  favListDIV.innerHTML = "";
  if (likedMeal.length > 0 && likedMeal !== null) {
    let loader = `<center><span class="loader">Loading</span></center>`;
    favListDIV.innerHTML = loader;
    let count = 1;
    const ul = document.createElement("ul");
    ul.setAttribute("class", "fav-list");
    for (let i = 0; i < likedMeal.length; i++) {
      let fetchResp = fetch(
        "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" +
          likedMeal[i].idMeal
      );
      fetchResp
        .then((response) => response.json())
        .then((data) => {
          // LOAD THE MEALS
          let meal = data.meals[0];

          let li = document.createElement("li");
          li.innerHTML = `
          <div>
            <span>${count++}</span>
            <img src="${meal.strMealThumb}" />
            <p>${meal.strMeal}</p>
     </div>
        <button class="removeList" id="${meal.idMeal}" idx=${i}>
            <svg fill="currentColor" viewBox="0 0 24 24" focusable="false" style="pointer-events: none; display: block;">
            <g>
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
            </g>
          </svg>
       </button>
      `;
          ul.appendChild(li);
        });
    }

    favListDIV.innerHTML = "";
    favDIV.children[1].textContent = "Total item:" + likedMeal.length;
    favListDIV.appendChild(ul);
  }
};

// REMOVE THE FAVITEM FROM SLIDER

export const removeFavItemFromList = (container) => {
  container.addEventListener("click", (e) => {
    let idx = e.target.getAttribute("idx");
    let id = e.target.getAttribute("id");

    if (idx == null) {
      return;
    }

    if (localStorage.getItem("mealsId")) {
      likedMeal = JSON.parse(localStorage.getItem("mealsId"));
      likedMeal.splice(idx, 1);
      localStorage.setItem("mealsId", JSON.stringify(likedMeal));
    }

    // UPDATE THE FAV LIST NUMBER
    updateFavList();
    showFavList();
    updateLikeThumbDOM(id);
  });
};

// update the thumb icon on deleting from the slider favourite
export const updateLikeThumbDOM = (mealId) => {
  const likedBtns = document.querySelectorAll("button.likeBtn");
  likedBtns.forEach((like) => {
    if (mealId === like.getAttribute("id")) {
      like.classList.remove("active");
      like.classList.add("unactive");
    }
  });
};
// EVENT HANDLER FOR CLOSING THE SLIDER FAVROURITE LIST
export const closeSliderHandler = (slider) => {
  slider.addEventListener("click", () => {
    let state = favDIV.getAttribute("aria-hidden");
    state === "true"
      ? favDIV.setAttribute("aria-hidden", "false")
      : favDIV.setAttribute("aria-hidden", "true");

    setTimeout(() => {
      document.querySelector(".fav-list-wrapper").style.visibility = "hidden";
    }, 300);
  });
};

// GET MEAL BY SEARCH HANDLER
export const getMealsBySearch = async (searchText) => {
  let loader = `<center><span class="loader">Loading</span></center>`;
  mealDIV.innerHTML = loader;

  let fetchResp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + searchText
  );
  let resp = await fetchResp.json();
  meals = resp.meals;
  return meals;
};

// READ MORE BUTTON HANDLER
export const readMoreHandler = (readmoreBtns) => {
  Array.from(readmoreBtns).forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      let recipeId = e.target.getAttribute("data-id");
      window.open(`meal.html?id=${recipeId}`);
    });
  });
};

// GET MEAL BY ID HANDLER
export const getMealById = async (id) => {
  document.querySelector(".loader").style.display = "block";

  let fetchResp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );
  let resp = await fetchResp.json();
  meals = resp.meals[0];
  return meals;
};

//   LOAD MEAL INFO
export const loadMealDetails = (mealData) => {
  let html = `
    <div class="meal__info__container">
    <h3>Meal id: #${mealData.idMeal}</h3>
    <h1>${mealData.strMeal}</h1>
  
    <div class="meal__wrapper">
        <div class="meal__image" style="background-image: url('${mealData.strMealThumb}')"></div>
        <a class="watchBtn" href="${mealData.strYoutube}">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M7.5 7.325V12.675C7.5 13.075 7.675 13.3667 8.025 13.55C8.375 13.7333 8.71667 13.7167 9.05 13.5L13.2 10.85C13.5167 10.6667 13.675 10.3833 13.675 10C13.675 9.61667 13.5167 9.33333 13.2 9.15L9.05 6.5C8.71667 6.28333 8.375 6.26667 8.025 6.45C7.675 6.63333 7.5 6.925 7.5 7.325ZM10 20C8.61667 20 7.31667 19.7373 6.1 19.212C4.88333 18.6873 3.825 17.975 2.925 17.075C2.025 16.175 1.31267 15.1167 0.788 13.9C0.262667 12.6833 0 11.3833 0 10C0 8.61667 0.262667 7.31667 0.788 6.1C1.31267 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.31233 6.1 0.787C7.31667 0.262333 8.61667 0 10 0C11.3833 0 12.6833 0.262333 13.9 0.787C15.1167 1.31233 16.175 2.025 17.075 2.925C17.975 3.825 18.6873 4.88333 19.212 6.1C19.7373 7.31667 20 8.61667 20 10C20 11.3833 19.7373 12.6833 19.212 13.9C18.6873 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6873 13.9 19.212C12.6833 19.7373 11.3833 20 10 20ZM10 18C12.2167 18 14.1043 17.221 15.663 15.663C17.221 14.1043 18 12.2167 18 10C18 7.78333 17.221 5.89567 15.663 4.337C14.1043 2.779 12.2167 2 10 2C7.78333 2 5.896 2.779 4.338 4.337C2.77933 5.89567 2 7.78333 2 10C2 12.2167 2.77933 14.1043 4.338 15.663C5.896 17.221 7.78333 18 10 18Z"
                    fill="#272D2F" />
            </svg>
            <span>Watch</span>
        </a>
    </div>
  
    <div class="meal__instruction">
    </div>
  </div>
    `;

  document.querySelector(".loader").style.display = "none";
  mealContainer.innerHTML += html;
};

//   LOAD MEAL INSTRUCTION
export const loadMealInstruction = (mealData) => {
  let info = mealData.strInstructions;
  let infoText = [];
  infoText = info.split("\n");
  let ul = document.createElement("ul");
  infoText.forEach((text) => {
    let li = document.createElement("li");
    let p = document.createElement("p");
    p.textContent = text;
    li.appendChild(p);

    ul.appendChild(li);
  });
  document.querySelector(".meal__instruction").appendChild(ul);
};
