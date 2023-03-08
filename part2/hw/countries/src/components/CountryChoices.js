const CountryChoices = ({ choices, chooseCountry }) => {
  if (!choices) return null;
  return (
    <div>
      {choices.map((choice) => (
        <p key={choice.name}>
          {choice.name}
          <button onClick={() => chooseCountry(choice)}>show</button>
        </p>
      ))}
    </div>
  );
};

export default CountryChoices;
