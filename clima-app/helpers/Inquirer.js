import inquirer from 'inquirer'
import colores from 'colors';

const {green, red, blue, white} = colores

const questionMenu = [
    {
        type: "list",
        name: "opciones",
        message: "¿Que deseas hacer?",
        choices:[
            {
                value: 1,
                name: `${'1'.green}. Buscar Ciudad`
            },
            {
                value: 2,
                name:`${'2'.green}. Historial`
            },
            {
                value: 0,
                name: `${'0'.green}. Salir`
            }            
        ] 
    }
]

const inquirerMenu = async () => {
    console.clear();

    console.log('============================='.green);
    console.log('   Seleccione una opción'.white);
    console.log('=============================\n'.green);

    const {opciones} = await inquirer.prompt(questionMenu);

    return opciones;

};

const pause = async () =>{

    const pauseQuestion = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${'enter'.green} para continuar`
        }
    ]

    console.log('\n')
    await inquirer.prompt(pauseQuestion)
}

const readInput = async ( message ) => {

    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ){
                if(value.length === 0){
                    return ' Por favor ingrese un valor'
                }
                return true
            }
        }
    ]

    const { desc } = await inquirer.prompt(question)
    return desc;
}

const listedPlaces = async (places = []) => {
    const choices = places.map( (task, i) => {
        const index = `${i + 1}`.green

        return {
            value: task.id,
            name: `${index} ${task.nombre}`
        }
    })
    choices.unshift({
        value: '0',
        name: '0.'.green + 'Cancelar'
    })

    const questions = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar',
            choices
        }
    ]
    
    const { id } = await inquirer.prompt(questions);
    return id;

}



export {
    inquirerMenu,
    pause,
    readInput,
    listedPlaces,
    
}