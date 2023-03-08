import axios from "axios";

const countriesBaseUrl = "https://restcountries.com/v2";

const apiKey = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;
const weatherBaseUrl = "https://api.openweathermap.org/data/2.5/weather?";

const getAll = () =>
  axios.get(`${countriesBaseUrl}/all`).then((response) => response.data);

const getWeather = (country) =>
  axios
    .get(
      `${weatherBaseUrl}lat=${country.latlng[0]}&lon=${country.latlng[1]}&appid=${apiKey}&units=metric`
    )
    .then((response) => response.data);

export default { getAll, getWeather };
