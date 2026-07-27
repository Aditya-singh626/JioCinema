// select
const searchBtn = document.querySelector("#search");
const searchInput = document.querySelector("input");

// event listener
searchBtn.addEventListener("click", async function () {
  // select value
  const location = searchInput.value;
  // check for empty
  if (location != "") {
    // data get
    const data = await fetchWeather(location);
    //update data inside my dom
    if (data != null) {
      updateDOM(data);
    }
    searchInput.value = "";
  }
});

const tempratureElem = document.querySelector(".temprature");
const locationElem = document.querySelector(".location");
const emojiImg = document.querySelector(".emoji");
const timeElem = document.querySelector(".time");
const dateElem = document.querySelector(".Date");
const conditionElem = document.querySelector(".condition");

function updateDOM(data) {
  /***********************filter required data*********************/
  console.log("i will update the dom", data);
  const temp = data.current.temp_c;
  const location = data.location.name;
  const timeData = data.location.localtime;
  const [date, time] = timeData.split(" ");
  const iconLink = data.current.condition.icon;
  const condition = data.current.condition.text;
  /*********************update the dom*************************/
  tempratureElem.textContent = temp + "°C";
  locationElem.textContent = location;
  emojiImg.src = iconLink;
  dateElem.innerText = date;
  timeElem.innerText = time;
  conditionElem.innerText = condition;
}

async function fetchWeather(location) {
  try {
    const url = `https://api.weatherapi.com/v1/current.json?key=cee410e2cee24abfac8133528262901&q=${location}&aqi=no`;
    // fetch -> inbuilt function to get http response from a server
    const response = await fetch(url);
    console.log("Response Status:", response.status);
    console.log("Response:", response);

    if (response.status == 400) {
      alert("location is invalid");
      return null;
    } else if (response.status == 200) {
      const json = await response.json();
      console.log("Weather Data:", json);
      return json;
    } else {
      console.log("Unexpected status:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error fetching weather:", error);
    alert("Error fetching weather data");
    return null;
  }
}
