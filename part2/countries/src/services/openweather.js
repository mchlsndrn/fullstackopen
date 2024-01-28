import axios from 'axios'

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'

const getFromLatLng = (latlng) => {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
    return axios
        .get(`${baseUrl}?lat=${latlng[0]}&lon=${latlng[1]}&units=metric&lang=en&appid=${apiKey}`)
        .then(response => response.data)
}

export default { getFromLatLng }