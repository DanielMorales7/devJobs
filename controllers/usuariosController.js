import UsuariosModel from "../models/UsuariosModel.js";
import multer from "multer";
import { fileURLToPath } from "url";
import shortid from "shortid";

const subirImagen = (req, res, next) =>{

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
            }
            res.redirect('/');
            return;
        } else {
            return next();
        }
    });
}

// Opciones de Multer
const filePath = fileURLToPath(new URL('../../devJobs/public/uploads/perfiles', import.meta.url));

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
        if(file.mimetype=== 'image/jpeg' || file.mimetype=== 'image/png' ){
            // el callaback se ejecuta como true o false: true cuando la imagen se acepta
            cb(null, true);
        }else{
            cb(null, false);
        }  
    }
}

const upload = multer(configuracionMulter).single('imagen');


const formCrearCuenta = (req, res) =>{

    res.render('crear-cuenta',{
        nombrePagina: 'Crea tu cuenta en devJobs',
        tagline:      'Comienza a publicar tus vacantes',
        mensajes:null
    })
}



const validarRegistro = async (req, res, next) =>{    

    let mensajes = '';

    let errores = false;

    //sanitizamos los campos

    const usuario = await UsuariosModel.findOne({email:req.body.email});
    
    req.sanitizeBody('nombre').escape();
    req.sanitizeBody('email').escape();
    req.sanitizeBody('password').escape();
    req.sanitizeBody('confirmar').escape();

    req.checkBody('nombre', 'El nombre es obligatorio').notEmpty();
    req.checkBody('email', 'El email debe ser válido').isEmail();
    req.checkBody('password','La contraseña no puede ir vacia').notEmpty();
    req.checkBody('confirmar','El password no puede ir vacio').notEmpty();
    req.checkBody('confirmar', 'La contraseña es diferente').equals(req.body.password);

    errores = req.validationErrors();

    if(errores || usuario){
        //Si hay errores uno

        //se itera el array de errores y el mensaje de error se asigna a flash error
        //req.flash('error', errores.map(error => error.msg));
        usuario ? mensajes = 'El usuario ya existe' :mensajes = 'Hubo un error, revisa los datos ingresados';

        res.render('crear-cuenta', {
            nombrePagina: 'Crea tu cuenta en devJobs',
            tagline:      'Comienza a publicar tus vacantes',
            mensajes
        });

        return;
    }

    // Si toda la validación es correcta
    next();

    return;
}

const crearCuenta = async (req, res, next) => {

    const usuario = new UsuariosModel(req.body);

    const nuevoUsuario = await usuario.save();

    if(!nuevoUsuario) return next();

    res.redirect('/iniciar-sesion');
}

const formIniciarSesion = (req, res) =>{

    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar Sesión'
    });

}

// Fornulario para editar perfil
const formEditarPerfil = (req, res) =>{

    let mensajes = false;
    
    console.log(req.user.imagen);
    
    res.render('editar-perfil',{
        nombrePagina:'Editar Perfil',
        usuario: req.user,
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        mensajes
    });

}

// Guardar los cambios de editar perfil

const editarPerfil = async(req, res)=>{

    const usuario = await UsuariosModel.findById(req.user._id);

    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;
    if(req.body.password) {
        usuario.password = req.body.password
    }

    if(req.file) {
        usuario.imagen = req.file.filename;
    }
    
    await usuario.save();
    
    //console.log(usuario);

    res.redirect('/administracion');

}

const verificarPerfil = (req, res, next) =>{

    let mensajes = '';

    let errores = false;

    //Sanitizar campos
    req.sanitizeBody('nombre').escape();
    req.sanitizeBody('email').escape();
    req.sanitizeBody('password').escape();

    // Validar campos

    req.checkBody('nombre','El nombre no puede ir vacio').notEmpty();
    req.checkBody('email','El email es obligatorio').notEmpty();

    errores = req.validationErrors();

    if(errores){

        //Recargar vista con errores;

        mensajes = 'Válida los campos ingresados';

        res.render('editar-perfil',{
            nombrePagina:'Editar Perfil',
            usuario: req.user,
            cerrarSesion: true,
            mensajes
        });

        return;
    }

    next();

}


export {
    formCrearCuenta, 
    crearCuenta, 
    validarRegistro, 
    formIniciarSesion,
    formEditarPerfil,
    editarPerfil,
    verificarPerfil,
    subirImagen
}
