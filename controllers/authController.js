import passport from "passport"
import VacantesModel from "../models/VacantesModel.js";
import mongoose from "mongoose";
import UsuariosModel from "../models/UsuariosModel.js";
import crypto from 'crypto';
import emailRegistro from "../config/email.js"


const autenticarUsuario =  passport.authenticate('local',{

        successRedirect:'/administracion',
        failureRedirect:'/iniciar-sesion',
        failureFlash:true
});

// Revisar si el usuario está verificado

const verificarUsuario = (req, res, next) =>{

    //revisar el usuario
    if(req.isAuthenticated()){

        return next();

    }

    res.redirect('/iniciar-sesion');
    return;

}

const mostrarPanel = async (req, res) =>{

    //consultar el usuario autenticado

    const vacantes = await VacantesModel.find({autor:req.user._id});

    console.log(vacantes)

    res.render('administracion',{
        nombrePagina:'Panel de Administracion',
        tagline:'Crea y administra tus vacantes',
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        vacantes
    });

}

// Cerrar sesión del usurio

const cerrarSesion = (req, res) => {

    req.logout(function(err){
        if(err) {
            return next(err);
        }
        return res.redirect('/iniciar-sesion')
    });

}

//Mostrar los candidatos por vacantes

const mostrarCandidatos = async(req, res, next) =>{

    const {id} = req.params;

    const vacante = await VacantesModel.findById(id);

    // Cuando validas un object id con un req.user aunque sean los mismos no deja pasar
    // tienes que usar "==" y un toString para dejarlos pasar
    if(!vacante) return next();

    if(vacante.autor != req.user.id.toString()){
        return next();
    }

    res.render('candidatos', {
        nombrePagina: `Candidatos Vacante - ${vacante.titulo}`,
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        candidatos: vacante.candidatos
    });
}

// Formulario para formatear password
const formReestablecerPassword = async(req, res, next)=>{
    res.render('reestablecer-password', {
        nombrePagina:'Reestablece tu Contraseña',
        tagline: 'Si ya tienes una cuenta pero olvidaste tu password, coloca tu email'
    })
}

// Gnerar token al usuario y almacenarlo

const enviarToken = async (req, res)=>{

    const usuario = await UsuariosModel.findOne({email: req.body.email})

    if(!usuario){
        return res.redirect('/iniciar-sesion');
    }

    //El usuario existe generar token
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expira = Date.now() + 3600000;

    //Guardamos el usuario
    await usuario.save();
    const resetUrl = `http://${req.headers.host}/reestablecer-password/${usuario.token}`;

    await emailRegistro({
        email: usuario.email,
        resetUrl
    });    

    console.log(resetUrl);

    res.redirect('/');

}

const formConfirmarPassword = async (req, res) =>{

    const {token} = req.params;

    const usuario = await UsuariosModel.findOne({
        token,
        expira:{
            $gt: Date.now()
        }
    });

    if(!usuario){
        return res.redirect('/');
    }

    // Todo está bien
    res.render('confirmar-password', {
        nombrePagina: `Confirma el cambio de conraseña`,
    });

}

// Almacenar el nuevo Password en la BD

const guardarPassword = async (req, res) =>{
    
    const {token} = req.params;

    const usuario = await UsuariosModel.findOne({
        token,
        expira:{
            $gt: Date.now()
        }
    });

    if(!usuario){
        return res.redirect('/');
    }

    // guardamos en la BD

    usuario.password = req.body.password;
    usuario.token = undefined;
    usuario.expira = undefined;

    await usuario.save();

    return res.redirect('/iniciar-sesion');

}


export { 
    autenticarUsuario, 
    mostrarPanel,
    verificarUsuario,
    cerrarSesion, 
    mostrarCandidatos,
    formReestablecerPassword,
    enviarToken,
    formConfirmarPassword,
    guardarPassword
}