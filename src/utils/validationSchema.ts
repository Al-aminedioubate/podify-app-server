import * as yup from "yup";
import { isValidObjectId } from "mongoose";
import { categories } from "./autio_category";

export const CreateUserSchema = yup.object().shape({
    name: yup.string().trim().required("Name is missing!").min(3, "Name is too short!").max(20, "Name is too long!"),
    email: yup.string().required("Email is missing ").email("Invalid email id!"),
    password: yup.string().trim().required("Password is missing!").min(8, "Password is too short!")
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/, "Password is too simple!"),
});

//schema de validation de token and ID user
export const TokenAndIDValidation = yup.object().shape({
    token: yup.string().trim().required("Invalide token!"),
    userId: yup.string().trim().transform(function(value){
        if(this.isType(value) && isValidObjectId(value)){
            return value
        }else{
            return ""
        }
    }).required("Invalid userId!"),
})

//schema de validation de password
export const UpdatePasswordSchema = yup.object().shape({
    token: yup.string().trim().required("Invalide token!"),
    userId: yup.string().trim().transform(function(value){
        if(this.isType(value) && isValidObjectId(value)){
            return value
        }else{
            return ""
        }
    }).required("Invalid userId!"),
    password: yup.string().trim().required("Password is missing!").min(8, "Password is too short!")
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/, "Password is too simple!"),
});

//Email validation schema for the sign-in party
export const SignInValidationSchema = yup.object().shape({
    email: yup.string().required("Email is missing ").email("Invalid email id!"),
    password: yup.string().trim().required("Password is missing!"),
})

//Audio validation schema
export const AudioValidationSchema = yup.object().shape({
    title: yup.string().required("Title is missing "),
    about: yup.string().required("About is missing "),
    category: yup.string().oneOf(categories, "Invalide category!").required("Category is missing!"),
})