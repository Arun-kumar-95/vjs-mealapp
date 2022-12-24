// IMPORT ALL THE FUNCTION AS APP AND JUST CALL
import * as app from "./main.js";

// GETTINNG ALL THE MEALS DATA AND STORING INSIDE MEALS
let meals = await app.getMeals();

// LOAD MEALS TO DOM
app.loadMeals(meals);

// UPDATE MEALS LIST TO DOM
app.updateFavList();

// getting all the likeThumb button
let likeThumbBtns = document.querySelectorAll("button.likeBtn");
app.likeThumbHandler(likeThumbBtns);

// getting all the read more buttons
let readMoreBtns = document.querySelectorAll("button.readMore");
// passing read more buttons as parameter
app.readMoreHandler(readMoreBtns);

// FAVLIST SIDE BAR
const favouriteButton = document.querySelector("button#favBtn");
app.sideBarFavriteSlider(favouriteButton);

const favouriteListContainer = document.querySelector("div.favlist__container");
const listContainer = favouriteListContainer.children[3];
const closeSliderFav = favouriteListContainer.children[0];

// REMOVE THE FAVITEM FROM SLIDER
app.removeFavItemFromList(listContainer);
// CLOSE THE SLIDER FAVLIST
app.closeSliderHandler(closeSliderFav);

const searchFormContainer = document.querySelector(
  "div.search__container form"
);

const searchField = searchFormContainer.querySelector("#searchInput");
const searchBtnElement = searchFormContainer.querySelector("#searchBtn");
const closeBtn = document.getElementById("closeBtn");

// SEARCH MEAL HANDLER
searchField.addEventListener("keyup", async () => {
  // STORING THE INPUT STRING INSIDE FILTER VARIABLE
  let filter = searchField.value.trim();

  filter !== ""
    ? (closeBtn.style.visibility = "visible")
    : (closeBtn.style.visibility = "hidden");
  //   INVOKING THE SEARCH MEAL FUNCTION
  meals = await app.getMealsBySearch(filter);
  // LOAD MEALS TO DOM
  app.loadMeals(meals);

  //   get all the like thumbs as it changes on search and call the like thumb handler
  likeThumbBtns = document.querySelectorAll("button.likeBtn");
  app.likeThumbHandler(likeThumbBtns);

  //   SAME FOR THE READMORE BUTTON
  readMoreBtns = document.querySelectorAll("button.readMore");
  // passing read more buttons as parameter
  app.readMoreHandler(readMoreBtns);
});

// LOAD MEALS WHEN WE PRESS SEARCH ICON
searchBtnElement.addEventListener("click", async (e) => {
  e.preventDefault();
  let filter = searchField.value.trim();
  if (searchField.value != "") {
    meals = await app.getMealsBySearch(filter);
    // LOAD MEALS TO DOM
    app.loadMeals(meals);
    searchField.blur();
    return;
  }
});

// CLEAR THE SEARCH INPUT WHEN WE CLICK ON CLOSE BUTTON
closeBtn.addEventListener("click", () => {
  searchField.value = "";
  closeBtn.style.visibility = "hidden";
});

// adding the class to human chief
const setUp = () => {
  document.querySelector(".human__chief").classList.add("move-in");
};

setUp();
// added event listner to dom
document.addEventListener("DOMContentLoaded", function () {
  app.updateFavList();
  setTimeout(setUp, 1000);
});
