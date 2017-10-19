const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
let searchQuery = "";
let nextPageToken = "";
let prevPageToken = "";
let currentToken = "";
let pageCount = 1;

function handleSubmit() {
  $(".search-form").submit(function(event) {
    const queryTarget = $(this).find("#query");
    searchQuery = queryTarget.val();
    
    event.preventDefault();
    search(searchQuery);
    queryTarget.val("");
  });
}

function search(query) {
  $(".result").remove();
  pageCount !== 1 ? $(".back").removeClass("hidden") : $(".back").addClass("hidden");
  getDataFromAPI(query, displayYouTubeSearchData);
}

function getDataFromAPI(searchTerm, callback) {
  const query = {
    part: "snippet",
    key: "AIzaSyBGYCDPu5Zl_iC1sQnh3LmM63q3h4Dbo9o",
    q: searchTerm,
    type: "video",
    maxResults: 5,
    pageToken: currentToken
  };
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback).fail(showErr);
}

function displayYouTubeSearchData(data) {
  const results = data.items.map((item, index) => renderResult(item));
  $(".results-number").html(`Total results: ${data.pageInfo.totalResults}`);
  $(".results").append(results);
  nextPageToken = data.nextPageToken;
  prevPageToken = data.prevPageToken;
}


// // link externally to video
// function renderResult(result) {
//   // console.log(result);
//   return `<a href="https://www.youtube.com/watch?v=${result.id.videoId}" target="_empty"><img class="result-image" src=${result.snippet.thumbnails.medium.url}></a>`;
// }

// display in a lightbox
function renderResult(result) {
  // console.log(result);
  return `
  <div class="result">  
    <p>${result.snippet.title}</p>
    <a href="//www.youtube.com/watch?v=${result.id.videoId}" data-lity><img class="result-image" alt="video of ${result.snippet.title}" src=${result.snippet.thumbnails.medium.url}></a>
  </div>
  `;
}

function showErr() {
  $(".results").append(`<div class="result">Sorry, no results found.</div>`)
}

function handleNextPage() {
  $(".next").click(function(event) {
    currentToken = nextPageToken;
    pageCount++;
    search(searchQuery);
  });
}

function handlePrevPage() {
  $(".back").click(function(event) {
    currentToken = prevPageToken;
    pageCount--;
    console.log("prev:" + prevPageToken);
    search(searchQuery);
  });
}

handleSubmit();
handleNextPage();
handlePrevPage();