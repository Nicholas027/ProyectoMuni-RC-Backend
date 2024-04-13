import mongoose, {Schema} from "mongoose";
import bcrypt from 'bcrypt';

const professionalSchema = new Schema({
    nombreCompleto: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 100,
    },
    foto: {
        type: String,
        required: false,
        validate: {
            validator: function(valor){
                return /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/i.test(valor)
            },
            message: props => `${props.value} no es una url de imagen valida.`
        },
    },
    password: {
        type: String,
        required: true,
    },
    cv: {
        type: String,
        required: false,
    },
    categoria:{
        type: String,
        required: true,
        enum:['Carpintero','Gasista','Cerrajero','Mecanico', 'Electricista', 'Albañil', 'Plomero', 'Pintor', 'Herrero', 'Jardinero', 'Otros']
    },
    descripcion: {
        type: String,
        required: false,
        minLength: 20,
        maxLength: 1000,
    },
    calificacion: {
        type: Number,
        required: false,
        enum: [1, 2, 3, 4, 5],
        defaultValue: 0
    },
    telefono: {
        type: Number,
        required: true,
        min: 10, 
        max: 20,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(valor){
                return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(valor);
            },
            message: props => `${props.value} no es un correo electronico válido`
        },
    }
})

professionalSchema.pre('save', function(next) {
    const professional = this;

    if (!professional.isModified('password')) return next();

    bcrypt.genSalt(parseInt(process.env.HASH_SALTS), function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(professional.password, salt, function(err, hash) {
            if (err) return next(err);

            professional.password = hash;
            next();
        });
    });
});

const Professional = mongoose.model('professional', professionalSchema);

export default Professional;