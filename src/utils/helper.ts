import { UserDocuments } from "#/models/user";

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


export const formatProfile = (user: UserDocuments) =>{
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      avatar: user.avatar?.url,
      followers: user.followers.length,
      followings: user.followings.length,
    };
}