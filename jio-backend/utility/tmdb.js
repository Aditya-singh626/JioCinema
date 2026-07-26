// ============================================================
// TMDB API Configuration & Utility
// ============================================================
// This file talks to The Movie Database (TMDB) API to get
// movies, TV shows, and their details.
//
// If TMDB is busy or having problems, we don't give up
// immediately - we WAIT and TRY AGAIN a few times.
// This is called "retry logic" with "exponential backoff".
//
// What does exponential backoff mean?
// - 1st retry: wait 2 seconds
// - 2nd retry: wait 4 seconds
// - 3rd retry: wait 8 seconds
// - 4th retry: wait 16 seconds
// Each time we wait longer so TMDB gets a break.
// ============================================================

// ---------- HEADERS ----------
// TMDB needs this "Authorization" token so it knows we're allowed to ask for data.
// The actual token is stored in a .env file (process.env.TMDB_KEY).
const headers = {
  accept: "application/json",
  Authorization: `Bearer ${process.env.TMDB_KEY}`,
};

// ---------- BASE URLs ----------
// imageBASEURL - we use this in controllers to build full image paths
// tmdbBASEURL  - this is the starting point for all API calls
const imageBASEURL = "https://image.tmdb.org/t/p/original";
const tmdbBASEURL = "https://api.themoviedb.org/3";

// ---------- TMDB ENDPOINTS ----------
// These are like "addresses" for different data on TMDB's server.
// Instead of typing long URLs everywhere, we just use these short names.
// Example: TMDB_ENDPOINT.fetchPopular gives us "/movie/popular"
const TMDB_ENDPOINT = {
  // Discover movies
  fetchNowPlaying: "/movie/now_playing",
  fetchTrending: "/trending/all/week",
  fetchPopular: "/movie/popular",
  fetchUpcoming: "/movie/upcoming?include_video=true",
  fetchTopRated: "/movie/top_rated?include_video=true",

  // Movies by genre
  fetchActionMovies: "/discover/movie?language=en-US&with_genres=28",
  fetchComedyMovies: "/discover/movie?language=en-US&with_genres=35",
  fetchHorrorMovies: "/discover/movie?language=en-US&with_genres=27",
  fetchRomanceMovies: "/discover/movie?language=en-US&with_genres=10749",
  fetchAnimeMovies: "/discover/movie?language=en-US&with_genres=16",

  // Movie details
  fetchMovieVideos: (id) => `/movie/${id}/videos`,
  fetchMovieDetails: (id) => `/movie/${id}`,

  // TV Shows by genre
  fetchActionTvShows: "/discover/tv?language=en-US&with_genres=10759",
  fetchComedyTvShows: "/discover/tv?language=en-US&with_genres=35",
  fetchMysteryTvShows: "/discover/tv?language=en-US&with_genres=9648",
  fetchDramaTvShows: "/discover/tv?language=en-US&with_genres=18",
  fetchCrimeTvShows: "/discover/tv?language=en-US&with_genres=80",

  // TV details
  fetchTvShowVideos: (id) => `/tv/${id}/videos`,
  fetchTvShowDetails: (id) => `/tv/${id}`,
};

// ============================================================
// RETRY SETTINGS (things you can change)
// ============================================================
const MAX_RETRIES = 4; // How many times to try again after the first attempt fails
const BASE_DELAY_MS = 1000; // Start with a 1-second wait. Gets multiplied each retry.

// ============================================================
// HELPER: Sleep / Pause
// ============================================================
// This just pauses the code for a certain number of milliseconds.
// Example: await sleep(2000) pauses for 2 seconds.
// We use this to wait between retries instead of spamming TMDB.
// ============================================================
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================
// HELPER: Calculate how long to wait before retrying
// ============================================================
// How exponential backoff works (simple version):
//
// We do:  2^retryNumber * BASE_DELAY_MS
//
// retry #1:  2^1 = 2  → 2 * 1000ms =  2 seconds
// retry #2:  2^2 = 4  → 4 * 1000ms =  4 seconds
// retry #3:  2^3 = 8  → 8 * 1000ms =  8 seconds
// retry #4:  2^4 = 16 → 16 * 1000ms = 16 seconds
//
// Why exponential? Because if TMDB is overloaded, spamming it
// with requests every 1 second makes things WORSE. By waiting
// longer each time, we give TMDB space to recover.
// ============================================================
function getDelayForRetry(retryNumber) {
  // Math.pow(2, retryNumber) means "2 to the power of retryNumber"
  // Example: retryNumber=3 → Math.pow(2, 3) → 8
  const delayMs = Math.pow(2, retryNumber) * BASE_DELAY_MS;

  console.log(`  ⏱  Waiting ${delayMs / 1000} seconds before retry...`);
  return delayMs;
}

// ============================================================
// MAIN FUNCTION: Fetch with Retry Logic
// ============================================================
// This is the heart of the file. Here's what it does step-by-step:
//
// 1. Try to fetch data from TMDB
// 2. If it works → great! Return the data.
// 3. If it fails (network error, TMDB error, empty results) →
//    a. Wait a bit (using exponential backoff)
//    b. Try again
//    c. Keep doing this until we either get data or run out of retries
// 4. If ALL attempts fail → return an error object
//
// Think of it like calling a friend who's bad at picking up:
// - Call once (attempt 1)
// - No answer? Wait 2 seconds, call again (attempt 2)
// - Still no answer? Wait 4 seconds, call again (attempt 3)
// - ...and so on until you give up.
// ============================================================
async function fetchWithRetry(endpoint) {
  const url = tmdbBASEURL + endpoint;
  let lastError = null;

  // ---------------------------------------------------------
  // LOOP: Try up to (MAX_RETRIES + 1) times
  // The "+1" is because the first attempt isn't a "retry" -
  // it's the initial try. retries only happen after it fails.
  //
  // attempt=1 → first try (not a retry)
  // attempt=2 → retry #1 (after first failure)
  // attempt=3 → retry #2
  // ... and so on
  // ---------------------------------------------------------
  for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
    try {
      console.log(
        `\n📡 [Attempt ${attempt}/${MAX_RETRIES + 1}] Fetching from TMDB...`,
      );

      // ---------- STEP 1: Make the HTTP request ----------
      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });

      // ---------- STEP 2: Check if TMDB said "no" ----------
      // response.ok is true if status code is 200-299
      // If it's false, TMDB sent an error (like 429 = too many requests)
      if (!response.ok) {
        throw new Error(
          `TMDB said no (status ${response.status}: ${response.statusText})`,
        );
      }

      // ---------- STEP 3: Convert response to JSON ----------
      const data = await response.json();

      // ---------- STEP 4: Check if data is actually useful ----------
      // TMDB sometimes sends back an empty "results" array.
      // That means the request worked but there's nothing to show.
      // In that case, we retry because maybe next time there will be data.

      const hasValidResults =
        Array.isArray(data.results) && data.results.length > 0;
      const isSingleItem = data.id !== undefined; // Like a specific movie details
      const isValidData = hasValidResults || isSingleItem;

      if (isValidData) {
        // 🎉 SUCCESS! Data looks good. Return it.
        const itemCount = hasValidResults
          ? `${data.results.length} items`
          : `single item (ID: ${data.id})`;
        console.log(`  ✅ Success! Got ${itemCount}`);
        return data;
      } else {
        // Data is empty. Throw an error so the retry logic kicks in.
        throw new Error("Received empty results - will retry");
      }
    } catch (error) {
      // ---------- STEP 5: If something went wrong... ----------
      lastError = error;
      console.log(`  ❌ Attempt ${attempt} failed: ${error.message}`);
    }

    // ---------- STEP 6: Decide: should we try again? ----------
    if (attempt <= MAX_RETRIES) {
      // Yes! We have retries left. Wait, then go back to try again.
      const delay = getDelayForRetry(attempt);
      await sleep(delay);
    } else {
      // No more retries left. Give up.
      console.log(`  💀 All ${MAX_RETRIES + 1} attempts failed. Giving up.`);
    }
  }

  // If we reach here, all attempts failed. Return a friendly error.
  return {
    error: true,
    message: `Failed after ${MAX_RETRIES + 1} attempts. Last error: ${lastError?.message}`,
    url: url,
  };
}

// ============================================================
// TMDB API WRAPPER (the friendly interface)
// ============================================================
// This is what controllers actually use.
// Controllers just call:  tmdbApi.get(TMDB_ENDPOINT.fetchPopular)
// They don't need to worry about retries or delays - it's all handled.
// ============================================================
const tmdbApi = {
  get: async (endpoint) => {
    console.log(`\n========== TMDB REQUEST ==========`);
    console.log(`  Endpoint: ${endpoint}`);
    console.log(`  Max retries: ${MAX_RETRIES}`);
    console.log(`==================================`);

    // fetchWithRetry handles all the retry logic internally.
    // We just call it and get back data (or an error object).
    const data = await fetchWithRetry(endpoint);

    // If data has an error, controllers can check: if (data.error) ...
    // If data has results, controllers can use: data.results ...
    return data;
  },
};

// ============================================================
// EXPORTS (what other files can use)
// ============================================================
// tmdbApi       → The main tool. Controllers use this to fetch data.
// TMDB_ENDPOINT → A list of endpoint "addresses" to avoid typing URLs manually.
// imageBASEURL  → Used to build full poster/backdrop image paths.
// ============================================================
module.exports = { tmdbApi, TMDB_ENDPOINT, imageBASEURL };
