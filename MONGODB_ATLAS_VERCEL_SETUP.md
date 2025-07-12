# MongoDB Atlas + Vercel Setup Guide

This guide will help you configure MongoDB Atlas to work with Vercel deployment.

## 🚨 **The Problem**

Vercel's serverless functions use dynamic IP addresses that change frequently. MongoDB Atlas requires specific IP addresses to be whitelisted for security.

## ✅ **Solution: Allow Access from Anywhere (0.0.0.0/0)**

### **Step 1: Update MongoDB Atlas Network Access**

1. **Go to MongoDB Atlas Dashboard**
   - Visit [MongoDB Atlas](https://cloud.mongodb.com)
   - Sign in to your account

2. **Navigate to Network Access**
   - Click on your cluster
   - Go to **"Network Access"** in the left sidebar

3. **Add IP Address**
   - Click **"Add IP Address"**
   - Click **"Allow Access from Anywhere"** (this adds `0.0.0.0/0`)
   - Click **"Confirm"**

### **Step 2: Verify Database User Permissions**

1. **Go to Database Access**
   - Click **"Database Access"** in the left sidebar

2. **Check Your User**
   - Ensure your database user has **"Read and write to any database"** permissions
   - If not, click **"Edit"** and update permissions

### **Step 3: Test Connection String**

Make sure your connection string in Vercel environment variables is correct:

```env
MONGODB_URI=mongodb+srv://kushwaharudraksha:CSworm123@cluster0.a3kfa.mongodb.net/linkcraft?retryWrites=true&w=majority&appName=Cluster0
```

## 🔧 **Alternative Solutions**

### **Option 1: Use MongoDB Atlas Data API (Recommended)**

If the above doesn't work, consider using MongoDB Atlas Data API:

1. **Enable Data API in Atlas**
   - Go to your cluster
   - Click **"Data API"**
   - Click **"Enable"**

2. **Install MongoDB Data API package**
   ```bash
   npm install mongodb-data-api
   ```

3. **Update connection code**
   ```javascript
   const { DataAPI } = require('mongodb-data-api');
   const api = new DataAPI({
     apiKey: process.env.MONGODB_API_KEY,
     appId: process.env.MONGODB_APP_ID
   });
   ```

### **Option 2: Use MongoDB Atlas App Services**

1. **Create App in Atlas**
   - Go to **"App Services"**
   - Create a new app
   - Configure authentication

2. **Use App Services SDK**
   ```bash
   npm install realm-web
   ```

## 🛠️ **Troubleshooting Steps**

### **Step 1: Check Vercel Environment Variables**

1. **Go to Vercel Dashboard**
   - Visit your project
   - Go to **"Settings"** → **"Environment Variables"**

2. **Verify Variables**
   ```env
   MONGODB_URI=mongodb+srv://kushwaharudraksha:CSworm123@cluster0.a3kfa.mongodb.net/linkcraft?retryWrites=true&w=majority&appName=Cluster0
   SESSION_SECRET=your-super-secret-session-key-change-this-in-production
   NODE_ENV=production
   ```

### **Step 2: Check MongoDB Atlas Logs**

1. **Go to Atlas Logs**
   - Click on your cluster
   - Go to **"Logs"**
   - Check for connection errors

### **Step 3: Test Connection Locally**

1. **Test with your local machine**
   ```bash
   npm start
   ```
   - If it works locally, the issue is with Vercel's IP whitelist

### **Step 4: Use MongoDB Compass**

1. **Download MongoDB Compass**
   - Test connection with your connection string
   - This helps verify if the string is correct

## 🔒 **Security Considerations**

### **For Development:**
- ✅ Allow access from anywhere (`0.0.0.0/0`)
- ✅ Use simple passwords
- ✅ Free tier is fine

### **For Production:**
- ⚠️ Consider using MongoDB Atlas Data API
- ⚠️ Use strong passwords
- ⚠️ Consider paid tier for better performance
- ⚠️ Set up proper authentication

## 📋 **Quick Fix Checklist**

- [ ] MongoDB Atlas Network Access: `0.0.0.0/0` added
- [ ] Database user has read/write permissions
- [ ] Connection string is correct in Vercel
- [ ] Environment variables are set in Vercel
- [ ] App is redeployed after changes

## 🚀 **Deploy After Changes**

1. **Make changes in MongoDB Atlas**
2. **Wait 1-2 minutes** for changes to propagate
3. **Redeploy on Vercel** (or wait for auto-deploy)
4. **Test the application**

## 📞 **Still Having Issues?**

If the problem persists:

1. **Check MongoDB Atlas Status**: [Status Page](https://status.mongodb.com/)
2. **Check Vercel Status**: [Status Page](https://vercel-status.com/)
3. **Contact Support**: Both platforms have excellent support

## 🎯 **Expected Result**

After following these steps, your LinkCraft application should:
- ✅ Connect to MongoDB Atlas successfully
- ✅ Work properly on Vercel
- ✅ Handle user authentication
- ✅ Create and manage short URLs

---

**Remember**: The `0.0.0.0/0` setting allows access from any IP address, which is necessary for Vercel's dynamic IP addresses but should be used carefully in production environments. 