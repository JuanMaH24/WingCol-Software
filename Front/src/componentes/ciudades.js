import React, { useState, useEffect } from "react";

// Aquí irían las funciones para obtener el token, países, estados y ciudades (como fetchAuthToken, fetchCountries, etc.)

const LocationSelector = ({ onLocationChange }) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [token, setToken] = useState(null);

  // Obtener el token cuando el componente se monta
  useEffect(() => {
    const getToken = async () => {
      const authToken = await fetchAuthToken();
      setToken(authToken);
    };

    getToken();
  }, []);

  // Obtener la lista de países cuando se obtiene el token
  useEffect(() => {
    if (token) {
      const getCountries = async () => {
        const countriesList = await fetchCountries(token);
        setCountries(countriesList);
      };

      getCountries();
    }
  }, [token]);

  // Obtener la lista de estados cuando el usuario selecciona un país
  useEffect(() => {
    if (selectedCountry && token) {
      const getStates = async () => {
        const statesList = await fetchStates(token, selectedCountry);
        setStates(statesList);
        setCities([]); // Limpiar las ciudades al cambiar el país
      };

      getStates();
    }
  }, [selectedCountry, token]);

  // Obtener la lista de ciudades cuando el usuario selecciona un estado
  useEffect(() => {
    if (selectedState && token) {
      const getCities = async () => {
        const citiesList = await fetchCities(token, selectedState);
        setCities(citiesList);
      };

      getCities();
    }
  }, [selectedState, token]);

  // Manejar el cambio de país
  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSelectedState("");
    setSelectedCity("");
    if (onLocationChange) {
      onLocationChange({ country, state: "", city: "" });
    }
  };

  // Manejar el cambio de estado
  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedCity("");
    if (onLocationChange) {
      onLocationChange({ country: selectedCountry, state, city: "" });
    }
  };

  // Manejar el cambio de ciudad
  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    if (onLocationChange) {
      onLocationChange({
        country: selectedCountry,
        state: selectedState,
        city,
      });
    }
  };

  return (
    <div>
      <h2>Selecciona Ubicación</h2>
      {/* Selector de Países */}
      <select value={selectedCountry} onChange={handleCountryChange}>
        <option value="">Selecciona un país</option>
        {countries.map((country) => (
          <option key={country.country_name} value={country.country_name}>
            {country.country_name}
          </option>
        ))}
      </select>

      {/* Selector de Estados (se habilita solo si se selecciona un país) */}
      {states.length > 0 && (
        <select value={selectedState} onChange={handleStateChange}>
          <option value="">Selecciona un estado</option>
          {states.map((state) => (
            <option key={state.state_name} value={state.state_name}>
              {state.state_name}
            </option>
          ))}
        </select>
      )}

      {/* Selector de Ciudades (se habilita solo si se selecciona un estado) */}
      {cities.length > 0 && (
        <select value={selectedCity} onChange={handleCityChange}>
          <option value="">Selecciona una ciudad</option>
          {cities.map((city) => (
            <option key={city.city_name} value={city.city_name}>
              {city.city_name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default LocationSelector;
