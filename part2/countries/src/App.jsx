import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import countryService from './services/countries'
import weatherService from './services/openweather'

const Weather = ({ country }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    weatherService
      .getFromLatLng(country.capitalInfo.latlng)
      .then(weatherResult => {
        console.log(weatherResult)
        setWeather(weatherResult)
      })
  }, [])

  return (weather != null)
    ? <div>
      <h1>Weather in {country.capital[0]}</h1>
      <div>Temperature: {weather.main.temp}&#176; C (Feels like {weather.main.feels_like}&#176; C)</div>
      <div>
        <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} /><br />
        {weather.weather[0].description}</div>
      <div>Wind: {weather.wind.speed} m/s</div>
    </div>
    : <div></div>
}

const DetailView = ({ country }) => {
  return (country != null)
    ? <div>
      <h1>{country.name.common}</h1>
      <div>
        <div>Capital: {country.capital[0]}</div>
        <div>Area: {country.area}</div>
      </div>
      <h1>Languages</h1>
      <div>
        <ul>
          {Object.values(country.languages).map((language, index) =>
            <li key={index}>{language}</li>
          )}
        </ul>
      </div>
      <div>
        <img src={country.flags.png} width="160" />
      </div>
      <Weather country={country} />
    </div>
    : <></>
}

const Results = ({ countries, searchResults, maxResults, setSelectedCountry, setFindQuery }) => {
  if (searchResults.length > maxResults) {
    return <div>{searchResults.length} matches, please be more specific.</div>
  } else if (searchResults.length > 1) {
    // return <ul>
    //   {searchResults.map((country, index) =>
    //     <li key={index}>{country.name.common} <button onClick={() => { setFindQuery(country.name.common.toLowerCase()) }}>Show</button></li>
    //   )}
    // </ul>
    return <div>
      <ul>
        {searchResults.map((country, index) =>
          <li key={index}>{country.name.common} <button onClick={() => { setSelectedCountry(country) }}>Show</button></li>
        )}
      </ul>
    </div>
  } else if (searchResults.length == 1) {
    return <DetailView country={searchResults[0]} />
  } else {
    return <div>No matching countries were found.</div>
  }
}

const Find = ({ value, onChange }) => {
  return (
    <>
      <div>find countries<input value={value} onChange={onChange}></input></div>
    </>
  )
}

function App() {
  const [countries, setCountries] = useState([])
  const [findQuery, setFindQuery] = useState('')
  const maxResults = 10
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    countryService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  const handleFindQueryChange = (event) => {
    setSelectedCountry(null)
    setFindQuery(event.target.value)
  }

  const searchResults = (findQuery == '')
    ? countries
    : countries.filter(country => {
      return (country.name.common.toLowerCase().indexOf(findQuery.toLowerCase()) != -1)
    })

  return (
    <>
      <Find value={findQuery} onChange={handleFindQueryChange} />
      <Results countries={countries} searchResults={searchResults} maxResults={maxResults} setSelectedCountry={setSelectedCountry} setFindQuery={setFindQuery} />
      {(selectedCountry != null) ? <DetailView country={selectedCountry} /> : <></>}
    </>
  )
}

export default App
