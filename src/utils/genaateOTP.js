
const genaateOTP = () => {
     return Math.floor(Math.random() * 900000) + 100000   // 100000 to 999999  -> 6 digit OTP 
};

export default genaateOTP;