// const mongoose = require('mongoose');
import mongoose from 'mongoose'

export const connectDB = async () =>{
    try {        
        await mongoose.connect(process.env.DB)
        .then(() => console.log('mongoose connect success')
        )
    } catch (error) {
        
        console.log('mongoose connect faild', error);
        
    }
    
}

