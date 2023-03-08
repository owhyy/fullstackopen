import { useEffect, useState } from "react";
import countryService from "./services/country";
import Country from "./components/Country";
import Weather from "./components/Weather";
import Search from "./components/Search";
import CountryChoices from "./components/CountryChoices";

const App = () => {
  const [searchLabel, setLabel] = useState(null);
  const [countries, setCountries] = useState(null);
  const [countryChoices, setCountryChoices] = useState(null);

  const [currentCountry, setCurrentCountry] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);

  useEffect(() => {
    countryService
      .getAll()
      .then((initialCountries) => setCountries(initialCountries));
  }, []);

  if (!countries) return null;

  const handleShowCountry = (event) => {
    const countryInput = event.target.value;
    const matchingCountries = countries.filter((country) =>
      country.name.toLowerCase().includes(countryInput.toLowerCase())
    );
    if (matchingCountries.length === 1) {
      const currentCountry = matchingCountries[0];
      setCurrentCountry(currentCountry);
      countryService
        .getWeather(currentCountry)
        .then((weather) => setCurrentWeather(weather));
      setCountryChoices(null);
      setLabel(null);
      return;
    } else if (matchingCountries.length < 10) {
      setCountryChoices(matchingCountries);
      setCurrentCountry(null);
      setCurrentWeather(null);
      setLabel(null);
    } else {
      setLabel("Too many matches, be more specific");
      setCountryChoices(null);
      setCurrentCountry(null);
      setCurrentWeather(null);
    }
  };

  const chooseCountry = (country) => {
    setLabel(null);
    setCountryChoices(null);
    setCurrentCountry(country);
  };

  return (
    <div>
      <Search onChange={handleShowCountry} />
      <p>{searchLabel}</p>
      <CountryChoices choices={countryChoices} chooseCountry={chooseCountry} />
      <Country country={currentCountry} />
      <Weather weather={currentWeather} />
    </div>
  );
};

export default App;
