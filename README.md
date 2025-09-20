# Involve Asia Affiliate Deeplink Generator

A modern web application for generating affiliate deeplinks using the Involve Asia API.

## Features

- 🔐 Secure API authentication
- 📋 Browse and filter affiliate offers
- 🔗 Generate deeplinks with custom parameters
- 📱 Responsive design
- 🚀 Built with React, TypeScript, and Tailwind CSS

## Setup Instructions

### Option 1: Using Supabase (Recommended)

1. **Create a Supabase project**:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Create a new project
   - Wait for the project to be ready

2. **Deploy the Edge Function**:
   - In your Supabase dashboard, go to Edge Functions
   - Create a new function named `involve-asia-proxy`
   - Copy the code from `supabase/functions/involve-asia-proxy/index.ts`
   - Deploy the function

3. **Configure environment variables**:
   - Copy `env.example` to `.env`
   - Get your Supabase URL and Anon Key from Settings → API
   - Update the `.env` file with your actual values:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Option 2: Direct API (Development Only)

If you don't want to use Supabase, you can run the proxy server locally:

1. **Start the proxy server**:
   ```bash
   npm run proxy
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Or run both together**:
   ```bash
   npm run dev:full
   ```

## Getting Involve Asia API Credentials

1. Login to your [Involve Asia Publisher Dashboard](https://publisher.involve.asia/)
2. Go to Tools → API
3. Request your API key and secret
4. Use these credentials in the application

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

The application can be deployed to any static hosting service. Make sure to:

1. Set up your Supabase project and Edge Function
2. Configure environment variables in your hosting platform
3. Build the application with `npm run build`

## Troubleshooting

### 404 Error on Authentication
- Ensure your Supabase Edge Function is deployed
- Check that your `VITE_SUPABASE_URL` is correct
- Verify the function name is `involve-asia-proxy`

### CORS Errors
- Use the Supabase Edge Function proxy instead of direct API calls
- Ensure your Supabase project is properly configured

### Authentication Issues
- Verify your Involve Asia API credentials are correct
- Check that your API key has the necessary permissions
- Ensure your account is active and in good standing

## License

MIT License