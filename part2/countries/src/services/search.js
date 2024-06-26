import axios from 'axios';

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all';
const weatherBaseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const weatherApi = import.meta.env.VITE_WEATHER_API;

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then(response => response.data)
};

const getWeather = (country) => {
  const request = axios.get(
    `${weatherBaseUrl}?q=${country.capital},${country.cca2}&APPID=${weatherApi}`
  );
  return request.then(response => response.data)
};

export default { getAll, getWeather };
