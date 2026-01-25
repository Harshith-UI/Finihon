# Cognito Authentication Implementation

This React application implements client-side authentication using Amazon Cognito Hosted UI with OAuth 2.0 Authorization Code Grant flow.

## Features

- **OAuth 2.0 Authorization Code Grant** - Secure authentication flow
- **JWT Token Management** - Automatic token exchange and storage in memory
- **Global Auth Context** - React Context API for authentication state
- **Automatic Token Exchange** - Handles Cognito redirects and code exchange
- **User Information Extraction** - Decodes JWT tokens to extract user details
- **Secure Logout** - Proper logout via Cognito Hosted UI

## Architecture

### AuthContext Provider

The `AuthProvider` component manages all authentication state:

- `isAuthenticated` - Boolean indicating login status
- `user` - User object with sub, email, and name
- `accessToken` - Cognito access token
- `idToken` - Cognito ID token
- `loading` - Authentication loading state

### Components

- **Login Component** - Handles authentication UI and user information display
- **Protected Components** - All dashboard components can access auth state

## Configuration

### Environment Variables

Create a `.env` file with the following variables:

```bash
REACT_APP_COGNITO_DOMAIN=your-cognito-domain.auth.ap-south-1.amazoncognito.com
REACT_APP_COGNITO_CLIENT_ID=your-app-client-id
REACT_APP_REDIRECT_URI=https://finihon.onrender.com/
```

### Cognito Setup

1. **Create User Pool** in AWS Cognito
2. **Create App Client** with the following settings:
   - Authorization code grant
   - Redirect URI: `https://finihon.onrender.com/`
   - Allowed OAuth Scopes: `email`, `openid`, `profile`

3. **Configure Domain** for the User Pool
4. **Set up App Client Settings** with the redirect URI

## Authentication Flow

1. **User clicks Login** → Redirects to Cognito Hosted UI
2. **User authenticates** → Cognito redirects back with `?code=`
3. **App detects code** → Exchanges code for tokens
4. **Tokens stored** → User information extracted from ID token
5. **URL cleaned** → Removes code parameter
6. **User authenticated** → Dashboard accessible

## Security Features

- **In-memory token storage** - No localStorage usage
- **JWT validation** - Basic JWT structure validation
- **Secure logout** - Proper Cognito logout flow
- **Error handling** - Graceful authentication failures

## Usage

```javascript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { isAuthenticated, user, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <button onClick={login}>Login</button>;
  }
  
  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Token Information

The ID token contains:
- `sub` - Unique user identifier
- `email` - User's email address
- `name` - User's display name

The access token is used for API calls to protected resources.

## Troubleshooting

### Common Issues

1. **Redirect URI mismatch** - Ensure exact match with Cognito configuration
2. **CORS errors** - Verify Cognito app client settings
3. **Token exchange failures** - Check client ID and domain configuration
4. **JWT decoding errors** - Verify token format and structure

### Debug Mode

Enable console logging in `AuthContext.js` to debug authentication issues.