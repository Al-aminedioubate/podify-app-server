//generation des token
export const generateToken = (length = 6) =>{

    //declaration de variable pour le token
    let otp = " ";       //cette valeur sera aleatoire       

    for(let i = 0; i < length; i++){
        let digit = Math.floor(Math.random() * 10);
        otp += digit;
    } 

    return otp;
}