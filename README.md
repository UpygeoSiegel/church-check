# Location Pin App - Netlify Version

A high-accuracy location pin-dropping webapp optimized for Netlify deployment.

## Features

- 📍 **High-Accuracy Location Detection**: Uses HTML5 Geolocation API with maximum accuracy
- 🗺️ **Interactive Map**: Built with Leaflet.js and OpenStreetMap
- 📱 **Mobile-Optimized**: Responsive design for smartphones and tablets
- ⚡ **Real-time Updates**: Automatic polling to sync pins across users
- 🎯 **Precision Tracking**: Shows accuracy indicators for each pin
- 🌐 **Serverless**: Optimized for Netlify Functions

## Deployment to Netlify

### Method 1: Git Integration (Recommended)

1. Push this code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Connect your repository to Netlify:
   - Go to [Netlify](https://netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Choose your Git provider and select this repository
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `public`
   - Functions directory: `netlify/functions`
4. Click "Deploy site"

### Method 2: Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Install dependencies
npm install

# Login to Netlify
netlify login

# Initialize and deploy
netlify init
netlify deploy --prod
```

### Method 3: Drag and Drop

1. Run `npm run build` locally
2. Create a zip file containing:
   - `public/` directory
   - `netlify/` directory
   - `netlify.toml` file
3. Drag and drop the zip file to [Netlify's deploy area](https://app.netlify.com/drop)

## Local Development

```bash
# Install dependencies
npm install

# Install Netlify CLI if not already installed
npm install -g netlify-cli

# Start local development server
npm run dev
```

The app will be available at `http://localhost:8888`

## Architecture

### Frontend
- Static HTML/CSS/JavaScript served from `public/`
- Uses Leaflet.js for interactive maps
- Polls the API every 5 seconds for updates
- Optimized for mobile devices

### Backend
- Serverless functions in `netlify/functions/`
- File-based storage using `/tmp/` (temporary)
- RESTful API endpoints:
  - `GET /api/pins` - Fetch all pins
  - `POST /api/pins` - Create a new pin
  - `DELETE /api/pins/:id` - Delete a pin

### Storage
- **Development**: File-based storage in `/tmp/pins.json`
- **Production**: Consider upgrading to:
  - Netlify's Blob Storage
  - External database (MongoDB Atlas, Supabase, etc.)
  - Third-party storage service

## Configuration

The app uses these configuration files:

- `netlify.toml` - Netlify configuration
- `package.json` - Dependencies and scripts
- `public/index.html` - Main application

## Upgrading Storage

For production use, consider replacing the file-based storage with a database:

1. **Netlify Blob Storage** (Recommended for Netlify)
2. **MongoDB Atlas** (Cloud MongoDB)
3. **Supabase** (PostgreSQL with real-time features)
4. **Firebase Firestore** (NoSQL with real-time sync)

## Browser Compatibility

- Chrome/Edge: Full support
- Safari: Full support (iOS 14.5+ for high accuracy)
- Firefox: Full support
- Mobile browsers: Optimized experience

## Security Notes

- Geolocation requires HTTPS in production
- No authentication system (consider adding for production)
- Rate limiting may be needed for production use

## License

MIT License