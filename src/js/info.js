// IMPORT ALL THE FUNCTION AS APP AND JUST CALL
import * as app from "./main.js";

let url = window.location.href;
// EXTRACTING THE ID FROM THE WEB URL
let id = url.split("=")[1];

//INVOKING THE GET MEAL BY ID HANDLER
let meals = await app.getMealById(id);

// INVOKE LOAD MEAL HANDLER
app.loadMealDetails(meals);
// MEAL INSTRUCTION HANDLER
app.loadMealInstruction(meals);

// FAVLIST SIDE BAR
const favouriteButton = document.querySelector("button.favBtn");
app.sideBarFavriteSlider(favouriteButton);

const favouriteListContainer = document.querySelector("div.favlist__container");
const listContainer = favouriteListContainer.children[3];
const closeSliderFav = favouriteListContainer.children[0];

// REMOVE THE FAVITEM FROM SLIDER
app.removeFavItemFromList(listContainer);
// CLOSE THE SLIDER FAVLIST
app.closeSliderHandler(closeSliderFav);

// UPDATE MEALS LIST TO DOM
app.updateFavList();
