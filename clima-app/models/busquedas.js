import fs from 'fs';
import axios from "axios";


class Busquedas {
    historial = []
    dbPath = './db/database.json';

    constructor(){
        this.readDB();
    }

    get capRecord(){
        return this.historial.map( place => {
            let word = place.split(' ');
            word = word.map( p => p[0].toUpperCase() + p.substring(1))

            return word.join(' ')
        })
    }

    get paramsMapBox(){
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit':  '5',
            'language': 'es'
        }
    }

    get paramsOpenWeather(){
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }

    async city(place = ''){

        try {
            //peticion http
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ place }.json`,
                params: this.paramsMapBox
            })

            const resp = await instance.get();
            return resp.data.features.map(place => ({
                id: place.id,
                nombre: place.place_name,
                lng: place.center[0],
                lat: place.center[1]
            }))
            
        } catch (error) {
            return []
        }        
    }

    async cityWeather( lat, lon){

        try {
            // instance de axios
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsOpenWeather, lat, lon}
            }) 
            //resp.data
            const resp = await instance.get();
            // console.log(resp.data)
            const {weather, main: {temp, temp_max, temp_min} } = resp.data;
            return {
                desc: weather[0].description,
                min: temp_min,
                max: temp_max,
                temp: temp
            }
        } catch (error) {
            console.log(error)
        }
    }

    addRecord(place = ''){
        if(this.historial.includes(place.toLocaleLowerCase())){
            return
        }
        this.historial = this.historial.splice(0,5);

        this.historial.unshift(place.toLocaleLowerCase());

        //grabar eb DB
        this.saveDB();
    }

    saveDB(){
        const payload = {
            historial: this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    readDB(){
        if(!fs.existsSync(this.dbPath)){
            return;
        }

        const info = fs.readFileSync(this.dbPath, {encoding:'utf-8'})

        const data = JSON.parse( info );

        this.historial = data.historial
    }
}

export default Busquedas;