const global = {
  currentPage: window.location.pathname,
};

////////////////////////////////////////////////////////////
// API ACCESS

///Fetch Data from TMDB API

async function fetchAPIData(endpoint) {
  const API_KEY = "74d8b487dc7f2975760306bdb47b8643";
  const API_URL = "https://api.themoviedb.org/3/";

  showSpinner();
  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );
  console.log(response);
  const data = await response.json();

  hideSpinner();
  return data;
}

function showSpinner() {
  const theSpinner = document.querySelector(".spinner");
  theSpinner.classList.add("show");
}

function hideSpinner() {
  const theSpinner = document.querySelector(".spinner");
  theSpinner.classList.remove("show");
}

function numberWithCommas(x, dec) {
  if (dec === undefined || dec === 0) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return x.toFixed(dec).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }
}

function makeElement(type, text) {
  const ele = document.createElement(type);
  ele.innerText = text;
  return ele;
}

function makeImagePath(path) {
  return path
    ? "https://image.tmdb.org/t/p/w500/" + path
    : "../images/no-image.jpg";
}

function makeImage(path, alt) {
  const img = document.createElement("img");

  img.src = makeImagePath(path);

  img.alt = alt;

  return img;
}

function makeBackgroundImage(backgroundPath) {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = "cover";
  overlayDiv.style.backgroundPosition = "center";
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.height = "100vh";
  overlayDiv.style.width = "100vw";
  overlayDiv.style.position = "absolute";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.zIndex = "-1";
  overlayDiv.style.opacity = "0.1";
  return overlayDiv;
}
function displayBackgroundImage(type, backgroundPath) {
  let overlayDiv = makeBackgroundImage(backgroundPath);
  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv);
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv);
  }
}
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const options = {
    //weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString(undefined, options);
}

///////////////////////////////////////////////////////
// Movies

async function displayPopularMovies() {
  const { results } = await fetchAPIData("movie/popular");

  results.forEach((movie) => displayMovieCard(movie));
}

function displayMovieCard(movie) {
  const cardDiv = document.createElement("div");
  const detailRef = document.createElement("a");

  detailRef.href = "movie-details.html?id=" + movie.id;

  cardDiv.classList.add("card");

  let img = document.createElement("img");
  img.src = movie.poster_path
    ? "https://image.tmdb.org/t/p/w500/" + movie.poster_path
    : "..images\no-image.jpg";
  img.alt = movie.title;

  detailRef.appendChild(img);

  let bodyDiv = document.createElement("div");
  bodyDiv.classList.add("card-body");

  let title = document.createElement("h5");
  title.textContent = movie.title;

  bodyDiv.appendChild(title);

  const cardText = document.createElement("p");
  const release = document.createElement("small");
  release.classList.add("text-muted");
  release.textContent = `Released ${formatDate(movie.release_date)}`;
  cardText.appendChild(release);
  bodyDiv.appendChild(cardText);

  detailRef.appendChild(bodyDiv);

  cardDiv.appendChild(detailRef);

  const moviesDiv = document.getElementById("popular-movies");
  moviesDiv.appendChild(cardDiv);
}

async function displayMovieDetails() {
  const id = window.location.search.split("=")[1];

  let theMovie = await fetchAPIData(`movie/${id}`);

  console.log("movie", theMovie);
  const top = document.createElement("div");

  displayBackgroundImage("movie", theMovie.backdrop_path);
  top.classList.add("details-top");

  const imgDiv = document.createElement("div");

  const img = makeImage(theMovie.poster_path, theMovie.title);

  img.classList.add("card-img-top");
  imgDiv.appendChild(img);
  top.appendChild(img);

  const infoDiv = document.createElement("div");
  infoDiv.innerHTML = `   <h2>${theMovie.title}</h2>
  <h3>${theMovie.tagline}</h3>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${theMovie.vote_average.toFixed(1)} /10
            </p>
            <p class="text-muted">Release Date: ${formatDate(
              theMovie.release_date
            )}</p>
            <p>
              ${theMovie.overview}
            </p>
            <h5>Genres</h5>`;

  const genreList = document.createElement("ul");
  genreList.classList.add("list-group");
  genreList.innerHTML = theMovie.genres
    .map((genre) => `<li>${genre.name}</li>`)
    .join(" ");

  const link = document.createElement("a");
  link.href = theMovie.homepage;
  link.target = "_blank";
  link.classList.add("btn");
  link.textContent = "Visit Movie Homepage";

  infoDiv.appendChild(genreList);
  infoDiv.appendChild(link);
  infoDiv.appendChild(link);
  top.appendChild(infoDiv);

  const imdb = document.createElement("a");

  imdb.href = "https://www.imdb.com/title/" + theMovie.imdb_id;
  imdb.target = "_blank";
  imdb.classList.add("btn");
  imdb.textContent = "IMDB";
  top.appendChild(imdb);

  const bottom = document.createElement("div");
  bottom.classList.add("details-bottom");
  let h = document.createElement("h2");
  h.innerText = "Movie Info";
  bottom.appendChild(h);

  const infoList = document.createElement("ul");
  infoList.innerHTML = `
      <li><span class="text-secondary">Budget:</span> $${numberWithCommas(
        theMovie.budget,
        0
      )}</li>
            <li><span class="text-secondary">Revenue: </span>$${numberWithCommas(
              theMovie.revenue,
              0
            )}</li>
            <li><span class="text-secondary">Runtime: </span>${
              theMovie.runtime
            } minutes</li>
            <li><span class="text-secondary">Status: </span> ${
              theMovie.status
            }</li>
    `;
  bottom.appendChild(infoList);

  bottom.appendChild(makeElement("h4", "Production Companies"));

  const prodCompanyList = document.createElement("div");
  prodCompanyList.classList.add("list-group");
  prodCompanyList.innerHTML = theMovie.production_companies
    .map((company) => `<span>${company.name}</span>`)
    .join(", ");

  bottom.appendChild(prodCompanyList);

  const detailDiv = document.getElementById("movie-details");
  detailDiv.appendChild(top);
  detailDiv.appendChild(bottom);

  if (theMovie.belongs_to_collection) {
    const extraContent = document.createElement("div");
    extraContent.id = "extra";

    const group = document.createElement("div");
    group.classList.add("details-top");

    //let bk = makeBackgroundImage(theMovie.belongs_to_collection.backdrop_path);
    //bk.style.position = "relative";
    //extraContent.appendChild(bk);

    //Image
    const imgDiv = document.createElement("div");
    const img = makeImage(
      theMovie.belongs_to_collection.poster_path,
      theMovie.belongs_to_collection.poster_path.name
    );

    img.classList.add("card-img-top");
    imgDiv.appendChild(img);
    group.appendChild(imgDiv);

    const collection = await fetchAPIData(
      `collection/${theMovie.belongs_to_collection.id}`
    );

    let parts = collection.parts.sort(
      (a, b) => Date.parse(a.release_date) - Date.parse(b.release_date)
    );

    const cDiv = document.createElement("div");
    cDiv.appendChild(makeElement("h2", theMovie.belongs_to_collection.name));

    const collectionList = document.createElement("ul");
    parts.forEach((x) => {
      const el = document.createElement("li");
      const link = document.createElement("a");
      link.href = `./movie-details.html?id=${x.id}`;
      link.innerText = x.title;

      el.appendChild(link);
      collectionList.appendChild(el);
    });
    cDiv.appendChild(collectionList);
    group.appendChild(cDiv);

    extraContent.appendChild(group);
    detailDiv.appendChild(extraContent);
  }
}

/////////////////////////////////////////////////////////
// tv-shows

async function displayPopularTVShows() {
  const { results } = await fetchAPIData("tv/popular");

  results.forEach((tv) => displayTVCard(tv));
}

function displayTVCard(show) {
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");

  cardDiv.innerHTML = `
          <a href="tv-details.html?id=${show.id}">
            <img
              src="${makeImagePath(show.poster_path)}
              class="card-img-top"
              alt="${show.name}"
            />
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Aired: ${formatDate(
                show.first_air_date
              )}</small>
            </p>
          </div>
        </div>
        `;
  const showsDiv = document.getElementById("popular-shows");
  showsDiv.appendChild(cardDiv);
}

async function displayTvDetails() {
  const id = window.location.search.split("=")[1];

  let show = await fetchAPIData(`tv/${id}`);

  console.log("tv", show);
  displayBackgroundImage("show", show.backdrop_path);

  const div = document.createElement("div");
  div.innerHTML = `
  <div class="details-top">
  <div>
    <img
      src="${makeImagePath(show.poster_path)}}"
      class="card-img-top"
      alt="Show Name"
    />
  </div>
  <div>
    <h2>${show.name}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${show.vote_average.toFixed(1)}/ 10
    </p>
    <p class="text-muted">Release Date: ${formatDate(show.first_air_date)}</p>
    <p>
      ${show.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
    ${show.genres.map((genere) => `<li>${genere.name}</li>`).join("")}
    </ul>
    <a href="${
      show.homepage
    }" target="_blank" class="btn">Visit Show Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Show Info</h2>
  <ul>
    <li><span class="text-secondary">Number Of Seasons:</span> ${
      show.number_of_seasons
    }</li>
    <li><span class="text-secondary">Number Of Episodes:</span> ${
      show.number_of_episodes
    }</li>
    <li>
      <span class="text-secondary">Last
      Aired Show Episode </span> 
      ${formatDate(show.last_air_date)} ${show.last_episode_to_air.name}
    </li>
    <li><span class="text-secondary">Status: </span>${show.status}</li>
     <li><span class="text-secondary">Country of origin: </span>${
       show.origin_country
     }</li>
          <li><span class="text-secondary">Language: </span>${show.languages.join(
            ", "
          )}</li>
    <li>${show.networks
      .map(
        (network) =>
          `<img "src="https://image.tmdb.org/t/p/w92/${network.logo_path}"</img>`
      )
      .join("")}
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">
  ${show.production_companies
    .map((company) => `<span>${company.name}</span>`)
    .join(", ")}
  </div>
</div>
`;

  document.getElementById("show-details").appendChild(div);
}

////
// highlight active link
function highlightActiveLink() {
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage)
      link.classList.add("active");
  });
}
///////////////////////////////////////////////
async function displayMovieSlider() {
  const { results } = await fetchAPIData("movie/now_playing");

  results.forEach((movie) => {
    console.log(movie);
    const div = document.createElement("div");
    div.classList.add("swiper-slide");

    div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
          <img src="${makeImagePath(movie.poster_path, movie.title)}" />
        </a>
        <h4 class="swiper-rating">
          <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(
            1
          )} / 10
        </h4>
      `;

    document.querySelector(".swiper-wrapper").appendChild(div);
  });
  initSwiper();
}

function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

//////
//Init App
function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displayPopularMovies();
      displayMovieSlider();
      break;
    case "/movie-details.html":
      displayMovieDetails();
      break;
    case "/shows.html":
      displayPopularTVShows();

      break;
    case "/search.html":
      break;
    case "/tv-details.html":
      displayTvDetails();
    default:
      console.log("Error unknow page", global.currentPage);
  }

  highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
