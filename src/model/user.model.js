import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true , "Provide Name"]
    },
    email: {
        type: String,
        require: [true , "Provide Email"]
    },
    password: {
        type: String,
        require: [true , "Provide Password"]
    },
    avatar: {
        type: String,
        default: ''
    },
    number: {
        type: Number,
        default: null
    },
    refresh_token: {
        type: String,
        default: ''
    },
    verify_email: {
        type: Boolean,
        default: false
    },
    last_login_date: {
        type:  Date,
        default: ''
    },
    status: {
        type: String,
        euum: ["Active" ,"Inactive" , "Suspended"],
        default: 'Active'
    },
    address_details: [
        {
            type: mongoose.Schema.ObjectId,
            ref:'Address'
        },
    ],
    shopping_cart: [
        {
            type: mongoose.Schema.ObjectId,
            ref:'CartProduct'
        },
    ],
    orderHistory: [
        {
            type: mongoose.Schema.ObjectId,
            ref:'Order'
        },
    ],
    forgot_password_otp: {
        type: String,
        default: null
    },
    forgot_password_expiry: {
        type: Date,
        default: null
    },
    
    role:{
        type: String,
        eunm: ["Admin", " USER"],
        default: "USER"
    },

},{timestamps: true});

const UserModel = mongoose.model('User', userSchema);
export default UserModel;

/* 
name string
  email string
  password string
  avatar string
  mobile number
  refresh_token string
  verify_email boolean
  last_login_date date
  status accountStatus
  address_details array [ref: > address._id]
  shopping_cart array [ref: > cartProduct._id]
  orderHistory array [ref: > order._id ]
  forgot_password_otp string
  forgot_password_expiry Date
  role Role

*/
