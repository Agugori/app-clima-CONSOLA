import dotenv from 'dotenv';
import { readInput, 
         inquirerMenu,
         pause,
         listedPlaces
} from './helpers/Inquirer.js';
import colores from 'colors';
import Busquedas from './models/busquedas.js';

dotenv.config();
const {green, red, blue, white} = colores;


const main = async () => {
    const searchs = new Busquedas()
    let opt;

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                //mostrar mensaje
                const term = await readInput('Ciudad: ');
                //buscar los lugares
                const places = await searchs.city( term );
                
                //seleccionar el lugar
                const idSelect = await listedPlaces( places );
                if(idSelect === '0') continue;

                const selPlace = places.find(p => p.id === idSelect)
                searchs.addRecord(selPlace.nombre)
                const {nombre, lng, lat} = selPlace;
                // console.log({selPlace});
                
                //datos del clima
                const weather = await searchs.cityWeather( lng, lat, nombre )
                // console.log(weather)

                const {min, max, temp, desc} = weather
                
                //mostrar resultado
                console.clear()
                console.log('\nInformación de la ciudad\n'.green)
                console.log('Ciudad:', nombre )
                console.log('Lat:', lat)
                console.log('Lng:', lng)
                console.log('Temperatura:', temp)
                console.log('Min:', min)
                console.log('Max:', max)
                console.log('Como esta el clima:', desc.green)
                break;

            case 2:
                searchs.capRecord.forEach((place, i) => {
                    const index = `${i + 1}.`.green
                    console.log(`${index} ${place}`)
                })
                break;
        }

       if(opt !== 0 ){
            await pause();
       } 
    } while ( opt !== 0);
};

main();