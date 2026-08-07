// ============================================================
// TMDB API Configuration & Utility
// ============================================================
// Fetches movies/TV data from TMDB API.
// Implements retry with exponential backoff on failure.
// ============================================================

// ---------- HEADERS ----------
// Bearer token for TMDB API authentication (from .env).
const headers = {
  accept: "application/json",
  Authorization: `Bearer ${process.env.TMDB_KEY}`,
};

// ---------- BASE URLs ----------
// Full image URL builder prefix
// Base URL for TMDB API v3
const imageBASEURL = "https://image.tmdb.org/t/p/original";
const tmdbBASEURL = "https://api.themoviedb.org/3";

// ---------- TMDB ENDPOINTS ----------
// Shortcut paths for TMDB API endpoints.
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
// RETRY SETTINGS
// ============================================================
const MAX_RETRIES = 4; // Max retry attempts after initial failure
const BASE_DELAY_MS = 1000; // Base delay in ms (doubles each retry)

// ============================================================
// HELPER: Sleep
// ============================================================
// Pauses execution for `ms` milliseconds.
// Used to wait between retries.
// ============================================================
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================
// HELPER: Exponential Backoff Delay
// ============================================================
// Calculates delay: 2^retryNumber * BASE_DELAY_MS
// Retry 1: 2s, Retry 2: 4s, Retry 3: 8s, Retry 4: 16s
// Exponential backoff prevents overwhelming TMDB.
// ============================================================
function getDelayForRetry(retryNumber) {
  const delayMs = Math.pow(2, retryNumber) * BASE_DELAY_MS;

  console.log(`  ⏱  Waiting ${delayMs / 1000} seconds before retry...`);
  return delayMs;
}

// ============================================================
// MAIN FUNCTION: Fetch with Retry Logic
// ============================================================
// Attempts to fetch data from TMDB. On failure, retries with
// exponential backoff up to MAX_RETRIES times.
// Returns data on success, or an error object on failure.
// ============================================================
async function fetchWithRetry(endpoint) {
  const url = tmdbBASEURL + endpoint;
  let lastError = null;

  // Loop: initial attempt + MAX_RETRIES retries
  for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
    try {
      console.log(
        `\n📡 [Attempt ${attempt}/${MAX_RETRIES + 1}] Fetching from TMDB...`,
      );

      // Make HTTP request
      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });

      // Check HTTP status (200-299 = success)
      if (!response.ok) {
        throw new Error(
          `TMDB error (status ${response.status}: ${response.statusText})`,
        );
      }

      // Parse response
      const data = await response.json();
      // to check the data is coming or not
      // console.log("data is 'coming like this from the tmdb => ", data);

      // Validate data - retry if empty results
      const hasValidResults =
        Array.isArray(data.results) && data.results.length > 0;
      const isSingleItem = data.id !== undefined;
      const isValidData = hasValidResults || isSingleItem;

      if (isValidData) {
        // Success - return data
        const itemCount = hasValidResults
          ? `${data.results.length} items`
          : `single item (ID: ${data.id})`;
        console.log(`  ✅ Success! Got ${itemCount}`);
        return data;
      } else {
        // Empty response - trigger retry
        throw new Error("Received empty results - will retry");
      }
    } catch (error) {
      // Log failure
      lastError = error;
      console.log(`  ❌ Attempt ${attempt} failed: ${error.message}`);
    }

    // Retry or give up
    if (attempt <= MAX_RETRIES) {
      const delay = getDelayForRetry(attempt);
      await sleep(delay);
    } else {
      console.log(`  💀 All ${MAX_RETRIES + 1} attempts failed. Giving up.`);
    }
  }

  // All attempts exhausted - return error
  return {
    error: true,
    message: `Failed after ${MAX_RETRIES + 1} attempts. Last error: ${lastError?.message}`,
    url: url,
  };
}

// ============================================================
// TMDB API WRAPPER
// ============================================================
// Clean interface for controllers to fetch data via tmdbApi.get().
// Retry logic is handled internally.
// ============================================================
const tmdbApi = {
  get: async (endpoint) => {
    console.log(`\n========== TMDB REQUEST ==========`);
    console.log(`  Endpoint: ${endpoint}`);
    console.log(`  Max retries: ${MAX_RETRIES}`);
    console.log(`==================================`);
    const data = await fetchWithRetry(endpoint);
    return data;
  },
};

// ============================================================
// EXPORTS
// ============================================================
// tmdbApi       → Main API fetcher with retry logic
// TMDB_ENDPOINT → API endpoint path shortcuts
// imageBASEURL  → Base URL for building image URLs
// ============================================================
module.exports = { tmdbApi, TMDB_ENDPOINT, imageBASEURL };
