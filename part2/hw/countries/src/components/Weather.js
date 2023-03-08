const Weather = ({ weather }) => {
  if (!weather) return null;

  return (
    <div>
      <h2>weather in {weather.name}</h2>
      <p>temperature {weather.main.temp} Celsius</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      ></img>
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  );
};

export default Weather;
