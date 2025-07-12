# URL Shortener - Complete Web Application

A full-featured URL shortening service built with Node.js, Express, MongoDB, and EJS. This application allows users to create short, memorable links with comprehensive analytics and user management.

## 🚀 Features

### Core Functionality
- **URL Shortening**: Create short, unique URLs from long links
- **User Authentication**: Secure signup/login with password hashing
- **Session Management**: Persistent user sessions with MongoDB storage
- **URL Analytics**: Track clicks, unique visitors, and visit history
- **URL Management**: View, delete, and manage your shortened URLs
- **Expiration Dates**: Set custom expiration dates for URLs
- **Real-time Statistics**: Dashboard with live statistics

### Security Features
- **Password Hashing**: Bcrypt encryption for secure password storage
- **Input Validation**: Comprehensive validation for all user inputs
- **Session Security**: Secure session management with MongoDB storage
- **URL Validation**: Ensures URLs are properly formatted
- **Authentication Middleware**: Protected routes for user-specific features

### User Experience
- **Modern UI**: Beautiful, responsive design with Bootstrap 5
- **Real-time Feedback**: Success/error messages with auto-dismiss
- **Copy to Clipboard**: One-click URL copying
- **Mobile Responsive**: Works perfectly on all devices
- **Loading States**: Smooth loading indicators
- **Error Handling**: Graceful error pages and messages

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: EJS templating, Bootstrap 5, Font Awesome
- **Authentication**: bcrypt, express-session
- **URL Generation**: nanoid
- **Session Storage**: connect-mongo

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd short-url
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB**
   - Make sure MongoDB is running on your system
   - The application will connect to `mongodb://localhost:27017/short-url`

4. **Start the application**
   ```bash
   npm start
   ```

5. **Access the application**
   - Open your browser and go to `http://localhost:8001`

## 🏗️ Project Structure

```
short-url/
├── controllers/
│   ├── url.js          # URL management logic
│   └── user.js         # User authentication logic
├── models/
│   ├── url.js          # URL database schema
│   └── user.js         # User database schema
├── routes/
│   ├── staticRouter.js # Static page routes
│   ├── url.js          # URL API routes
│   └── user.js         # User authentication routes
├── views/
│   ├── dashboard.ejs   # User dashboard
│   ├── error.ejs       # Error page
│   ├── home.ejs        # Landing page
│   ├── login.ejs       # Login page
│   └── signup.ejs      # Registration page
├── public/             # Static assets
├── connect.js          # Database connection
├── index.js            # Main server file
├── package.json        # Dependencies and scripts
└── README.md           # Project documentation
```

## 🔧 API Endpoints

### Public Routes
- `GET /` - Landing page
- `GET /signup` - Registration page
- `GET /login` - Login page
- `GET /url/:shortId` - Redirect to original URL

### Protected Routes (Require Authentication)
- `GET /dashboard` - User dashboard
- `POST /url` - Create new short URL
- `GET /url/analytics/:shortId` - Get URL analytics
- `GET /url/user-urls` - Get user's URLs
- `DELETE /url/:shortId` - Delete URL
- `POST /user/signup` - User registration
- `POST /user/login` - User login
- `GET /user/logout` - User logout

## 📊 Database Schema

### User Model
```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique, validated),
  password: String (required, min 6 chars, hashed),
  isVerified: Boolean (default: false),
  lastLogin: Date,
  urlCount: Number (default: 0),
  timestamps: true
}
```

### URL Model
```javascript
{
  shortId: String (required, unique, 8 chars),
  redirectURL: String (required, validated),
  title: String (default: 'Untitled URL'),
  createdBy: ObjectId (ref: 'user', required),
  visitHistory: [{
    timestamp: Number,
    ip: String,
    userAgent: String
  }],
  isActive: Boolean (default: true),
  expiresAt: Date (optional),
  timestamps: true
}
```

## 🎨 Features in Detail

### URL Creation
- Generates unique 8-character short IDs using nanoid
- Validates URL format (must start with http:// or https://)
- Associates URLs with authenticated users
- Supports custom titles and expiration dates
- Updates user's URL count automatically

### Analytics
- Tracks visit timestamps, IP addresses, and user agents
- Calculates total clicks and unique visitors
- Shows recent visits (last 7 days)
- Provides detailed visit history
- Handles expired URLs gracefully

### User Management
- Secure password hashing with bcrypt
- Email validation and uniqueness checking
- Session-based authentication
- Automatic login after registration
- Last login tracking

### Dashboard Features
- Real-time statistics display
- URL management table with actions
- Copy-to-clipboard functionality
- Modal-based analytics view
- Responsive design for all devices

## 🔒 Security Considerations

- **Password Security**: All passwords are hashed using bcrypt
- **Input Validation**: Comprehensive validation on all inputs
- **Session Security**: Secure session configuration
- **URL Validation**: Ensures only valid URLs are accepted
- **Authentication**: Protected routes for sensitive operations
- **Error Handling**: Graceful error handling without exposing sensitive information

## 🚀 Deployment

### Environment Variables
Create a `.env` file for production:
```env
PORT=8001
MONGODB_URI=mongodb://localhost:27017/short-url
SESSION_SECRET=your-secret-key-here
NODE_ENV=production
```

### Production Considerations
- Set `NODE_ENV=production`
- Use a strong session secret
- Enable HTTPS in production
- Set secure cookie options
- Use a production MongoDB instance
- Implement rate limiting
- Add logging and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the error logs
2. Ensure MongoDB is running
3. Verify all dependencies are installed
4. Check the browser console for JavaScript errors

## 🎯 Future Enhancements

- [ ] Custom short URL aliases
- [ ] QR code generation
- [ ] Advanced analytics with charts
- [ ] URL categories and tags
- [ ] Bulk URL import/export
- [ ] API rate limiting
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Social media sharing
- [ ] URL preview generation

---

**Built with ❤️ using Node.js, Express, MongoDB, and EJS** 