import React, { useEffect, useState } from 'react';
import '../Styles/WeatherApp.css';

import clear from '../assets/clear.png';
import cloud from '../assets/cloud.png';
import drizzle from '../assets/drizzle.png';
import humidityIcon from '../assets/humidity.png';
import rain from '../assets/rain.png';
import search from '../assets/search.png';
import snow from '../assets/snow.png';
import windIcon from '../assets/wind.png';

const WeatherDetails = ({ icon, temp, city, country, lat, log, humidityValue, windValue }) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="weather-icon" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className="lat">latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="lon">longitude</span>
          <span>{log}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="humidity" className="icon" />
          <div className="data">
            <div className="humidity-percent">{humidityValue}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="wind" className="icon" />
          <div className="data">
            <div className="wind-percent">{windValue} km/h</div>
            <div className="text">Wind speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

export const WeatherApp = () => {
  let api_key = 'aa3f4e7bc98833e3784c49cd0039756b';

  const [icon, setIcon] = useState(snow);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState('Arcot');
  const [country, setCountry] = useState('IN');
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidityValue, setHumidityValue] = useState(0);
  const [windValue, setWindValue] = useState(0);
  const [text, setText] = useState('Arcot');
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const WeatherIconMap = {
    '01d': clear,
    '01n': clear,
    '02d': cloud,
    '02n': cloud,
    '03d': drizzle,
    '03n': drizzle,
    '04d': drizzle,
    '04n': drizzle,
    '09d': rain,
    '09n': rain,
    '10d': rain,
    '10n': rain,
    '13d': snow,
    '13n': snow,
  };

  const search1 = async () => {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try {
      let res = await fetch(url);
      let data = await res.json();
      if (data.cod === '404') {
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setHumidityValue(data.main.humidity);
      setWindValue(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(WeatherIconMap[weatherIconCode] || clear);
      setCityNotFound(false);
    } catch (error) {
      console.error('an error occurred', error.message);
      setError('An error occurred while fetching weather data.');
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      search1();
    }
  };

  useEffect(() => {
    search1();
  }, []);

  return (
    <div className="container">
      <div className="input-container">
        <input
          type="text"
          className="city-input"
          placeholder="Search City"
          onChange={handleCity}
          value={text}
          onKeyDown={handleKeyDown}
        />
        <div className="search-icon" onClick={search1}>
          <img src={search} alt="search" />
        </div>
      </div>
      {!loading && !cityNotFound && (
        <WeatherDetails
          icon={icon}
          temp={temp}
          city={city}
          lat={lat}
          log={log}
          country={country}
          humidityValue={humidityValue}
          windValue={windValue}
        />
      )}
      {loading && <div className="loading-message">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      {cityNotFound && <div className="city-not-found">City not found</div>}
      <p className="copyright">
        Designed by{' '}
        <a href="https://kathiravanv-60035411614.development.catalystserverless.in/app/index.html" target="_blank" rel="noopener noreferrer">
          Kathiravan
        </a>
      </p>
    </div>
  );
};