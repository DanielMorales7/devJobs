import mongoose from "mongoose";
import slug from "slug";
import shortid from "shortid";

const vacantesSchema = mongoose.Schema({
    titulo:{
        type: String,
        required: 'El nombre de la vacante es obligatorio',
        trim: true
    },
    empresa:{
        type: String,
        trim: true
    },
    ubicacion:{
        type: String,
        default:0
    },
    salario:{
        type: String,
        default:0,
        trim:true
    },
    contrato:{
        type: String,
        trim: true
    },
    descripcion: {
        type:String,
        trim: true
    },
    url:{
        type: String,
        lowercase: true
    },
    skills: [String],
    estado: {
        type:String,
        default:'Publicada'
    },
    candidatos:[{
        nombre: String,
        email: String,
        cv: String
    }],
    autor:{
        type:mongoose.Schema.ObjectId,
        ref:'UsuariosModel',
        required: 'El autor es obligatorio'
    }
})

vacantesSchema.pre('save', function(next){

    const url = slug(this.titulo);
    this.url = `${url}-${shortid.generate()}`

    next();
})

const VacantesModel = mongoose.model("VacantesModel",vacantesSchema);
export default VacantesModel;

