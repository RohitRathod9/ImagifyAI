import 'dotenv/config';
import express from 'express'
import cors from 'cors'
import userRouter from './routes/userRoutes.js';
import connectDB from './configs/mongodb.js';
import imageRouter from './routes/imageRoutes.js';

import path from "path";
import { fileURLToPath } from "url";

//Resolving dirname for ESmodule
const _filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(_filename);

console.log(__dirname);

// App Config
const PORT = process.env.PORT || 4000
const app = express();
await connectDB()

// Intialize Middlewares
app.use(express.json())
app.use(cors())

// API routes
app.use('/api/user',userRouter)
app.use('/api/image',imageRouter)

// Use the client app
app.use(express.static(path.join(__dirname,'/client/dist')))

//Render client for any path
app.get('*', (req,res)=>
res.sendFile(path.join(__dirname,'/client/dist/index.html')));

app.get('/', (req,res) => res.send("API Working"))

app.listen(PORT, () => console.log('Server running on port ' + PORT));
