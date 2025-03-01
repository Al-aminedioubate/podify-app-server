import { model, Model, ObjectId, Schema } from "mongoose";
import { hash, compare } from "bcrypt";

//creation d'interface(typescript) pour le model de l'utilisateur.
interface passwordResetTokenDocument{
    owner: ObjectId;
    token: string;
    createdAt: Date;
}

interface Methods{
    compareToken(token: string): Promise<boolean>
}

const passwordResetTokenSchema = new Schema<passwordResetTokenDocument, {}, Methods>({
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

//Fonction permetant de casser le token de verification dans la base de donnees pour plus de sureté
passwordResetTokenSchema.pre('save', async function(next){
    if(this.isModified('token')){
        this.token = await hash(this.token, 10);
    }
    next();
});

passwordResetTokenSchema.methods.compareToken = async function (token) {
    const result = await compare(token, this.token);
    return result;
};

export default model("passwordResetTokenSchema", passwordResetTokenSchema) as Model<passwordResetTokenDocument, {}, Methods>

