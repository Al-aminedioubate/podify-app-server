//Le fichier pour tout les variables du projets.
const {env} = process as {env: {[key: string]: string}};
export const MONGO_URI = env.MONGO_URI as string;
//export const MONGO_URI = process.env.MONGO_URI as string;