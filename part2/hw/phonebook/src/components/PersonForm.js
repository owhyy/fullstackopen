const PersonForm = ({ onSubmit, nameOnChange, phoneOnChange }) => (
  <form onSubmit={onSubmit}>
    <div>
      name: <input onChange={nameOnChange} />
      <br></br>
      phone: <input onChange={phoneOnChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

export default PersonForm;
