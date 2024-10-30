import React, { useState, useEffect } from "react";

export default function LocationSelector({ onLocationChange }) {
  const [token, setToken] = useState("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const CITY_API_KEY = process.env.REACT_APP_CITY_API_KEY; // Replace with your actual API key
  const CITY_API_URL = process.env.REACT_APP_CITY_API_URL;
  const CITY_API_MAIL = process.env.REACT_APP_CITY_API_MAIL;
  
  useEffect(() => {
    getAuthToken();
  }, []);

  useEffect(() => {
    if (token) {
      getCountries();
    }
  }, [token]);

  useEffect(() => {
    if (selectedCountry) {
      getStates(selectedCountry);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      getCities(selectedState);
    }
  }, [selectedState]);

  const getAuthToken = async () => {
    try {
      const response = await fetch(`${CITY_API_URL}/getaccesstoken`, {
        headers: {
          Accept: "application/json",
          "api-token": CITY_API_KEY,
          "user-email": CITY_API_MAIL, // Replace with your registered email
        },
      });
      const data = await response.json();
      setToken(data.auth_token);
    } catch (error) {
      console.error("Error fetching auth token:", error);
    }
  };

  const getCountries = async () => {
    try {
      const response = await fetch(`${CITY_API_URL}/countries/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const getStates = async (country) => {
    try {
      const response = await fetch(`${CITY_API_URL}/states/${country}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await response.json();
      setStates(data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const getCities = async (state) => {
    try {
      const response = await fetch(`${CITY_API_URL}/cities/${state}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSelectedState("");
    setSelectedCity("");
    onLocationChange("country", country);
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedCity("");
    onLocationChange("state", state);
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    onLocationChange("city", city);
  };

  return (
    <div className="space-y-4">
      <select
        value={selectedCountry}
        onChange={handleCountryChange}
        className="multiples-opciones"
      >
        <option value="">Selecciona el país</option>
        {countries.map((country) => (
          <option key={country.country_name} value={country.country_name}>
            {country.country_name}
          </option>
        ))}
      </select>

      <select
        value={selectedState}
        onChange={handleStateChange}
        className="multiples-opciones"
        disabled={!selectedCountry}
      >
        <option value="">Selecciona el departamento/estado</option>
        {states.map((state) => (
          <option key={state.state_name} value={state.state_name}>
            {state.state_name}
          </option>
        ))}
      </select>

      <select
        value={selectedCity}
        onChange={handleCityChange}
        className="multiples-opciones"
        disabled={!selectedState}
      >
        <option value="">Selecciona la ciudad</option>
        {cities.map((city) => (
          <option key={city.city_name} value={city.city_name}>
            {city.city_name}
          </option>
        ))}
      </select>
    </div>
  );
}
