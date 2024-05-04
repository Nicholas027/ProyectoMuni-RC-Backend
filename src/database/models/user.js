import mongoose, {Schema} from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        required: false,
        defaultValue: false
    }
})

//vamos a generar el modelo Usuario
const User = mongoose.model('user', userSchema)

export default User;