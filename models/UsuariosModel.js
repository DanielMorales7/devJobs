import mongoose from "mongoose";
mongoose.Promise = global.Promise;
import bcrypt from "bcrypt";

const usuariosSchema = new mongoose.Schema({

    email:{
        type: String,
        unique: true,
        lowercase: true,
        trim:true
    },
    nombre:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    token:String,
    expira:Date,
    imagen:String

});

//Método para hashear los passwords

usuariosSchema.pre('save', async function(next){

    //si el password ya está hasheado
    if(!this.isModified('password')){
        return next(); //detiene la ejecución y continúa con el siguiente middelware
    }
    
    // si no está hasehado

    const hash = await bcrypt.hash(this.password, 12);
    this.password = hash;
    next();

});

//autenticar usuarios

usuariosSchema.methods={
    compararPassword: function(password){
        return bcrypt.compareSync(password, this.password);
    }
}

const UsuariosModel = mongoose.model("UsuariosModel",usuariosSchema);
export default UsuariosModel;
