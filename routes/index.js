import express from 'express';
const router = express.Router();
import { paginaIndex } from '../controllers/paginasControllers.js';
import { nuevaVacante, agregarVacante, mostrarVacante, editarVacante,guardarVacante, validarVacante, estadoVacante, subirCV, contactarReclutador } from '../controllers/nuevaVacante.js';
import { formCrearCuenta, crearCuenta,validarRegistro, formIniciarSesion, formEditarPerfil, editarPerfil, verificarPerfil, subirImagen } from '../controllers/usuariosController.js';
import { autenticarUsuario, mostrarPanel, verificarUsuario, cerrarSesion, mostrarCandidatos, formReestablecerPassword, enviarToken, formConfirmarPassword, guardarPassword } from '../controllers/authController.js';


router.get('/', paginaIndex); 

// Vacantes 
router.route('/vacantes/nueva')
    .get(verificarUsuario, nuevaVacante )
    .post(verificarUsuario, validarVacante , agregarVacante);

router.route('/vacantes/:url')
    .get(mostrarVacante);

router.route('/vacantes/editar/:url')
    .get(verificarUsuario, editarVacante)
    .post(verificarUsuario, validarVacante ,guardarVacante);

// Creación de las cuentas
router.route('/vacantes/estado/:id/:estado')
    .get(verificarUsuario, estadoVacante);

router.route('/crear-cuenta')
    .get(formCrearCuenta)
    .post(validarRegistro, crearCuenta);

// Autenticar usuarios

router.route('/iniciar-sesion')
    .get(formIniciarSesion)
    .post(autenticarUsuario);

// Cerrar sesión de usuario

router.route('/cerrar-sesion')
    .get(verificarUsuario, cerrarSesion)

// Resetear Password
router.route('/reestablecer-password')
    .get(formReestablecerPassword)
    .post(enviarToken)

//formulario para reestablecer password

router.route('/reestablecer-password/:token')
    .get(formConfirmarPassword)
    .post(guardarPassword)


// Panel de administracion

router.route('/administracion')
    .get(verificarUsuario, mostrarPanel);

//Editar Perfil

router.route('/editar-perfil')
    .get(verificarUsuario, formEditarPerfil)
    .post(verificarUsuario, subirImagen, editarPerfil)

// Recibir mensajes de los candidatos
router.route('/vacantes/:url')
    .post(subirCV, contactarReclutador)

//Muestra los candidatos por vacante
router.route('/candidatos/:id')
    .get(verificarUsuario, mostrarCandidatos)

export default router;
