const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp');
let UserSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    password: { type: String },
    business_address: String,
    zip_code: Number,
    city: String,
    state: String,
    country: String,
    phone: String,
    resetPasswordToken: String,
    resetPasswordExpires: String,
    deleted: { type: String, default: '0' }
})


UserSchema.plugin(timestamps);
/* UserSchema.index({ 'first_name': 'text', 'last_name': 'text', 'email': 'text' }) */
module.exports = mongoose.model('User', UserSchema)