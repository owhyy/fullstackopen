const Country = ({ country }) => {
  if (!country) return null;
  return (
    <div>
      <h1>{country.name}</h1>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <h2>languages</h2>
      <ul>
        {country.languages.map((language) => (
          <li key={language.name}>{language.name}</li>
        ))}
      </ul>
      <img width="30%" src={country.flag} alt={`${country.name}'s flag`}></img>
    </div>
  );
};

export default Country;
