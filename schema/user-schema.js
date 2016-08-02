'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true},
    firstname: {type: String, required: false},
    lastname: {type: String, required: false},
    imgpath: {type: String, required: false},
    motto: {type: String, required: false},
    approved: {type: Boolean, default: false},
    addedOn: {type: Date, default: Date.now}
});

//password encryption
// UserSchema.pre('save', (next) => {
//     if(!this.isModified('password')) return next();

//     bcrypt.hash(this.password, saltRounds, (err, hash) => {
//         if(err) return next(err);

//         this.password = hash;
//         next();
//     });
// });

module.exports = mongoose.model('User', UserSchema);