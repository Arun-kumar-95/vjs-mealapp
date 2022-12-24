// GLOBALS

const mealDIV = document.querySelector("div.card__container");
const favBtn = document.querySelector("button#favBtn");
const favListDIV = document.querySelector("div.list");
const favDIV = document.querySelector("div.favlist__container");
const closeBtn = document.getElementById("closeBtn");

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
    for (let i = 0; i < likedMeal.length; i++) {
      if (likedMeal[i].idMeal == idMeal) {
        isLiked = true;
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

  if (favListNumber != null) {
    if (favListNumber.length < 9) {
      favBtn.children[1].textContent = "0" + favListNumber.length;
    } else {
      // UPDATE THE FAV LIST NUMBER
      favBtn.children[1].textContent = favListNumber.length;
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
