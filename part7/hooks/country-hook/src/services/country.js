import axios from "axios";

const countriesBaseUrl =
  "https://studies.cs.helsinki.fi/restcountries/api/name";

const getCountryByName = async (name) => {
  if (name) {
    const country = await axios.get(`${countriesBaseUrl}/${name}`);
    return country.errors ? { found: false } : country.data;
  }
  return null;
};

export default { getCountryByName };
