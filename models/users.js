const mongoose = require("../database/db");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true, lowercase: true},
    password: {type: String, required: true, select: false}, //'Select: false', para a informação não ir para o array de usuários
    createAt: {type: Date, default: Date.now} //'default: Date.now', para que o dado seja a data atual
})

UserSchema.pre("save", async function(next){
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
})

const User = mongoose.model("User", UserSchema);

module.exports = User;