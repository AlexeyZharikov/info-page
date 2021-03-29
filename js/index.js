import 'regenerator-runtime/runtime';
import axios from 'axios';



require('dotenv').config({
  path: '../'
});

const weatherApi = process.env.OPEN_WEATHER_API;
const weatherKey = process.env.OPEN_WEATHER_API_KEY;
const locationApi = process.env.BDC_API;
const currencyApi = process.env.CURRENCY_API;
const currencyRateApi = process.env.CURRENCY_RATE_API;
const currencyRateApiKey = process.env.CURRENCY_RATE_API_KEY;
const newsApi = process.env.NEWS_API;
const newsApiKey = process.env.NEWS_API_KEY;


if ('geolocation' in navigator) {
  console.log('geolocation is available');

  navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    axios.get(`${locationApi}?latitude=${lat}&longitude=${lng}`)
      .then(resp => {
        const { countryName, city, countryCode } = resp.data;
        document.getElementById('lat').textContent = `Latitude: ${Math.round(lat)} °`;
        document.getElementById('lng').textContent = `Longitude: ${Math.round(lng)} °`;
        document.getElementById('country').textContent = `Country: ${countryName} `;
        document.getElementById('city').textContent = `City: ${city} `;

        axios.get(`${currencyApi}`)
          .then(resp => {
            const currencyArr = resp.data;
            currencyArr.map((elem, i) => {
              if (currencyArr[i].name === countryName) {
                const { code } = elem.currencies[0];
                document.getElementById('currency').textContent = `Currency: ${code}`;


                axios.get(`${currencyRateApi}&to=${code}&api_key=${currencyRateApiKey}`)
                  .then(resp => {
                    const { result } = resp.data
                    for (let [key, value] of Object.entries(result)) {
                      document.getElementById('rate').textContent = `Currency Rate (USD to ${key}): ${value}`
                    }
                  })
                  .catch(err => {
                    return err
                  })
              }
            })
          })
          .catch(err => {
            return err
          })
        axios.get(`${newsApi}${countryCode}&apiKey=${newsApiKey}`)
        .then(resp => {
          const { articles } =  resp.data; 
           articles.map((elem, i) => {
              const { title, url } = elem;
                document.getElementById('news').innerHTML = `<li><a href="${url}">${title}</a></li>` 
            })
          })
          .catch(err => {
            return err
          })
      })
      .catch(err => {
        return err
      })

    axios.get(`${weatherApi}?lat=${lat}&lon=${lng}&units=metric&appid=${weatherKey}`)
      .then(resp => {
        const sky = resp.data.weather[0].description;
        const cur_tmp = resp.data.main.temp;
        const min_tmp = resp.data.main.temp_min;
        const max_tmp = resp.data.main.temp_max;
        const pressure = resp.data.main.pressure;
        const wind = resp.data.wind.speed;
        document.getElementById('sky').textContent = `Sky: ${sky}`;
        document.getElementById('cur_tmp').textContent = `Current temperature: ${cur_tmp}  °C`;
        document.getElementById('min_tmp').textContent = `Min temperature: ${min_tmp}  °C`;
        document.getElementById('max_tmp').textContent = `Max temperature: ${max_tmp} °C`;
        document.getElementById('pressure').textContent = `Current pressure: ${pressure} atm`;
        document.getElementById('wind').textContent = `Wind speed: ${wind} km/h`;
      })
      .catch(err => {
        return err
      })
  });
} else {
  console.log('no geolocation')
}