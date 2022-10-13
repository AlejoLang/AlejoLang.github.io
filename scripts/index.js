const getWeatherData = async () => {
  const API_KEY = 'GdOtyPaUGVSU0iPE0jxpqSg1D4y7khQV';
  const LOCATION = await fetch(`http://dataservice.accuweather.com/locations/v1/cities/ipaddress?apikey=${API_KEY}&language=es-AR`)
                    .then(res => res.json());
  const URL = `http://dataservice.accuweather.com/currentconditions/v1/${LOCATION.Key}?apikey=${API_KEY}&language=es-AR&details=true`;

  const data = await fetch(URL)
  if(!data.ok){
    alert('Error en el servidor')
  }

  return {data: (await data.json())[0], location: LOCATION.LocalizedName}
}

const displayWeatherData = async () => {
  const {location, data} = await getWeatherData();
console.log(data.Wind, location)

  document.querySelector('.time-title').textContent = `El tiempo en ${location} es: `
  document.querySelector('.time-cond-img').src = `./images/icons/${data.WeatherIcon}.svg`
  document.querySelector('.time-cond-temp').textContent = `${data.Temperature.Metric.Value}º C`
  document.querySelector('.time-extra-feelslike').innerHTML = `Sensacion Térmica: <span>${data.RealFeelTemperature.Metric.Value}º C</span>`
  document.querySelector('.time-extra-humidity').innerHTML = `Humedad: <span>${data.RelativeHumidity ?? '0'}%</span>`
  document.querySelector('.time-extra-wind').innerHTML = `Velocidad del viento: <span>${data.Wind.Speed.Metric.Value} KM/h</span>`
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