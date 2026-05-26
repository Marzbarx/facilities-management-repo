# Facilities Management API - Render Deployment Guide

This guide explains how to deploy your Facilities Management API to Render, eliminating the need to run json-server and ngrok locally.

## Overview

Your API has been refactored to run on Render as a continuously available web service. The setup includes:

- **package.json**: Node.js dependencies (json-server, cors)
- **server.js**: Custom server that runs json-server programmatically
- **db.json**: Your database with work orders, assets, vendors, and employees
- **routes.json**: Custom route mappings for query parameters
- **render.yaml**: Render deployment configuration
- **facilities_management_openapi.yaml**: Updated OpenAPI spec with Render URL

## Prerequisites

1. A [Render account](https://render.com) (free tier available)
2. A GitHub account (to connect your repository)
3. Git installed on your machine

## Deployment Steps

### Step 1: Prepare Your Repository

1. Initialize a git repository in the `tools` directory (if not already done):

   ```bash
   cd tools
   git init
   ```

2. Create a `.gitignore` file:

   ```bash
   echo "node_modules/" > .gitignore
   ```

3. Commit your files:

   ```bash
   git add .
   git commit -m "Initial commit - Facilities Management API"
   ```

4. Push to GitHub:
   ```bash
   # Create a new repository on GitHub first, then:
   git remote add origin https://github.com/YOUR_USERNAME/facilities-management-api.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Render

#### Option A: Using render.yaml (Recommended)

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml` and configure the service
5. Click **"Apply"** to deploy

#### Option B: Manual Setup

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `facilities-management-api`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave blank (or specify `tools` if deploying from parent directory)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Click **"Create Web Service"**

### Step 3: Get Your API URL

Once deployed, Render will provide a URL like:

```
https://facilities-management-api.onrender.com
```

**Note**: The exact URL depends on your service name. Update the OpenAPI spec if different.

### Step 4: Update Your WatsonX Orchestrate Agent

1. In WatsonX Orchestrate, navigate to your agent's tool configuration
2. Update the OpenAPI specification URL or upload the updated `facilities_management_openapi.yaml`
3. The new server URL should be: `https://facilities-management-api.onrender.com`
4. Test the tools to ensure they work correctly

## Testing Your Deployment

Test the API endpoints using curl or a browser:

```bash
# Get all work orders for coordinator KW-05
curl "https://facilities-management-api.onrender.com/work_orders?coordinator_id=KW-05"

# Get asset details
curl "https://facilities-management-api.onrender.com/asset_inventory?Asset_Tag=CM-F3-01"

# Get vendor by specialty
curl "https://facilities-management-api.onrender.com/vendor_database?Specialty=Coffee%20Machine"

# Get all employees
curl "https://facilities-management-api.onrender.com/employees"

# Update a work order
curl -X PATCH "https://facilities-management-api.onrender.com/work_orders/1" \
  -H "Content-Type: application/json" \
  -d '{"Status": "In Progress", "Comments": "Technician assigned"}'
```

## Important Notes

### Free Tier Limitations

- **Spin Down**: Free tier services spin down after 15 minutes of inactivity
- **Cold Start**: First request after spin down takes 30-60 seconds
- **Uptime**: Not suitable for production with strict SLA requirements

### Data Persistence

⚠️ **Important**: The free tier uses ephemeral storage. Data changes (like updating work orders) will be lost when the service restarts or redeploys.

**Solutions**:

1. **Upgrade to Paid Plan**: Persistent disk storage available
2. **Use External Database**: Connect to PostgreSQL, MongoDB, etc.
3. **Read-Only Mode**: Use for reference data only, update data elsewhere

### Upgrading for Production

For production use, consider:

- **Starter Plan ($7/month)**: No spin down, persistent disk
- **External Database**: More reliable data persistence
- **Custom Domain**: Professional appearance
- **Environment Variables**: Secure configuration management

## Troubleshooting

### Service Won't Start

- Check build logs in Render dashboard
- Verify `package.json` and `server.js` are in the root directory
- Ensure Node.js version compatibility (18+)

### API Returns 404

- Verify the URL matches your Render service URL
- Check that `db.json` and `routes.json` are in the same directory as `server.js`
- Review server logs for errors

### CORS Issues

- The server includes CORS middleware for all origins
- If issues persist, check browser console for specific errors

### Data Not Persisting

- This is expected on free tier
- Consider upgrading or using external database

## Local Development

To test locally before deploying:

```bash
cd tools
npm install
npm start
```

Access at: `http://localhost:3000`

## Maintenance

### Updating Data

1. Update `db.json` in your repository
2. Commit and push changes
3. Render will automatically redeploy

### Monitoring

- View logs in Render dashboard
- Set up notifications for deployment failures
- Monitor API response times

## Support

- [Render Documentation](https://render.com/docs)
- [json-server Documentation](https://github.com/typicode/json-server)
- [WatsonX Orchestrate Documentation](https://www.ibm.com/docs/en/watsonx/watson-orchestrate)

## Next Steps

1. ✅ Deploy to Render
2. ✅ Test all API endpoints
3. ✅ Update WatsonX Orchestrate configuration
4. ✅ Test agent tools end-to-end
5. Consider upgrading for production use
