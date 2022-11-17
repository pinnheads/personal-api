import mongoose from 'mongoose';

const connection = async (mongoUri: string, dbName: string) => {
  if (!mongoUri || !dbName) {
    throw new Error('Mongo DB URI or DB Name is not defined');
  }
  try {
    mongoose.connect(mongoUri, { dbName }, (error) => {
      if (error) {
        throw new Error('Error occurred in connecting with the database!!');
      }
    });
    return mongoose.connection;
  } catch (error) {
    throw new Error('error in connection');
  }
};

export default connection;
