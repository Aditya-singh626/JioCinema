alert("js added");
// window.onload = ()=>{
//     alert("page loaded");
// }
const SpeedUp = document.querySelector("#SpeedUp");
const SpeedDown = document.querySelector("#SpeedDown");
const Volumeup = document.querySelector("#VolumeUp");
const volumedown = document.querySelector("#VolumeDown");
const video_btn = document.querySelector("#open-btn");
const video_input = document.querySelector("#video_input");
const video_player = document.querySelector("#main");
video_btn.addEventListener("click", () => {
  video_input.click();
});
video_input.addEventListener("change", (obj) => {
  console.log("obj", obj);
  const file = obj.target.files[0];
  //scr->base64
  const link = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.src = link;
  video_player.appendChild (video);
});
SpeedUp.addEventListener("click", () => {
  alert("Speed Up");
});
SpeedDown.addEventListener("click", () => {
  alert("Speed Down");
});

Volumeup.addEventListener("click", () => {
  alert("Volume Up");
});
volumedown.addEventListener("click", () => {
  alert("Volume Down");
});
