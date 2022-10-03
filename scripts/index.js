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

let adsImgs = [
  'https://i.ytimg.com/vi/MaFRE1-sn5Q/maxresdefault.jpg',
  'https://pbs.twimg.com/media/FJFdPCIXoAQh4yX.jpg',
  'https://crehana-blog.imgix.net/media/filer_public/90/83/9083027a-fc03-4e3f-8f55-636ffce6d36c/mcdonalds-happy-meal.jpg?auto=format&q=50',
  'https://quizizz.com/_media/quizzes/c2997833-61e0-4c05-bb77-955299282285_900_900',
  'https://2.bp.blogspot.com/-_x0FdMPtsYI/TgLbdWiJs9I/AAAAAAAABFg/AiHZAdU_6zY/s1600/Halls1.jpg'
]

if(Math.random() > 0.4){
  document.querySelector('.ad-img').src = adsImgs[Math.ceil(Math.random() * 4)]
  document.querySelector('.ad-dialog').showModal()
}

document.querySelector('.close-ad').addEventListener('click', () => {document.querySelector('.ad-dialog').close()})