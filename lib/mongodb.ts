import { MongoClient, MongoClientOptions } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

const uri = process.env.MONGODB_URI
const options: MongoClientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  family: 4 // Use IPv4, skip trying IPv6
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

async function connectWithRetry(retries = 3): Promise<MongoClient> {
  let lastError
  for (let i = 0; i < retries; i++) {
    try {
      const client = new MongoClient(uri, options)
      await client.connect()
      // Test connection
      await client.db('blog-app').command({ ping: 1 })
      console.log('MongoDB connection established')
      return client
    } catch (error) {
      lastError = error
      console.error(`MongoDB connection attempt ${i + 1} failed:`, error)
      await new Promise(res => setTimeout(res, 1000))
    }
  }
  throw lastError
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = connectWithRetry()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  clientPromise = connectWithRetry()
}

// Test the connection
clientPromise
  .then(client => {
    console.log('Testing MongoDB connection...')
    return client.db('blog-app').command({ ping: 1 })
  })
  .then(() => {
    console.log('MongoDB connection test successful')
  })
  .catch(error => {
    console.error('MongoDB connection test failed:', error)
  })

export default clientPromise 