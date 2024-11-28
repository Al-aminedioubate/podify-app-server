import { model, Model, ObjectId, Schema } from "mongoose";

//creation d'interface(typescript) pour le model de l'utilisateur.
interface UserDocuments{
    name: string;
    email: string;
    password: string;
    verified: boolean;
    avatar?: {url: string; publicId: string}
    tokens: string[];
    favarites: ObjectId[];
    followers: ObjectId[];
    followings: ObjectId[];
}

const userSchema = new Schema<UserDocuments>({
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
    favarites:[{
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

export default model("User", userSchema) as Model<UserDocuments>

