/* eslint-disable no-console */
import mongoose from 'mongoose';

const connectDB = async (mongodbURI, dbName) => {
  if (!mongodbURI || !dbName) {
    throw new Error('MongoDb URI or DB name is not defined');
  }
  try {
    await mongoose.connect(mongodbURI, { dbName, useNewUrlParser: true }, (error) => {
      if (error) {
        console.log(error);
      }
    });
    console.log('🐣 mongodb database started');
    console.log('🙉 dbURL ', mongodbURI);
    console.log('🙉 dbName ', dbName);
    return await mongoose.connection;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export default connectDB;
