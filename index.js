// const express = require('express');
import express from 'express';
import router from './routes/index.js';
import {engine} from 'express-handlebars';
import dotenv from  'dotenv';
import conectarDB from './config/bd.js';
import seleccionarSkill from './helpers/handlebars.js';
import bodyParser from 'body-parser';
import handlebars from 'handlebars';
import {allowInsecurePrototypeAccess} from '@handlebars/allow-prototype-access';
import expressValidator from 'express-validator';
import flash from 'connect-flash';
import session from 'express-session';
import passport from './config/passport.js';

const app = express();
//habilitamos bosy-parser
app.use(bodyParser.urlencoded({extended:true}));
// validacion de campos
app.use(expressValidator());
// conectar DB
conectarDB();

dotenv.config(); 

// Habilitamos handlebars como view
app.engine('handlebars', 
    engine({
        handlebars: allowInsecurePrototypeAccess(handlebars),
        defaultLayout: 'layout',
        helpers: seleccionarSkill
    })
);

app.set('view engine', 'handlebars')
// static files
app.use(express.static('public'));

const port = process.env.PORT || 5000;

console.log(process.env.PORT);

app.use(session({
    secret:process.env.JWT_SECRET,
    resave:false,
    saveUninitialized:false
}));

// Iniciar sesion
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Crear nuestro middleware
app.use((req, res, next) => {
    res.locals.mensajes = req.flash();
    next();
})

app.use('/', router);

app.listen(port, () => {

    console.log(`El servidor está funcionando en el puerto ${port}`)

});