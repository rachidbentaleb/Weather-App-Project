let cityInput = document.getElementById("cityInput");
let btn = document.getElementById("btn");
let apiKey = "dbddea583086d4bf30c85b00ed6d3fba";
let apiKeyPexels = "ZM1s6yOsXe0rqjtNrpuuANhX8uEf0Ed2BjTtW7xqmv4D1pEKj9sWxpG2";
let cityTitle = document.getElementById("cityTitle");
let cityTemp = document.getElementById("cityTemp");
let cityHumidite = document.getElementById("cityHumidite");
let cityDescription = document.getElementById("cityDescription");
let cityWind = document.getElementById("cityWind"); 
let currentDay = document.getElementById("currentDay");
let cityImage = document.getElementById("cityImage");


// Function to fetch and display weather data based on a given URL
const fetchWeather = async (url) => {
    let data = await fetch(url);
    let response = await data.json();

    // Update elements with weather data
    cityTitle.textContent = response.name;
    cityTemp.textContent = `${response.main.temp} °C`;
    cityHumidite.textContent = `Humidité: ${response.main.humidity}%`;
    cityWind.textContent = `Vitesse du vent: ${response.wind.speed} m/s`;
    cityDescription.textContent = response.weather[0].description;
    currentDay.textContent = `Jour: ${new Date().toLocaleDateString('fr-FR', { weekday: 'long' })}`;
};

// Function to fetch city image from Pexels API
const fetchCityImage = async (city) => {
    let urlImage = `https://api.pexels.com/v1/search?query=${city}&per_page=1`;
    let dataImage = await fetch(urlImage, {
        headers: {
            Authorization: apiKeyPexels
        }
    });
    let responseImage = await dataImage.json();

    // Check for the first photo result and use the larger version or original if available
    if (responseImage.photos.length > 0) {
        const photo = responseImage.photos[0];
        // Use the original image for higher resolution, or a different size as needed
        cityImage.src = photo.src.original;
        cityImage.alt = `Image of ${city}`; // Add alt text for accessibility
    } else {
        cityImage.alt = "No image available for this city";
        cityImage.src = ""; // Clear the image if no result is found
    }
};
// Function to get weather by city name
const changeCity = () => {
    let city = cityInput.value;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`;
    fetchWeather(url);
    fetchCityImage(city);
};

// Function to get weather for the user's current location
const getCurrentLocationWeather = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=fr`;
            fetchWeather(url);
        });
    } else {
        cityTitle.textContent = "Geolocation not supported by this browser.";
    }
};

// Fetch current location weather on page load
window.onload = getCurrentLocationWeather;

// Add event listener for city search button
btn.addEventListener("click", changeCity);
