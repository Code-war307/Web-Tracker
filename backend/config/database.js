import mongoose from "mongoose"

const connectMongoDB = async () => {
  const mongoUri = process.env.MONGO_URI

  if (!mongoUri) {
    throw new Error('❌ MONGO_URI is not defined in environment variables')
  }

  try {
    mongoose.set('strictQuery', true)

    await mongoose.connect(mongoUri, {
      autoIndex: false,          // ❗ disable in production
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10
    })

    console.log('✅ MongoDB connected successfully')
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

export default connectMongoDB