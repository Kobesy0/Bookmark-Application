const bookmarksContainer = document.querySelector(".bookmarks");
const addBtn = document.querySelector(".add-category");
const categorySuggestions = document.querySelector('.category-suggestions div');
const categoryButtons = document.querySelector(".category-buttons div");
const showBookmarksBtn = document.querySelector(".all-books");

document.addEventListener("DOMContentLoaded", ()=> {
  
  const moon = document.querySelector(".moon");
  const sun = document.querySelector(".sun");
  const body = document.body;
  

  const lightState = localStorage.getItem("lightState");
  if(lightState){
    body.classList.add(lightState);
  }
  
  sun.addEventListener("click", () => {
    sun.classList.add("light-on");
    sun.style.display = "none";
    body.classList.remove("light-off");
    moon.style.display = "block";
    localStorage.setItem("lightState", "light-on" )
  });
  moon.addEventListener("click", () => {
    moon.classList.remove("light-on");
    moon.style.display = "none";
    body.classList.add("light-off");
    sun.style.display = "block";
    localStorage.setItem("lightState", "light-off" )
  });
})

// Social media 
document.querySelector(".instagram").addEventListener("click", () => {
  link = `https://www.instagram.com/mustafakobesy/`
  window.open(link, '_blank');
});
document.querySelector(".github").addEventListener("click", ()=>{
  link = `https://github.com/Kobesy0`
  window.open(link, '_blank');
})

document.querySelector(".whatsapp").addEventListener("click",()=>{
  link = `https://wa.me/01152274612`
  window.open(link, '_blank');
})
// End Social media



// X to remove the field when the user click on it 
const category = document.querySelector(".category")
const url = document.querySelector(".url")
const title = document.querySelector(".title")

title.addEventListener("input", ()=>{
  if (title.value.trim().length > 0) {
    document.querySelector(".label-title").style.display = "block";
  }
  else {
    document.querySelector(".label-title").style.display = "none";
  }
document.querySelector(".label-title").addEventListener("click",()=>{
  document.querySelector(".title").value = ""
  document.querySelector(".label-title").style.display = "none";
})
})
url.addEventListener("input", ()=>{
  if (url.value.trim().length > 0) {
    document.querySelector(".label-url").style.display = "block";
  }
  else {
    document.querySelector(".label-url").style.display = "none";
  }
  document.querySelector(".label-url").addEventListener("click", ()=>{
    document.querySelector(".url").value = ""
    document.querySelector(".label-url").style.display = "none";
  })
})

category.addEventListener("input", ()=>{
  if (category.value.trim().length > 0) {
    document.querySelector(".label-category").style.display = "block";
  }
  else {
    document.querySelector(".label-category").style.display = "none";
  }
document.querySelector(".label-category").addEventListener("click",()=>{
  document.querySelector(".category").value = ""
  document.querySelector(".label-category").style.display = "none";
})
})


// End X 



let currentCategory = null;
let currentIndex = null;

// This for remove the the active class from localStorage 
localStorage.removeItem("active-category");




// Start the main function to save bookmark 
function saveBookmark() {
  const title = document.querySelector(".title").value.trim();
  const url = document.querySelector(".url").value.trim();
  const newCategory = document.querySelector(".category").value.trim();

  let isValid = true;
  if(!title){
    document.querySelector(".titleError").innerHTML = "Please fill out this field"
    document.querySelector(".title").style.borderColor = "red" 
    isValid = false
  }
  else{
    document.querySelector(".titleError").innerHTML = ""
    document.querySelector(".title").style.borderColor = ""
  }
  if(!url){
    document.querySelector(".urlError").innerHTML = "Please fill out this field"
    document.querySelector(".url").style.borderColor = "red" 
    isValid = false
  }
  else{
    document.querySelector(".urlError").innerHTML = ""
    document.querySelector(".url").style.borderColor = ""
  }
  if(!newCategory){
    document.querySelector(".categoryError").innerHTML = "Please fill out this field"
    document.querySelector(".category").style.borderColor = "red" 
    isValid = false
  }
  else{
    document.querySelector(".categoryError").innerHTML = ""
    document.querySelector(".category").style.borderColor = ""
  }
  if(!isValid){
    return;
  }

  const allBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};

  if (currentCategory !== null && currentIndex !== null) {
    // تحديث العلامة المرجعية الموجودة
    const oldCategory = currentCategory;
    const bookmark = allBookmarks[oldCategory][currentIndex];
    bookmark.title = title;
    bookmark.url = url;

    if (oldCategory !== newCategory) {
      // نقل العلامة المرجعية إلى الفئة الجديدة
      allBookmarks[newCategory] = allBookmarks[newCategory] || [];
      allBookmarks[newCategory].push(bookmark);
      allBookmarks[oldCategory].splice(currentIndex, 1);
      if (allBookmarks[oldCategory].length === 0) {
        delete allBookmarks[oldCategory];
      }
    } else {
      allBookmarks[oldCategory][currentIndex] = bookmark;
    }

    currentCategory = null;
    currentIndex = null;
    addBtn.textContent = "Add Bookmark";
  } else {
    // إضافة علامة مرجعية جديدة
    if (!allBookmarks[newCategory]) {
      allBookmarks[newCategory] = [];
    }
    allBookmarks[newCategory].push({ title, url });
  }

  localStorage.setItem("bookmarks", JSON.stringify(allBookmarks));
  clearForm();
  displayBookmarkCard();
  displayCategoriesSuggestions();
  displayCategoryButtons();
  localStorage.removeItem("active-category");
  const categoryButtons = document.querySelectorAll(".category-buttons div span");
  categoryButtons.forEach((button) => button.classList.remove("active"));
  document.querySelectorAll("label").forEach((label)=> label.style.display = "none");
}

showBookmarksBtn.addEventListener("click", () => {
  displayBookmarkCard();
  const categoryButtons = document.querySelectorAll(".category-buttons div span");
  categoryButtons.forEach((button) => button.classList.remove("active"));
});

// إضافة مستمع لزر الإضافة
addBtn.addEventListener("click", saveBookmark);

// وظيفة لعرض جميع العلامات المرجعية
function displayBookmarkCard() {
  bookmarksContainer.innerHTML = "";
  const allBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
  Object.keys(allBookmarks).forEach((category) => {
    const categoryBookmark = allBookmarks[category];
    categoryBookmark.forEach((book, index) => {
      const bookElement = document.createElement("div");
      bookElement.classList.add("bookmark-card");
      bookElement.title = ` ${book.title} 
      ${book.url} `
      bookElement.innerHTML = `
      
        <h3>${category}</h3>
        <div class="link"><a href="${book.url}" target="_blank">${book.title}</a></div>
        <div class="buttons">
          <button class="edit" onclick="editBookmark('${category}', ${index})"><i class="fa-solid fa-pen-to-square"></i></li>
          <button class="delete" onclick="deleteBookmark('${category}', ${index})"><i class="fa-solid fa-trash-can"></i></li>
        </div>`;
      bookmarksContainer.appendChild(bookElement);
    });
  });
}

// function to filter the categories 
function filterDisplayBookmarkCard(category) {
  const allBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
  const categoryBookmarks = allBookmarks[category];
  bookmarksContainer.innerHTML = "";

  categoryBookmarks.forEach((bookmark, index) => {
    const bookmarkElement = document.createElement("div");
    bookmarkElement.classList.add("bookmark-card");
    bookmarkElement.innerHTML = `
      <span class="number">${index + 1}</span>
      <div class="link"><a href="${bookmark.url}" target="_blank">${bookmark.title}</a></div>
      <div class="buttons">
      <button class="edit" onclick="editBookmark('${category}', ${index})"><i class="fa-solid fa-pen"></i></button>
      <button class="delete" onclick="deleteBookmark('${category}', ${index})"><i class="fa-solid fa-trash"></i></button>
      </div>
      `;
    bookmarksContainer.appendChild(bookmarkElement);
  });
}

// to Edit the bookmark card
function editBookmark(category, index) {
  const allBookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  const bookmark = allBookmarks[category][index];
  document.querySelector(".title").value = bookmark.title;
  document.querySelector(".url").value = bookmark.url;
  document.querySelector(".category").value = category;
  currentCategory = category;
  currentIndex = index;
  addBtn.textContent = "Update Bookmark";
}

// to Delete to the bookmark card 
function deleteBookmark(category, index) {
  const allBookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  allBookmarks[category].splice(index, 1);
  if (allBookmarks[category].length === 0) delete allBookmarks[category];
  localStorage.setItem("bookmarks", JSON.stringify(allBookmarks));
  if (allBookmarks[category] && localStorage.getItem('active-category')) {
    filterDisplayBookmarkCard(category);
  } else {
    displayBookmarkCard();
  }
  displayCategoriesSuggestions();
  displayCategoryButtons();
}


// this to show the category in the div categorySuggestions and if you click on one of the categories , will show in the category field 
function displayCategoriesSuggestions() {
  categorySuggestions.innerHTML = '';
  const allBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || {};
  const categories = Object.keys(allBookmarks);

  categories.forEach((category) => {
    const categoryElement = document.createElement("span");
    categoryElement.innerHTML = category;
    categoryElement.addEventListener("click", () => {
      document.querySelector(".category").value = category;
    });
    categorySuggestions.appendChild(categoryElement);
  });
}

// to show the category bookmarksContainer in the div categoryButtons
function displayCategoryButtons() {
  const allBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
  categoryButtons.innerHTML = "";
  const categories = Object.keys(allBookmarks);

  categories.forEach((category) => {
    const categoryElement = document.createElement("span");
    categoryElement.innerHTML = category;

    categoryElement.addEventListener("click", function() {
      localStorage.setItem("active-category", category);
      filterDisplayBookmarkCard(category);
      const catSpan = document.querySelectorAll(".category-buttons div span");
      catSpan.forEach((category) => {
        category.classList.remove("active");
        this.classList.add("active");
      });
    });

    categoryButtons.appendChild(categoryElement);
    const activeButtons = localStorage.getItem("active-category");
    if (category === activeButtons) {
      categoryElement.classList.add("active");
    }
  });
}

// Clear the inputs 
function clearForm() {
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => (input.value = ""));
}

displayBookmarkCard();
displayCategoriesSuggestions();
displayCategoryButtons();