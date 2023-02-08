import passport from "passport";
import LocalStrategy  from 'passport-local';
import mongoose from "mongoose";
import UsuariosModel from "../models/UsuariosModel.js";
//const LocalStrategy = import('passport-local').Stratefy;


passport.use(new LocalStrategy.Strategy({
    usernameField:'email',
    passwordField:'password'
}, async (email, password, done)=>{

    const usuario = await UsuariosModel.findOne({email});
    if(!usuario) return done(null, false, {
        message:'Usuario No Existente'
    });

    //si el usuario existe
    const verificarPass = usuario.compararPassword(password);
    if(!verificarPass) return done(null, false, {
        message:'Password Incorrecto'
    });

    //Usuario existe y es correcto
    return done(null, usuario);

}));


passport.serializeUser((usuario,done) => done(null,usuario._id));

passport.deserializeUser(async (id, done) => {
    const usuario = await UsuariosModel.findById(id).exec();
    return done(null, usuario);
})

export default passport