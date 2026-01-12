// Basic Library
import express from "express";
import router from './src/routes/api.js';
const app = express();
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Security Middleware Library
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import sanitizeHtml from "sanitize-html";
import hpp from 'hpp';
import cors from 'cors';

// Database Library
import mongoose from 'mongoose';

// Security middleware Implement
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "*"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}))
app.use((req, res, next) => {
    const sanitizeObject = (obj) => {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = sanitizeHtml(obj[key], { allowedTags: [], allowedAttributes: {} });
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitizeObject(obj[key]);
            }
        }
    }
    if (req.body) sanitizeObject(req.body);
    if (req.query) sanitizeObject(req.query);
    if (req.params) sanitizeObject(req.params);
    next()
})
app.use(hpp(undefined))

// Body Parser Implement
app.use(bodyParser.json())

// Set trust proxy
app.set("trust proxy", 1);
// Request Rate limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
})
app.use(limiter)

// Mongodb Database Connection
const URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.CLUSTER_NAME}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=PersonalProject`;

let OPTIONS = {
    autoIndex: true
}

mongoose.connect(URL, OPTIONS)
    .then(() => console.log("Database Connected Successfully"))
    .catch((error) => console.log("Database Connection Failed:", error));

// Routing Implement
app.use('/api/v1', router)

app.use(express.static(path.join(__dirname, "client/dist")));

// Add React front End Routing
app.use(express.static(path.join(__dirname, "client/dist")));

/* ⚠️ EXPRESS 5 SAFE FALLBACK */
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});


// Undefined Route
/*
const errorPages = [
    '404_1.html',
    '404_2.html',
    '404_3.html',
    "404_4.html"
]
app.use('*', (req, res) => {
    // Pick a random file name
    const randomPage = errorPages[Math.floor(Math.random() * errorPages.length)];

    res.status(404).sendFile(path.join(__dirname, 'public', randomPage));
})
 */
export default app;

