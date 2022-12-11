import * as dotenv from 'dotenv';
dotenv.config();

export default () => ({
  database: {
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    database: 'todo5',
    useNewUrlParser: true,
    synchronize: true,
    entities: ['dist/**/*.entity{ .ts,.js}'],
  },
  environment: {
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV,
    secretKey: process.env.SECRET_KEY,
  },
});
