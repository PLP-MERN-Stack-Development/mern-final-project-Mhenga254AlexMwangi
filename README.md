A modern, full-stack recipe sharing platform built with the MERN stack where food enthusiasts can discover, share, and connect over amazing recipes.

## 🚀 Live Demo

- **Frontend**: [https://your-quickbite-app.vercel.app](https://your-quickbite-app.vercel.app)
- **Backend API**: [https://your-quickbite-api.railway.app](https://your-quickbite-api.railway.app)
- **Video Demo**: [Watch Demo Video](#) *(Add your video link here)*

## 📸 Screenshots

| Home Page | Recipe Details | Create Recipe |
|-----------|----------------|---------------|
| ![Home](screenshots/home.png) | ![Details](screenshots/recipe-detail.png) | ![Create](screenshots/create-recipe.png) |

| User Profile | Login | Mobile View |
|-------------|--------|-------------|
| ![Profile](screenshots/profile.png) | ![Login](screenshots/login.png) | ![Mobile](screenshots/mobile.png) |

## ✨ Features

- **🔐 User Authentication** - Secure register/login with JWT
- **📝 Recipe Management** - Create, read, update, delete recipes
- **🖼️ Image Upload** - Multiple images with final product highlighting
- **💬 Real-time Comments** - Interactive commenting system
- **❤️ Like System** - Like your favorite recipes
- **🔍 Search & Filter** - Find recipes by title, difficulty, tags
- **👥 User Profiles** - Public profiles with contact information
- **📱 Responsive Design** - Works perfectly on all devices
- **🎨 Modern UI** - Beautiful gradients and animations

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Modern styling with gradients and animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **Socket.io** - Real-time features

### Deployment
- **netlify** for frontend
- **Railway/Render** - Backend hosting
- **MongoDB Atlas** - Cloud database

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/PLP-MERN-Stack-Development/mern-final-project-Mhenga254AlexMwangi
cd ....
cd backend
npm install
# Start backend
npm run dev
another terminal
npm start #for frontend starting
#create .env
MONGODB_URI=mongodb+srv://alexnjagi123_db_user:0114329940Ba@mern-stack.xuzrza6.mongodb.net/?appName=Mern-stack
JWT_SECRET=quickbite_jwt_secret_2024
PORT=5000

Database Schema
User Model
javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  phone: String,
  contactEmail: String,
  socialMedia: {
    instagram: String,
    twitter: String,
    facebook: String
  },
  bio: String,
  showContactInfo: Boolean
}
Recipe Model
javascript
{
  title: String,
  description: String,
  ingredients: [String],
  instructions: [String],
  prepTime: Number,
  cookTime: Number,
  servings: Number,
  difficulty: String,
  images: [{
    url: String,
    caption: String,
    isFinalProduct: Boolean
  }],
  tags: [String],
  author: ObjectId (ref: User),
  likes: [ObjectId (ref: User)]
}
Comment Model
javascript
{
  text: String,
  author: ObjectId (ref: User),
  recipe: ObjectId (ref: Recipe),
  createdAt: Date
}
 API Endpoints
Authentication
POST /api/auth/register - User registration

POST /api/auth/login - User login

GET /api/auth/profile - Get user profile

Recipes
GET /api/recipes - Get all recipes (with search/filter)

GET /api/recipes/:id - Get single recipe

POST /api/recipes - Create new recipe (protected)

POST /api/recipes/:id/like - Like/unlike recipe (protected)

POST /api/recipes/:id/comments - Add comment (protected)

Users
GET /api/users/:id - Get user profile

PUT /api/users/profile - Update user profile (protected)

 Testing
bash
# Backend tests
cd backend
npm test

#for frontend in root
npm test 


 🏗️ Technical Architecture

## System Overview

QuickBite is a full-stack MERN application following a client-server architecture with a React frontend, Node.js/Express backend, and MongoDB database.

## Architecture Diagram
Client (React) → Express API → MongoDB
↑ ↑ ↑
Vercel Railway MongoDB Atlas

text

## Frontend Architecture

### Component Structure
src/
├── components/
│ ├── Navbar.js
│ └── (Reusable components)
├── pages/
│ ├── Home.js
│ ├── Login.js
│ ├── Register.js
│ ├── RecipeDetail.js
│ ├── CreateRecipe.js
│ ├── Profile.js
│ ├── UserSettings.js
│ └── About.js
├── context/
│ └── AuthContext.js
└── App.js

text

### State Management
- **React Context API** for global authentication state
- **useState/useEffect** for component-level state
- **React Router** for navigation state

### Key Libraries
- `react-router-dom` - Client-side routing
- `axios` - HTTP requests
- `socket.io-client` - Real-time features

## Backend Architecture

### Folder Structure
backend/
├── models/
│ ├── User.js
│ ├── Recipe.js
│ └── Comment.js
├── routes/
│ ├── auth.js
│ ├── recipes.js
│ └── users.js
├── middleware/
│ ├── auth.js
│ └── upload.js
└── server.js

text

### API Design Principles
- **RESTful** endpoints
- **Stateless** authentication with JWT
- **Error handling** middleware
- **Input validation** and sanitization

### Database Design
- **MongoDB** document-based storage
- **Mongoose** ODM for schema validation
- **Relationships** through referencing
- **Indexes** for performance optimization

## Data Flow

### User Registration
1. Client submits registration form
2. Backend validates input and hashes password
3. User document created in MongoDB
4. JWT token generated and returned
5. Client stores token for authenticated requests

### Recipe Creation
1. Authenticated user submits recipe form with images
2. Multer middleware processes file uploads
3. Recipe document created with author reference
4. Images stored locally with file paths
5. Recipe returned to client with populated author

### Real-time Comments
1. Client emits Socket.io event
2. Server broadcasts to connected clients
3. Database updated asynchronously
4. UI updates without page refresh

## Security Measures

### Authentication & Authorization
- JWT tokens with expiration
- Password hashing using bcrypt
- Protected routes middleware
- CORS configuration

### Data Validation
- Mongoose schema validation
- Input sanitization
- File type and size restrictions
- SQL injection prevention (NoSQL)

### File Upload Security
- File type validation (images only)
- Size limits (10MB per file)
- Secure file naming
- Static file serving configuration

## Performance Optimizations

### Frontend
- Lazy loading of images
- Efficient re-renders with React best practices
- CSS optimizations with transforms and opacity
- Bundle size optimization

### Backend
- MongoDB indexing
- Efficient database queries with population
- File streaming for uploads
- Connection pooling

## Deployment Architecture

### Production Environment
- **Frontend**: Vercel (CDN, automatic SSL)
- **Backend**: Railway (Node.js environment)
- **Database**: MongoDB Atlas (cloud database)
- **File Storage**: Local file system with backup strategy

### CI/CD Pipeline
- Automated testing on push
- Automatic deployment to staging
- Manual promotion to production
- Environment-specific configurations

## Scalability Considerations

### Horizontal Scaling
- Stateless backend architecture
- MongoDB replica sets
- Load balancer ready
- CDN for static assets

### Database Optimization
- Appropriate indexing strategy
- Query optimization
- Connection management
- Regular backups

## Monitoring & Logging

### Application Monitoring
- Error tracking with console logging
- Performance monitoring
- User analytics
- Uptime monitoring

### Security Monitoring
- Failed login attempts
- Suspicious activities
- File upload monitoring
- API rate limiting
EOF

