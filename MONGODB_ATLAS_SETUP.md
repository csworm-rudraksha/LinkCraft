# MongoDB Atlas Setup Guide for LinkCraft

This guide will help you connect your LinkCraft application to MongoDB Atlas cloud database.

## 🚀 Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" or "Sign Up"
3. Create your account or sign in

## 🗄️ Step 2: Create a New Cluster

1. **Click "Build a Database"**
2. **Choose "FREE" tier** (M0 Sandbox)
3. **Select Cloud Provider & Region** (choose closest to you)
4. **Click "Create"**

## 🔐 Step 3: Set Up Database Access

1. **Go to "Database Access"** in the left sidebar
2. **Click "Add New Database User"**
3. **Choose "Password" authentication**
4. **Create username and password** (save these!)
5. **Select "Read and write to any database"**
6. **Click "Add User"**

## 🌐 Step 4: Set Up Network Access

1. **Go to "Network Access"** in the left sidebar
2. **Click "Add IP Address"**
3. **For development: Click "Allow Access from Anywhere"** (0.0.0.0/0)
4. **For production: Add your server's IP address**
5. **Click "Confirm"**

## 🔗 Step 5: Get Your Connection String

1. **Go to "Database"** in the left sidebar
2. **Click "Connect"** on your cluster
3. **Choose "Connect your application"**
4. **Select "Node.js"** and version **4.1 or later**
5. **Copy the connection string**

## ⚙️ Step 6: Configure Environment Variables

1. **Create a `.env` file** in your project root:

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster.mongodb.net/linkcraft?retryWrites=true&w=majority

# Session Secret (Change this!)
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Environment
NODE_ENV=development

# Port (optional)
PORT=8001
```

2. **Replace the placeholders:**
   - `yourusername`: Your MongoDB Atlas username
   - `yourpassword`: Your MongoDB Atlas password
   - `cluster.mongodb.net`: Your actual cluster URL

## 🔧 Step 7: Update Connection String

Your connection string should look like this:
```
mongodb+srv://john_doe:mypassword123@cluster0.abc123.mongodb.net/linkcraft?retryWrites=true&w=majority
```

**Important parts:**
- `john_doe` = your username
- `mypassword123` = your password
- `cluster0.abc123.mongodb.net` = your cluster URL
- `linkcraft` = database name (you can change this)

## 🚀 Step 8: Test Your Connection

1. **Start your application:**
   ```bash
   npm start
   ```

2. **Check the console output:**
   ```
   ✅ Connected to MongoDB Atlas successfully
   🚀 LinkCraft Server Started at PORT: 8001
   ```

## 🔒 Security Best Practices

### For Development:
- Use the free tier
- Allow access from anywhere (0.0.0.0/0)
- Use simple passwords

### For Production:
- Use a paid tier for better performance
- Restrict IP access to your server only
- Use strong, complex passwords
- Enable MongoDB Atlas security features
- Set up VPC peering if needed

## 🛠️ Troubleshooting

### Connection Issues:
1. **Check your connection string** - make sure username/password are correct
2. **Verify network access** - ensure your IP is whitelisted
3. **Check database user permissions** - user should have read/write access
4. **Verify cluster is running** - check MongoDB Atlas dashboard

### Common Errors:
- **Authentication failed**: Check username/password
- **Connection timeout**: Check network access settings
- **DNS resolution failed**: Check connection string format

## 📊 Monitoring Your Database

1. **Go to your cluster dashboard**
2. **View metrics** like:
   - Operations per second
   - Connection count
   - Storage usage
   - Query performance

## 🔄 Migration from Local MongoDB

If you're migrating from local MongoDB:

1. **Export your data** from local MongoDB
2. **Import to MongoDB Atlas** using MongoDB Compass or mongoimport
3. **Update your connection string**
4. **Test thoroughly**

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `SESSION_SECRET` | Secret for session encryption | `my-super-secret-key-123` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `PORT` | Server port (optional) | `8001` |

## 🎉 You're Ready!

Your LinkCraft application is now connected to MongoDB Atlas! 

**Benefits:**
- ✅ Cloud-hosted database
- ✅ Automatic backups
- ✅ Scalability
- ✅ High availability
- ✅ Global distribution
- ✅ Built-in security

**Next Steps:**
1. Test all features work correctly
2. Monitor your database usage
3. Set up alerts for high usage
4. Consider upgrading to paid tier for production

---

**Need Help?**
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Community Forums](https://developer.mongodb.com/community/forums/)
- [MongoDB Support](https://www.mongodb.com/support) 