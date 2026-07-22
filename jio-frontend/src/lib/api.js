import axios from "axios";

export const ENDPOINT = {
  // auth
  login: "/api/auth/login",
  signup: "/api/auth/signup",
  logout: "/api/auth/logout",
  forgetpassword: "/api/auth/forgetpassword",
  resetPassword: "/api/auth/resetPassword",

  // discover
  discoverNowPlaying: "/api/discover/now-playing",
  discoverTrending: "/api/discover/trending",
  discoverTopRated: "/api/discover/top-rated",
  discoverUpcoming: "/api/discover/upcoming",

  // movies
  fetchActionMovies: "/api/movies/action",
  fetchComedyMovies: "/api/movies/comedy",
  fetchHorrorMovies: "/api/movies/horror",
  fetchRomanceMovies: "/api/movies/romance",
  fetchAnimeMovies: "/api/movies/anime",

  // tv shows
  fetchActionTvShows: "/api/tv/action",
  fetchComedyTvShows: "/api/tv/comedy",
  fetchCrimeTvShows: "/api/tv/crime",
  fetchDramaTvShows: "/api/tv/drama",
  fetchMysteryTvShows: "/api/tv/mystery",

  // extra data
  getMovieDetails: (id) => `/api/movies/details?id=${id}`,
  getTvShowsDetails: (id) => `/api/tv/details?id=${id}`,
  // video
  getMovieVideos: (id) => `/api/movies/videos?id=${id}`,
  getTvShowsVideos: (id) => `/api/tv/videos?id=${id}`,

  // user
  user: "/api/user/",
  addToWishlist: "/api/user/wishlist",
  getWishlist: "/api/user/wishlist",

  // payment
  payment: "/api/payment/order",
  updatePremium: "/api/payment/update-premium-access",

  // streaming urls
  fetchAllStreamingVideos: "/api/video",
  fetchStreamingVideo: (id) => `/api/video?id=${id}`,
  fetchVideoThumbnail: (id) => `/api/video/thumbnail?videoId=${id}`,
};

export const media = (path) => `https://image.tmdb.org/t/p/original` + path;

const API_BASE_URL = "http://localhost:3000"; // Replace with your backend API base URL

export const api = axios.create({
  baseURL: API_BASE_URL,
  // credentials
  withCredentials: true,
});

export function getWatchUrl(vidId, mediaType, poster_path) {
  const prefix = mediaType;
  return `/${prefix}/watch?id=${vidId}&poster_path=${poster_path}`;
}
export function getWatchUrlhome(vidId, poster_path) {
  return `/watch?id=${vidId}&poster_path=${poster_path}`;
}

export const getStreamingVideoThumbnail = (id) =>
  API_BASE_URL + ENDPOINT.fetchVideoThumbnail(id);
