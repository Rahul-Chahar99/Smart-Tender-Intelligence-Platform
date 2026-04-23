import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();



app.use(
  cors({
    origin: process.env.CORS_ORIGIN || (process.env.NODE_ENV === "production" ? "https://smart-tender-intelligence-platform.vercel.app" : "http://localhost:5173"),
    credentials: true,
  })
);
app.use(express.json({limit:"160kb"})) // Increased limit for large transcripts
app.use(express.urlencoded({extended:true,limit:"160kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Engineer-On-Click API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});




import companyRouter from "./routes/company.routes.js";

//routes declaration
app.use("/api/v1/company", companyRouter);



// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Global Error:", err); 
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errors = err.errors || [];

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});


export { app };
