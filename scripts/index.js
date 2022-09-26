const getWeatherData = async () => {
  const API_KEY = 'c1f12ce4caf4465abec190914222609';
  const URL = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=auto:ip`;

  let data = await fetch(URL)
  if(!data.ok){
    alert('Error en el servidor')
  }
  return data.json()
}

const displayWeatherData = async () => {
  const {location, current} = await getWeatherData();

  document.querySelector('.time-title').textContent = `El tiempo en ${location.name}${location.region ? ', ' + location.region : ''} es: `
  document.querySelector('.time-cond-img').src = current.condition.icon
  document.querySelector('.time-cond-temp').textContent = `${current.temp_c}º C`
  document.querySelector('.time-extra-feelslike').innerHTML = `Sensacion Térmica: <span>${current.feelslike_c}º C</span>`
  document.querySelector('.time-extra-humidity').innerHTML = `Humedad: <span>${current.humidity}%</span>`
  document.querySelector('.time-extra-wind').innerHTML = `Velocidad del viento: <span>${current.wind_kph} KM/h</span>`
}

window.addEventListener('load', displayWeatherData(), false)