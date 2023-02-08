import VacantesModel from '../models/VacantesModel.js';
import multer from "multer";
import shortid from "shortid";
import { fileURLToPath } from "url";

const nuevaVacante = (req, res) =>{

    let mensajes = '';
    // esto es lo que contiene el usuario console.log(req.user);

    res.render('nueva-vacante',{
        nombrePagina: 'Nueva Vacante',
        tagline:      'Llena el formulario',
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        mensajes
    })
}

const agregarVacante = async (req, res) =>{

    //tomamos el body. para esto ya se tuvo que hacer el bodyparser
    const vacante = new VacantesModel(req.body);

    //se asigna el autor de la vacante

    vacante.autor = req.user._id;

    //almacenamos en la BD
    try {

        const nuevaVacante = await vacante.save();

        res.redirect(`/vacantes/${nuevaVacante.url}`)
        
    } catch (error) {

        console.log(error);

    }
    
}

//mostrar una vacante
const mostrarVacante = async (req, res, next) =>{

    const {url} = req.params;

    try {

        const vacante = await VacantesModel.findOne({url}).populate('autor');

        console.log(vacante)
        if(!vacante) return next();

        res.render('mostrar-vacante',{
            nombrePagina: vacante.titulo,
            barra:true,
            vacante
        })
        
    } catch (error) {
        
        console.log(error);
        
    }

}

const editarVacante = async (req, res) =>{

    let mensajes = '';

    let errores = false;
    
    const {url} = req.params;

    try {

        const vacante = await VacantesModel.findOne({url});
        
        let TC, F, MT, PP;
        
        switch (vacante.contrato){
            case 'Tiempo Completo':
                TC = true;
                break;
            case 'Freelance':
                F = true;
                break;
            case 'Medio Tiempo':
                MT = true
                break;
            default:
                PP = true
        }

        res.render('nueva-vacante',{
            vacante,
            nombrePagina: 'Editar Vacante',
            editar: true,
            TC,
            F,
            MT,
            PP,
            cerrarSesion: true,
            nombre: req.user.nombre,
            mensajes,
            imagen: req.user.imagen,
        })
        
    } catch (error) {
        console.log(error)
    }
}

const guardarVacante = async(req, res) => {

    const {url} = req.params;

    const vacanteActualizada = req.body;

    try {


        const vacante = await VacantesModel.findOneAndUpdate({url}, 
            vacanteActualizada, {
                new: true,
                runValidators: true
            });
        
        res.redirect(`/vacantes/${vacante.url}`)
        
    } catch (error) {
        
        console.log(error)
    }



}

// Validar y Sanitizar los valores de las nuevas vacantes

const validarVacante = (req, res, next) =>{

    let mensajes = '';

    let errores = false;

    //Sanitizar los campos
    req.sanitizeBody('titulo').escape();
    req.sanitizeBody('empresa').escape();
    req.sanitizeBody('ubicacion').escape();
    req.sanitizeBody('salario').escape();
    req.sanitizeBody('contrato').escape();

    //validar
    req.checkBody('titulo','Agrega un Título a la Vacante').notEmpty();
    req.checkBody('empresa','Agrega una empresa').notEmpty();
    req.checkBody('ubicacion','Agrega una Ubicación').notEmpty();
    req.checkBody('contrato','Agrega el tipo de contrato').notEmpty();

    errores = req.validationErrors();

    if(errores){

        //Recargar vista con errores;

        mensajes = 'Válida los campos ingresados';

        res.render('nueva-vacante',{
            nombrePagina: 'Nueva Vacante',
            tagline:      'Llena el formulario',
            cerrarSesion: true,
            nombre: req.user.nombre,
            mensajes
        });

        return;
    }

    next();
}

// Cambiar el estatus de la vacante a publicada o despublicada

const estadoVacante = async (req, res) =>{

    const {id} = req.params;

    const {estado} = req.params;

    const autor = req.user._id;
    
    const vacante = await VacantesModel.findByIdAndUpdate({_id:id},{
        
        $set:{
            estado: estado=='Publicada' ? 'Despublicada' : 'Publicada'
        }
    })

    res.redirect(`/administracion`);

}

//Controlador para subir CV
const subirCV = (req, res, next) =>{

    upload(req, res, function(error){
        if(error) {
            if(error instanceof multer.MulterError) {
                if(error.code === 'LIMIT_FILE_SIZE') {
                    res.redirect('/');
                } else {
                    res.redirect('/');
                }
            } else {
                res.redirect('/');
            }//si hay un problema, back regresa a la página donde se origina el error
            res.redirect('back');
            return;
        } else {
            return next();
        }
    });
}

// Opciones de Multer
const filePath = fileURLToPath(new URL('../../devJobs/public/uploads/cv', import.meta.url));

const fileStorage = multer.diskStorage({
    destination : (req, file, cb) => {
        console.log(filePath)
        cb(null, filePath);
    },
    filename: (req, file, cb)=>{
        const extension = file.mimetype.split('/')[1];
        // const extension = file.fieldname + '-' + Date.now()+ filePath;
        cb(null,`${shortid.generate()}.${extension}` );
    }

});

const configuracionMulter = {
    storage: fileStorage,
    limits: { fileSize: 2 * 1024 * 1024},
    fileFilter(req, file,cb){
        if(file.mimetype=== 'application/pdf' ){
            // el callaback se ejecuta como true o false: true cuando la imagen se acepta
            cb(null, true);
        }else{
            cb(null, false);
        }  
    }
}

const upload = multer(configuracionMulter).single('cv');

//Contactar al reclutador
const contactarReclutador = async(req, res, next) =>{
    //Almacenamos los candidatos en la BD

    const url = req.params.url;

    const vacante = await VacantesModel.findOne({url});

    if(!vacante) return next();

    const nuevoCandidato = {
        nombre: req.body.nombre,
        email: req.body.email,
        cv : req.file.filename
    }

    //almanecanos la vacante
    try {

        vacante.candidatos.push(nuevoCandidato);
        await vacante.save();

        res.redirect('/');
        
    } catch (error) {
        console.log(erroe)
    }
    
}



export {
    nuevaVacante, 
    agregarVacante, 
    mostrarVacante, 
    editarVacante, 
    guardarVacante, 
    validarVacante,
    estadoVacante,
    subirCV,
    contactarReclutador
}