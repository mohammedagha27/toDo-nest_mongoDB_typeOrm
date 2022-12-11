import * as dotenv from 'dotenv';
dotenv.config();

export default () => ({
  database: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME_DEV,
    useNewUrlParser: true,
    synchronize: true,
    entities: [process.env.ENTITIES_PATH],
  },
  environment: {
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV,
    secretKey: process.env.SECRET_KEY,
  },
});
