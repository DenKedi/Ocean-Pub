# Pallas Backend API

Node.js backend API built with Express and Mongoose for the Pallas event management system.

## Features

- ✅ RESTful API with Express.js
- ✅ MongoDB database with Mongoose ODM
- ✅ User authentication with JWT
- ✅ Password hashing with bcrypt
- ✅ Event management system
- ✅ Category management
- ✅ Token-based authentication
- ✅ Error handling middleware
- ✅ Request logging
- ✅ CORS configuration
- ✅ Input validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Environment Variables**: dotenv
- **HTTP Client**: axios

## Project Structure

```
api/
├── config/
│   └── db.js                 # Database configuration
├── middleware/
│   ├── AsyncHandler.js       # Async error handler wrapper
│   ├── auth.js               # JWT authentication middleware
│   ├── ErrorHandler.js       # Global error handler
│   └── logger.js             # Logging utility
├── models/
│   ├── Category.js           # Category schema
│   ├── Event.js              # Event schema
│   ├── Token.js              # Token schema (for session management)
│   └── User.js               # User schema with bcrypt hashing
├── routes/
│   ├── categoryRoutes.js     # Category CRUD endpoints
│   ├── eventRoutes.js        # Event CRUD endpoints
│   └── userRoutes.js         # User auth & management endpoints
├── .env                      # Environment variables (not committed)
├── app.js                    # Main application file
├── package.json              # Dependencies and scripts
└── serverRoutines.js         # Background tasks (token cleanup)
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas cluster)
- npm or yarn

### Setup Steps

1. **Navigate to the API directory**:
   ```bash
   cd api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create or update the `.env` file:
   ```env
   # MongoDB Connection
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
   
   # JWT Secret (use a strong random string)
   JWT_SECRET=your_jwt_secret_here
   
   # Server Port
   PORT=5050
   
   # Node Environment
   NODE_ENV=development
   
   # Logging Level (ERROR, WARN, INFO, DEBUG)
   LOG_LEVEL=INFO
   ```

4. **Start the server**:
   
   **Development mode** (with auto-reload):
   ```bash
   npm run dev
   ```
   
   **Production mode**:
   ```bash
   npm start
   ```

5. **Test the API**:
   Open your browser or use curl:
   ```bash
   curl http://localhost:5050
   ```
   You should see: `API Running`

## API Endpoints

### Authentication

#### Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "token": "jwt_token_here"
}
```

#### Get Current User
```http
GET /api/users/me
x-auth-token: your_jwt_token
```

### Categories

#### Get All Categories
```http
GET /api/categories
```

#### Get Single Category
```http
GET /api/categories/:id
```

#### Create Category
```http
POST /api/categories
Content-Type: application/json

{
  "name": "Konzert",
  "defaultImageUrl": "https://example.com/concert.jpg",
  "description": "Live music events",
  "color": "#FF5733"
}
```

#### Update Category
```http
PUT /api/categories/:id
Content-Type: application/json

{
  "name": "Updated Name"
}
```

#### Delete Category
```http
DELETE /api/categories/:id
```

### Events

#### Get All Events
```http
GET /api/events?category=<category_id>&startDate=2026-01-01&endDate=2026-12-31&limit=50&page=1
```

#### Get Single Event
```http
GET /api/events/:id
```

#### Create Event
```http
POST /api/events
Content-Type: application/json

{
  "title": "Summer Concert",
  "category": "category_id_here",
  "description": "Amazing summer concert event",
  "room": ["Main Hall", "VIP Lounge"],
  "startTime": "2026-07-15T20:00:00Z",
  "endTime": "2026-07-15T23:00:00Z",
  "price": 25.50,
  "eventImageUrl": "https://example.com/event.jpg",
  "extra_label": "Special Guest"
}
```

#### Update Event
```http
PUT /api/events/:id
Content-Type: application/json

{
  "title": "Updated Event Title",
  "price": 30.00
}
```

#### Delete Event
```http
DELETE /api/events/:id
```

## Models

### User Model
- `name` (String)
- `email` (String, unique, required)
- `password` (String, hashed, required)
- `date` (Date, default: now)

### Category Model
- `name` (String, unique, required, max 50 chars)
- `defaultImageUrl` (String, required)
- `description` (String, max 200 chars)
- `color` (String, default: #333333)

### Event Model
- `title` (String, required)
- `category` (ObjectId, ref: Category, required)
- `eventImageUrl` (String, optional - overrides category image)
- `description` (String)
- `room` (Array of Strings, required)
- `startTime` (Date, required, indexed)
- `endTime` (Date)
- `price` (Number, default: 0)
- `extra_label` (String)
- `date_created` (Date, default: now)
- **Virtual field**: `finalImageUrl` - returns event image or falls back to category image

### Token Model
- `userId` (ObjectId, ref: User, required)
- `token` (String, required)
- `createdAt` (Date, auto-expires after 12 hours)

## Middleware

### AsyncHandler
Wraps async route handlers to catch errors and pass them to error middleware.

### Auth Middleware
Validates JWT tokens from `x-auth-token` header. Use for protected routes.

### ErrorHandler
Global error handler that catches:
- Validation errors
- Duplicate key errors (MongoDB)
- JWT errors (invalid/expired tokens)
- General server errors

### Logger
Comprehensive logging with levels (ERROR, WARN, INFO, DEBUG):
- Server startup/shutdown
- Database connections
- API requests
- Cron jobs
- Errors and warnings

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | Secret key for JWT signing | Required |
| `PORT` | Server port | 5050 |
| `NODE_ENV` | Environment (development/production) | development |
| `LOG_LEVEL` | Logging verbosity (ERROR/WARN/INFO/DEBUG) | INFO |
| `DISABLE_LOGGING` | Disable all logging | false |

## Security Best Practices

1. **Never commit `.env` file** - Add to `.gitignore`
2. **Use strong JWT secret** - Generate with `openssl rand -base64 32`
3. **HTTPS in production** - Use reverse proxy (nginx) or platform SSL
4. **Rate limiting** - Consider adding express-rate-limit
5. **Input validation** - Add express-validator for complex validation
6. **Helmet.js** - Add security headers in production

## Development

### Auto-reload with Nodemon
The dev script uses nodemon for automatic server restart on file changes:
```bash
npm run dev
```

### Debugging
Enable debug logs:
```env
LOG_LEVEL=DEBUG
```

### Database Seeding
Add seed scripts in `scripts/` folder for initial data population.

## Production Deployment

1. Set `NODE_ENV=production` in environment
2. Use process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start app.js --name pallas-api
   pm2 save
   pm2 startup
   ```
3. Set up MongoDB Atlas with IP whitelist
4. Configure reverse proxy (nginx)
5. Enable SSL certificates
6. Set up monitoring and logging

## Troubleshooting

### Cannot connect to MongoDB
- Check `MONGO_URI` in `.env`
- Verify network access in MongoDB Atlas
- Check IP whitelist settings

### JWT Token errors
- Ensure `JWT_SECRET` is set in `.env`
- Check token expiration time
- Verify `x-auth-token` header format

### CORS errors
- Check `allowedDomains` in `app.js`
- Add your frontend URL to the list
- Verify credentials option

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## License

ISC
