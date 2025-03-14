import { compare, hash } from "bcrypt";
import { model, Model, ObjectId, Schema } from "mongoose";

//creation d'interface(typescript) pour le model de l'utilisateur.
export interface UserDocuments{
    _id: ObjectId;
    name: string;
    email: string;
    password: string;
    verified: boolean;
    avatar?: {url: string; publicId: string}
    tokens: string[];
    favorites: ObjectId[];
    followers: ObjectId[];
    followings: ObjectId[];
}

interface Methods {
   comparePassword(password: string): Promise<boolean> 
}

const userSchema = new Schema<UserDocuments, {}, Methods >({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    avatar:{
        type: Object,
        url: String,
        publicId: String,
    },
    verified:{
        type: Boolean,
       default: false,
    },
    favorites:[{
        type: Schema.Types.ObjectId,
        ref: "Audio"
    }],
    followers:[{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    followings:[{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    tokens: [String],
}, {timestamps: true});

//Fonction permetant de casser le mot de passe dans la base de donnees pour plus de sureté
userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await hash(this.password, 10);
    }
    next();
});

userSchema.methods.comparePassword = async function (password) {
    const result = await compare(password, this.password);
    return result;
}

export default model("User", userSchema) as Model<UserDocuments>

