import { model, Model, ObjectId, Schema } from "mongoose";

//creation d'interface(typescript) pour le model de l'utilisateur.
interface emailVerificationTokenDocument{
    owner: ObjectId;
    token: string;
    createdAt: Date;
}

const emailVerificationTokenSchema = new Schema<emailVerificationTokenDocument>({
    owner:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    token: {
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        expires: 3600,
        default: Date.now()
    }
    
});

export default model("emailVerificationTokenSchema", emailVerificationTokenSchema) as Model<emailVerificationTokenDocument>

