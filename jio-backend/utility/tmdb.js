// ✅ Headers for TMDB requests
// Use v4 Bearer token (long JWT string) in .env as TMDB_KEY
// If you only have v3 API key, switch to query param instead of Authorization
const headers = {
  accept: "application/json",
  Authorization: `Bearer ${process.env.TMDB_KEY}`, 
};

// ✅ Base URLs
const imageBASEURL = "https://image.tmdb.org/t/p/original";
const tmdbBASEURL = "https://api.themoviedb.org/3";

// ✅ Endpoints organized
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

// ✅ API wrapper with error handling
const tmdbApi = {
  get: async (endpoint) => {
    const url = tmdbBASEURL + endpoint;
    try {
      const response = await fetch(url, { method: "GET", headers });
      if (!response.ok) {
        // ❌ previously missing: check for failed response
        throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Fetch failed:", err.message);
      return { error: err.message, url };
    }
  },
};

module.exports = { tmdbApi, TMDB_ENDPOINT, imageBASEURL };
