const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');
const userRoutes = require('./routes/userRoutes'); 
const eventRoutes = require('./routes/eventRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const ErrorHandler = require('./middleware/ErrorHandler');
require('dotenv').config();
require('./serverRoutines');
const logger = require('./middleware/logger');      

const app = express();

// Middleware
const allowedDomains = ["http://localhost:5173"];

const corsOptions = {
  origin: function (origin, callback) {
    logger.debug('CORS Origin:', origin);
    const isAllowed = !origin || 
      allowedDomains.includes(origin)
    if (isAllowed) {
      callback(null, true);
    } else {
      logger.warn(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
};
function rawBodySaver(req, res, buf, encoding) {
  if (buf && buf.length) req.rawBody = buf.toString(encoding || 'utf8');
}

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));  // Apply the CORS options
app.options('*', cors(corsOptions));
app.use(express.json({ verify: rawBodySaver }));

// Statisches Serving von Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic route
app.get('/', (req, res) => res.send('API Running'));

// Use the user-related routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);

// Debug endpoint (moved to specific path instead of catch-all)
app.get('/api/debug/headers', (req, res) => {
  res.json({ headers: req.headers, ip: req.ip, method: req.method, url: req.url });
});

// 404 handler for unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(ErrorHandler);
// Function to get and log the public IP
async function logCurrentIP() {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    logger.info('Current server IP:', response.data.ip);
  } catch (error) {
    logger.error('Error fetching IP address:', error);
  }
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.dbConnect())
  .catch(async (err) => {
    logger.dbError(err);
    await logCurrentIP();
    process.exit(1);  // Exit process with failure
  });
  mongoose.set("debug", false);

// Start the server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => logger.serverStart(PORT));