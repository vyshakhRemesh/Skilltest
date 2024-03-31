document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL = "https://www.themealdb.com/api/json/v1/1/";

  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const favouriteMealsSection = document.getElementById("favouriteMeals");
  const mealDetailsSection = document.getElementById("mealDetails");

  let favouriteMeals = [];

  console.log(favouriteMeals);
  window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id) {
      displayMealDetails(id);
    }
  };

  // Load favorite meals from localStorage
  loadFavouritesFromStorage();

  // Function to load favorite meals from localStorage
  function loadFavouritesFromStorage() {
    const storedFavorites = localStorage.getItem("favouriteMeals");
    if (storedFavorites) {
      favouriteMeals = JSON.parse(storedFavorites);
      displayFavouriteMeals();
    } else {
      favouriteMeals = JSON.parse(storedFavorites);
    }
  }

  //Display Meal details page
  async function displayMealDetails(mealId) {
    console.log("hey", mealId);
    if (mealDetailsSection) {
      mealDetailsSection.innerHTML = "";
      const meal = await fetchMealById(mealId);
      console.log("hey the meal is ", meal);
      const mealImage = document.createElement("img");
      mealImage.src = meal.strMealThumb;
      mealImage.alt = meal.strMeal;

      const mealName = document.createElement("h2");
      mealName.textContent = meal.strMeal;
      mealName.classList.add("mealTitle");

      const mealCategory = document.createElement("p");
      mealCategory.classList.add("mealCategory");
      mealCategory.innerHTML = `<h4>Category:</h4> <h5>${meal.strCategory}</h5>`;

      const mealInstructions = document.createElement("p");
      mealInstructions.classList.add("mealInstructions");
      mealInstructions.innerHTML = `<h4>Instructions:</h4> <h6>${meal.strInstructions}</h6>`;

      const mealDetailsCard = document.createElement("div");
      mealDetailsCard.classList.add("mealDetailsCard");
      mealDetailsCard.appendChild(mealName);
      mealDetailsCard.appendChild(mealCategory);
      mealDetailsCard.appendChild(mealInstructions);
      const mealImageCard = document.createElement("div");
      mealImageCard.classList.add("mealImageCard");
      mealImageCard.appendChild(mealImage);
      // Append elements to the container
      mealDetailsSection.appendChild(mealImageCard);
      mealDetailsSection.appendChild(mealDetailsCard);
    }
  }

  // Display favorite meals
  async function displayFavouriteMeals() {
    if (favouriteMealsSection) {
      favouriteMealsSection.innerHTML = "";
      for (const mealId of favouriteMeals) {
        try {
          const meal = await fetchMealById(mealId);
          const favMealCard = document.createElement("div");
          const favouriteItem = createMealItemElement(meal);
          const removeFromFavouriteBtn = document.createElement("button");
          removeFromFavouriteBtn.classList.add("favbtn");

          const trash = document.createElement("i");
          trash.classList.add("fa-trash", "fa-solid", "fa-2xl");

          favMealCard.addEventListener("mouseover", () => {
            trash.style.transform = "scaleY(1.3)";
            trash.style.transition = "all 1s";
          });
          favMealCard.addEventListener("mouseout", () => {
            trash.style.transform = "scale(1)";
          });

          removeFromFavouriteBtn.addEventListener("click", () => {
            removeFromFavourites(meal.idMeal);
          });
          removeFromFavouriteBtn.appendChild(trash);
          favMealCard.appendChild(favouriteItem);
          favMealCard.appendChild(removeFromFavouriteBtn);
          favouriteMealsSection.appendChild(favMealCard);
        } catch (error) {
          console.error("Error fetching meal details:", error);
        }
      }
    }
  }

  // Add event listener to search input
  searchInput?.addEventListener("input", () => {
    const query = searchInput.value.trim();
    if (query !== "") {
      searchInput.classList.add("showresult");
      searchMeal(query);
    } else {
      // Clear search results if input is empty
      searchResults.innerHTML = "";
      searchInput.classList.remove("showresult");
    }
  });

  // Search meals
  async function searchMeal(query) {
    console.log("entered searchmeal and query is", query);
    const searchUrl = `${API_BASE_URL}search.php?s=${query}`;
    try {
      const response = await fetch(searchUrl);
      const data = await response.json();
      console.log("data is ", data);
      console.log("the meal is ", data.meals);
      displaySearchResults(data.meals);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Display search results
  function displaySearchResults(meals) {
    console.log("entered displaysearchresults");
    searchResults.innerHTML = "";

    meals.forEach((meal) => {
      const mealCard = document.createElement("div");

      const mealItem = createMealItemElement(meal);

      loadFavouritesFromStorage();
      // console.log(
      //   "the favourites in the display search results is",
      //   favouriteMeals.includes(meal.idMeal)
      // );
      const addToFavouriteBtn = document.createElement("button");
      addToFavouriteBtn.classList.add("favbtn");
      const heart = document.createElement("i");

      heart.classList.add("fa-heart", "fa-2xl");

      if (favouriteMeals && favouriteMeals.includes(meal.idMeal)) {
        heart.classList.add("selected");
        heart.classList.add("fa-solid");
      } else {
        heart.classList.add("fa-regular");
      }

      addToFavouriteBtn.addEventListener("click", () => {
        heart.classList.add("fa-solid");
        heart.classList.add("selected");
        addToFavourites(meal.idMeal);
      });
      addToFavouriteBtn.appendChild(heart);
      mealCard.appendChild(mealItem);
      mealCard.appendChild(addToFavouriteBtn);
      searchResults.appendChild(mealCard);
    });
  }

  // Fetch meal by ID
  async function fetchMealById(mealId) {
    const mealUrl = `${API_BASE_URL}lookup.php?i=${mealId}`;
    try {
      const response = await fetch(mealUrl);
      const data = await response.json();
      return data.meals[0];
    } catch (error) {
      console.error("Error fetching meal details:", error);
    }
  }

  // Create meal item element
  function createMealItemElement(meal) {
    const mealItem = document.createElement("div");
    mealItem.classList.add("meal-item");

    const mealImage = document.createElement("img");
    mealImage.src = meal.strMealThumb;
    mealImage.alt = meal.strMeal;
    mealImage.classList.add("mealImage");

    const mealName = document.createElement("p");
    mealName.textContent = meal.strMeal;
    mealName.classList.add("mealName");

    mealItem.appendChild(mealImage);
    mealItem.appendChild(mealName);

    mealItem.addEventListener("click", () => {
      window.location.href = `mealDetails.html?id=${meal.idMeal}`;
    });

    return mealItem;
  }

  // Add meal to favorites
  function addToFavourites(mealId) {
    if (!favouriteMeals.includes(mealId)) {
      favouriteMeals.push(mealId);
      saveFavouritesToStorage();
      // loadFavouritesFromStorage();
    }
  }

  // Save favorite meals to localStorage
  function saveFavouritesToStorage() {
    localStorage.setItem("favouriteMeals", JSON.stringify(favouriteMeals));
  }

  // Remove meal from favorites
  function removeFromFavourites(mealId) {
    favouriteMeals = favouriteMeals.filter((fav) => fav !== mealId);
    saveFavouritesToStorage();
    loadFavouritesFromStorage();
  }
});
