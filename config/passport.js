const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/user')

module.exports = function(passport){
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'


    },
    async(accessToken, refreshToken, profile, done)=>{
       const newUser = {
        googleId : profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        image: profile.photos[0].value
       }
       // if user exists on database cool if not create one add the data 
       try {
        let user = await User.findOne({googleId: profile.id})
        if(user){
            done(null,user)
        }else{
            user = await User.create(newUser)
            done(null, user)
        }

       } catch (error) {
        console.error(error)
       }
    }))

    passport.serializeUser(function (user,done){
        done(null,user.id)
    } )

    passport.deserializeUser(function(id,done){
        User.findById(id, function  (err, user){
            done(err, user)
        })
    })
} 