const API_KEY = "1d3a0eefa97b499d8fbc4ee93eeb40b7";
const url = "https://newsapi.org/v2/everything?q=";

// Load initial news based on the default query (e.g., "India")
window.addEventListener("load", () => fetchNews("India"));

// Function to reload the page
function reload() {
    window.location.reload();
}

// Fetch news articles based on a search query
async function fetchNews(query) {
    try {
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        if (!res.ok) {
            throw new Error(`Error fetching data: ${res.status}`);
        }
        const data = await res.json();
        if (!data.articles || data.articles.length === 0) {
            displayNoResults(); // Function to handle no results
            return;
        }
        bindData(data.articles);
    } catch (error) {
        console.error(error);
        displayError(); // Function to handle errors
    }
}

// Bind fetched news data to HTML template
function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    // Clear the current content
    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        // Skip articles without images
        if (!article.urlToImage) return;

        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

// Fill individual news card with data
function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    // Update the card content with article data
    newsImg.src = article.urlToImage;
    newsTitle.textContent = article.title;
    newsDesc.textContent = article.description;

    // Format the publication date
    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.textContent = `${article.source.name} · ${date}`;

    // Set up the card click event to open the news in a new tab
    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

// Handle navigation item clicks to fetch related news
let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);

    // Handle active navigation item state
    const navItem = document.getElementById(id);
    if (curSelectedNav) curSelectedNav.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

// Set up search functionality
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value.trim();
    if (!query) return;

    fetchNews(query);
    if (curSelectedNav) curSelectedNav.classList.remove("active");
    curSelectedNav = null; // Remove active state from nav if using search
});

// Error Handling Functions

// Display a message when no articles are found
function displayNoResults() {
    const cardsContainer = document.getElementById("cards-container");
    cardsContainer.innerHTML = "<p>No articles found for this query. Please try another search.</p>";
}

// Display an error message if the API call fails
function displayError() {
    const cardsContainer = document.getElementById("cards-container");
    cardsContainer.innerHTML = "<p>An error occurred while fetching the news. Please try again later.</p>";
}
