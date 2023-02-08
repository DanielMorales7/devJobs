import VacantesModel from '../models/VacantesModel.js'

const paginaIndex = async (req, res, next) =>{

    // Utilizaremos find para encontrar a todas las vacantes
    try {
        const vacantes = await VacantesModel.find({estado:"Publicada"});

        if(!vacantes) return next();

        res.render('home', {
            nombrePagina:'devJobs',
            tagline:     'Encuentra y publica trabajos para desarrolladores web',
            barra: true,
            boton: true,
            vacantes
        })


    } catch (error) {
        console.log(error)
    }

    // Utilizaremos un promise porque tener dos await, bloquea el seguno hasta que se ejecute el primero
}



export { paginaIndex }