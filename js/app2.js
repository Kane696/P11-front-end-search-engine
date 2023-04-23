let filteredRecipes = recipes;
let tags = {
    ingredient: new Set(),
    ustensil: new Set(),
    appliance: new Set()
}
const tagsList = {
    ingredientList: new Set(),
    ustensilList: new Set(),
    applianceList : new Set()
}

const ustensilSearchBar = document.getElementById("ustensil-search__input");
const applianceSearchBar = document.getElementById("appliance-search__input");
const ingredientSearchBar = document.getElementById("ingredient-search__input");

function displayRecipes(recipesArr) {
    const recipesSection = document.getElementById("recipes-section");
    // Clear recipes section
    recipesSection.innerHTML = "";
    const errorMessage = document.createElement("p");
    errorMessage.textContent = "Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.";
    // Check if recipe wheither empty or not
    if(recipesArr.length === 0) {
        recipesSection.appendChild(errorMessage);
    } else {
        recipesArr.forEach(recipe => {
            const recipeCard = document.createElement("div");
            const recipeImg = document.createElement("img");
            const recipeDetails = document.createElement("div");
            const recipeName = document.createElement("h2");
            const recipeTime = document.createElement("div");
            const timeIcon = document.createElement("i");
            const recipeTimeText = document.createElement("p");
            const recipeDescriptionContainer = document.createElement("div");
            const recipeTextUpContainer = document.createElement("div");
            const recipeTextDownContainer = document.createElement("div");
            const recipeDescription = document.createElement("p");
            
            recipeCard.classList.add("card", "p-0", "m-0","recipe-card", "border", "border-0");
            recipeImg.setAttribute("src", "./assets/img/recipe_img.png");
            recipeImg.classList.add("card-img-top");
            recipeDetails.classList.add("card-body", "rounded-bottom");
            recipeTextUpContainer.classList.add("d-flex", "w-100", "justify-content-between");
            recipeTextDownContainer.classList.add("d-flex", "w-100", "justify-content-between");
            recipeDescriptionContainer.classList.add("w-50");
            recipeTime.classList.add("d-flex");
            timeIcon.classList.add("bi", "bi-clock", "me-1");
            recipeDescription.classList.add("recipe-card__description");
            recipeName.textContent = recipe.name;
            recipeTimeText.textContent = recipe.time + "min";
            recipeDescription.textContent = recipe.description;

            recipeTime.appendChild(timeIcon);
            recipeTime.appendChild(recipeTimeText);
            recipeTextUpContainer.appendChild(recipeName);
            recipeTextUpContainer.appendChild(recipeTime);
            recipeTextDownContainer.appendChild(displayIngredientList(recipe.ingredients));
            recipeDescriptionContainer.appendChild(recipeDescription);
            recipeTextDownContainer.appendChild(recipeDescriptionContainer);
            recipeDetails.appendChild(recipeTextUpContainer);
            recipeDetails.appendChild(recipeTextDownContainer);
            recipeCard.appendChild(recipeImg);
            recipeCard.appendChild(recipeDetails);
            recipesSection.appendChild(recipeCard);
        });
    }
}

function displayIngredientList(ingredients) {
    const recipeIngredientsList = document.createElement("ul");
    recipeIngredientsList.classList.add("ingredients-list", "w-50");
    ingredients.forEach(ingredient => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
                ${ingredient.ingredient} : ${(ingredient.quantity !== undefined) ? ingredient.quantity : ''}
            ${(ingredient.unit !== undefined)? ingredient.unit : ''}
        `;
        recipeIngredientsList.appendChild(listItem);
    });
    return recipeIngredientsList;
}

function searchRecipes() {
    const searchBarInput = document.getElementById("search-bar__input");
    searchBarInput.addEventListener("keyup", (e) => {
        const query = e.target.value;
        filteredRecipes = [];
        if(query.length >= 3) {
            for(let i = 0; i < recipes.length; i++){
                if(recipes[i].name.toLowerCase().includes(query.toLowerCase())|| recipes[i].description.toLowerCase().includes(query.toLowerCase()) || recipes[i].ingredients.find((ingredient) => ingredient.ingredient.toLowerCase().includes(query.toLowerCase()))) {
                    filteredRecipes.push(recipes[i]);
                }
            }
        } else if(query.length < 3) {
            for(let i = 0; i < recipes.length; i++){
                if(recipes[i].name.toLowerCase().includes(query.toLowerCase())|| recipes[i].description.toLowerCase().includes(query.toLowerCase()) || recipes[i].ingredients.find((ingredient) => ingredient.ingredient.toLowerCase().includes(query.toLowerCase()))) {
                    filteredRecipes.push(recipes[i]);
                }
            }
        } else {
            filteredRecipes = recipes;
        }
        displayRecipes(filteredRecipes);
        getTagsList(filteredRecipes);
    });
}

function openDrodown(recipesArr) {
    const dropdownBtns = document.querySelectorAll(".dropdown-btn");
    const ingredientSelect = document.getElementById("ingredient-select");
    const ustensilSelect = document.getElementById("ustensile-select");
    const appareilSelect = document.getElementById("appareil-select");

    dropdownBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if(e.currentTarget.textContent === "Ingredients") {
                ingredientSelect.classList.toggle('show');
                appareilSelect.classList.remove('show');
                ustensilSelect.classList.remove('show');
                searchByTags(ingredientSearchBar, tagsList.ingredientList, recipesArr);
            } else if(e.currentTarget.textContent === "Appareils") {
                appareilSelect.classList.toggle('show');
                ingredientSelect.classList.remove('show');
                ustensilSelect.classList.remove('show');
                searchByTags(applianceSearchBar, tagsList.applianceList, recipesArr);
            } else if(e.currentTarget.textContent === "Ustensiles") {
                ustensilSelect.classList.toggle('show');
                ingredientSelect.classList.remove('show');
                appareilSelect.classList.remove('show');
                searchByTags(ustensilSearchBar, tagsList.ustensilList, recipesArr);
            }
        })
    });
    getTagsList(recipesArr);
}

function clearTagsList(list) {
    list.innerHTML = "";
}

function getTagsList(recipesArr) {
    tagsList.ingredientList.clear();
    tagsList.applianceList.clear();
    tagsList.ustensilList.clear();
    recipesArr.map(recipe => {
        recipe.ingredients.map(item => tagsList.ingredientList.add(item.ingredient.toLowerCase()));
        recipe.ustensils.map(ustensil => tagsList.ustensilList.add(ustensil.toLowerCase()));
        tagsList.applianceList.add(recipe.appliance.toLowerCase());
    });
    displayTagsList(recipesArr);
}

function displayTagsList(recipesArr) {
    const ingredientSelectList = document.getElementById("ingredient-select__list");
    const ustensilSelectList = document.getElementById("ustensil-select__list");
    const applianceSelectList = document.getElementById("appliance-select__list");

    clearTagsList(ingredientSelectList);
    clearTagsList(ustensilSelectList);
    clearTagsList(applianceSelectList);

    tagsList.ingredientList.forEach(ingredient => {
        const listItemLink = document.createElement("a");
        listItemLink.textContent = ingredient;
        listItemLink.addEventListener("click", (e) => {
            addTag(e.currentTarget, "blue", recipesArr);
            removeTag(e.currentTarget, recipesArr);
            const closeBtn = document.createElement("i");
            closeBtn.classList.add("bi", "bi-x-circle");
            listItemLink.appendChild(closeBtn);
        });
        ingredientSelectList.appendChild(listItemLink);
    })
    
    tagsList.ustensilList.forEach(ustensil => {
        const listItemLink = document.createElement("a");
        listItemLink.textContent = ustensil;
        listItemLink.addEventListener("click", (e) => {
            addTag(e.currentTarget, "red", recipesArr);
            removeTag(e.currentTarget, recipesArr);
            const closeBtn = document.createElement("i");
            closeBtn.classList.add("bi", "bi-x-circle");
            listItemLink.appendChild(closeBtn);
        });
        ustensilSelectList.appendChild(listItemLink);
    });
    
    tagsList.applianceList.forEach(appliance => {
        const listItemLink = document.createElement("a");
        listItemLink.textContent = appliance;
        listItemLink.addEventListener("click", (e) => {
            addTag(e.currentTarget, "green", recipesArr);
            removeTag(e.currentTarget, recipesArr);
            const closeBtn = document.createElement("i");
            closeBtn.classList.add("bi", "bi-x-circle");
            listItemLink.appendChild(closeBtn);
        });
        applianceSelectList.appendChild(listItemLink);
    });
}

function filterRecipesByTag(recipesArr) {
    filteredRecipes = recipesArr.filter((recipe) => {
        if((tags.ingredient.size == 0|| recipe.ingredients.find((ingredient) => [...tags.ingredient].includes(ingredient.ingredient.toLowerCase()))) && (tags.ustensil.size == 0|| recipe.ustensils.find((ustensil) => [...tags.ustensil].includes(ustensil.toLowerCase()))) && (tags.appliance.size == 0|| [...tags.appliance].includes(recipe.appliance.toLowerCase()))) {
            return recipe;
        }
    });
    getTagsList(filteredRecipes);
    displayRecipes(filteredRecipes);
}

// Remove tag to dom
function removeTag(currentItem, recipesArr) {
    const tagsSection = document.getElementById("tags-section");
    currentItem.addEventListener("click", () => {
        tags[currentItem.id].delete(currentItem.textContent);
        tagsSection.removeChild(currentItem);
        filterRecipesByTag(recipesArr);
    });
}

// Add tag to dom
function addTag(currentItem, bgColor, recipesArr) {
    const tagsSection = document.getElementById("tags-section");
    currentItem.style.backgroundColor = bgColor;
    tagsSection.appendChild(currentItem); 
    // Add current tag to array of tags
    if(currentItem.style.backgroundColor === "blue") {
        currentItem.setAttribute("id", "ingredient");
        tags.ingredient.add(currentItem.textContent);
    } else if(currentItem.style.backgroundColor === "red") {
        currentItem.setAttribute("id", "ustensil");
        tags.ustensil.add(currentItem.textContent);
    } else { 
        currentItem.setAttribute("id", "appliance");
        tags.appliance.add(currentItem.textContent);
    }
    filterRecipesByTag(recipesArr);
}

function searchByTags(tagSearchar, tagListItem, recipesArr) {
    tagSearchar.addEventListener("keyup", (e) => {
        const query = e.target.value;
        if(query.length >= 1) {
            tagListItem.forEach(item => {
                if(!item.toLowerCase().includes(query.toLowerCase())) {
                    tagListItem.delete(item);
                }
            });
        } else {
            getTagsList(recipesArr);
        }
        displayTagsList(recipesArr);
    });
}

searchRecipes();
openDrodown(filteredRecipes);
displayRecipes(filteredRecipes);


