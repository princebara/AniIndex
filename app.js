let recentAnime = [];

let currentResults = [];

const savedRecents = localStorage.getItem("recentAnime");

if (savedRecents) {
    recentAnime = JSON.parse(savedRecents);
}

/*dark mode*/

const darkModeBtn = document.getElementById("viewmode");
const header = document.getElementById("header");
const body = document.body;

darkModeBtn.addEventListener("click", () => {

    if (darkModeBtn.src.endsWith("night-mode.png")) {
        darkModeBtn.src = "media/icon/brightness.png";
        header.style.backgroundColor = "var(--secondary-background)";
        body.style.backgroundColor = "var(--secondary-background)";

    }else{
        darkModeBtn.src = "media/icon/night-mode.png";
        header.style.backgroundColor = "var(--main-background)";
        body.style.backgroundColor = "var(--main-background)";
    }

    if (darkModeBtn.src.endsWith("night-mode.png")) {
        sidebar.style.backgroundColor = "var(--main-background)";
    }else{
        sidebar.style.backgroundColor = "var(--secondary-background)";
    }
});

/*homebutton*/

function goHome() {
    document.getElementById("homePage").style.display = "flex";
    document.getElementById("resultPage").style.display = "none";
    document.getElementById("infoPage").style.display = "none";
}

document.querySelector(".homebtn").addEventListener("click", (e) => {
    e.preventDefault();
    goHome();
});

/*recent*/

const sidebar = document.getElementById("recent");
const btn = document.getElementById("recentBtn");

btn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});

/*api*/

const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const result = document.getElementById("result");

form.addEventListener("submit", async (event) =>{
    event.preventDefault();
    const query = input.value;
    const url = `https://api.jikan.moe/v4/anime?q=${query}`;

    const response = await fetch(url);
    const data = await response.json();

    currentResults = data.data;

    showPage("resultPage");

    const container = document.getElementById("resultContainer");
    container.innerHTML = "";

    data.data.forEach(anime => {
        const card = document.createElement("div");
        card.classList.add("anime-card");

        card.innerHTML = `
            <img class="resultimg" src="${anime.images.jpg.image_url}">
            <h3 class="resultname">${anime.title}</h3>
        `;

        card.addEventListener("click", () => {
            openAnime(anime);
        });

        

        container.appendChild(card);
    });

    document.getElementById("homebackBtn").addEventListener("click", () => {
        goHome();
})
});
/*info page*/
async function openAnime(anime) {

    recentAnime = recentAnime.filter(item => item.mal_id !== anime.mal_id);
    recentAnime.unshift(anime);
    recentAnime = recentAnime.slice(0, 10);
    localStorage.setItem(
    "recentAnime",
    JSON.stringify(recentAnime)
);
    renderRecents();

    showPage("infoPage");

    const res = await fetch(`https://api.jikan.moe/v4/anime/${anime.mal_id}`);
    const data = await res.json();

    const a = data.data;

    const container = document.getElementById("infoContainer");

    container.innerHTML = `
        <div class="info-layout">

            <div class="info-left">
                <img class="infoimg" src="${a.images.jpg.image_url}">
            </div>

            <div class="info-right">
                <h1 class="infotitle">${a.title}</h1>

                <p><b>Score:</b> ${a.score}</p>
                <p><b>Status:</b> ${a.status}</p>
                <p><b>Episodes:</b> ${a.episodes}</p>
                <p><b>Duration:</b> ${a.duration}</p>
                <p><b>Year:</b> ${a.year}</p>
                <p><b>Source:</b> ${a.source}</p>

                <p><b>Genres:</b> ${a.genres.map(g => g.name).join(", ")}</p>

                <p class="infosyn">${a.synopsis}</p>
            </div>

        </div>
    `;

    document.getElementById("resultbackBtn").addEventListener("click", () => {
        showPage("resultPage");
    });
}

function showPage(pageId) {
    document.getElementById("homePage").style.display = "none";
    document.getElementById("resultPage").style.display = "none";
    document.getElementById("infoPage").style.display = "none";

    document.getElementById(pageId).style.display = "block";
};

/*recent bar fumction*/
function renderRecents() {
    const sidebar = document.querySelector(".recentcontent");

    sidebar.innerHTML = "";

    recentAnime.forEach(anime => {
        const item = document.createElement("p");
        item.textContent = anime.title;

        item.classList.add("recenttext");

        item.addEventListener("click", () => {
            openAnime(anime);
        });
        
        sidebar.appendChild(item);

    });
}

renderRecents();




