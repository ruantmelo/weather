import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { api } from './services/api';
import { isNight } from './services/date';
import styles from './styles/App.module.scss';


interface IWeather{
  name: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  }
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  }
  dt: number;
  sys:{
    sunset: number;
    sunrise: number;
  }
  weather: {
    id: number,
    main: string,
    description: string,
    icon: string
  }[]
}

enum Mode{
  DAY,
  NIGHT
}


function App() {

  const [coordinates, setCoordinates] = useState<GeolocationCoordinates>();
  const [timestamp, setTimestamp] = useState<number>();
  const [weather, setWeather] = useState<IWeather>();
  const [mode , setMode] = useState<Mode>(Mode.DAY);

  useEffect(() => {

    async function loadData(){
      navigator.geolocation.getCurrentPosition(position => {
        setCoordinates(position.coords);
        setTimestamp(position.timestamp);
      })
    }

    try{
      loadData();
    }catch{
      window.alert('Não foi possível obter as informações geográficas')
    }

   
  }, [])


  useEffect(() => {
    if(coordinates){
      console.log('coordinates', coordinates);
      async function loadWeather(coordinates: GeolocationCoordinates){
          const weatherResponse = await api.get(``, {
            params: {
              lat: coordinates.latitude,
              lon: coordinates.longitude
            }
          })

          if(weatherResponse.data && weatherResponse.status === 200){
            console.log('weatherResponse', weatherResponse.data);
            setWeather(weatherResponse.data);

            if(!isNight(weatherResponse.data.sys.sunset)){
              setMode(Mode.NIGHT);
            }
           
          }
      }

      loadWeather(coordinates);
    }
    
  }, [coordinates])

  return (
    <div className={styles.App + ` ${mode === Mode.NIGHT? styles['App-night']: ''}`}>
      <div className={styles.container}>
      <div className={styles.content}>
          {/* <header className={styles.header}>
              <p>{mode === Mode.DAY? 'Day' : 'Night'}</p>
              <div>
                options
              </div>
          </header> */}

          <div className={styles.info} >
              <div>
                <img src = {`http://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`}/>
              </div>

              <p className={styles.temperature}>{weather && Math.round(weather.main.temp)}ºC</p>
              
              <p className = {styles.description}>{weather?.weather[0].description}</p>

              <p className={styles.city}>{weather?.name}</p>
          </div>

          <div className={styles['more-info']}>
            <div>
              Velocidade do vento:
              <strong>{Math.round(weather?.wind.speed ?? 0)}<span>km</span></strong>
            </div>
            <div>
              Humidade:
              <strong>{weather?.main.humidity}<span>%</span></strong>
            </div>
            <div>
              Visibilidade:
              <strong>
                {weather 
                  ? 
                    weather.visibility < 1000
                      ?  
                        weather.visibility 
                      : 
                        weather.visibility/ 1000 
                  : '-'}
                <span>{weather && weather.visibility > 1000? 'km' : 'm'}</span>
                <span>
                  {}
                </span>
              </strong>
            </div>
          </div>

         
          
        </div>
        <div className={styles.background + ` ${mode === Mode.NIGHT? styles['background-night'] : ''}`}></div>
      </div>
      
    </div>
  )
}

export default App
