# Financial Dashboard with MongoDB Authentication

A comprehensive financial document processing dashboard with user authentication, built with React frontend and Node.js/Express backend using MongoDB.

## Features

- **User Authentication**: Secure JWT-based authentication with registration and login
- **Multi-User Support**: Each user's financial data is isolated and secure
- **Document Processing**: Upload and process invoices, bank statements, and balance entries
- **Database Integration**: MongoDB for user management and financial records
- **n8n Integration**: Seamless integration with existing n8n workflows
- **Responsive Design**: Modern, user-friendly interface

## Tech Stack

### Frontend
- React 19
- React Router for navigation
- Axios for API calls
- Lucide React for icons
- CSS-in-JS styling

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- CORS and Helmet for security

### Database
- MongoDB (recommended: MongoDB Atlas for cloud deployment)
- Two collections: Users and FinancialRecords

## Project Structure

```
financial-dashboard/
├── backend/                    # Node.js/Express API
│   ├── models/                 # MongoDB models
│   │   ├── User.js            # User model
│   │   └── FinancialRecord.js # Financial records model
│   ├── routes/                # API routes
│   │   ├── auth.js           # Authentication routes
│   │   └── financial.js      # Financial data routes
│   ├── middleware/           # Middleware functions
│   │   └── auth.js          # JWT authentication middleware
│   ├── server.js            # Main server file
│   ├── package.json         # Backend dependencies
│   └── .env.example         # Environment variables template
├── src/                      # React frontend
│   ├── components/          # React components
│   │   ├── Login.js        # Authentication component
│   │   ├── Dashboard.js    # Main dashboard
│   │   ├── InvoiceUpload.js # Invoice processing
│   │   ├── BankStatementUpload.js # Bank statement processing
│   │   └── BalanceEntry.js # Manual balance entry
│   ├── contexts/           # React context providers
│   │   └── AuthContext.js  # Authentication context
│   ├── App.js             # Main app component with routing
│   └── App.css           # Global styles
└── README.md              # This file
```

## Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/financial-dashboard
   
   # JWT Secret (generate a strong secret in production)
   JWT_SECRET=your_jwt_secret_key_here
   
   # Frontend URL for CORS
   FRONTEND_URL=http://localhost:3000
   
   # Server Port
   PORT=5000
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

2. Start the frontend development server:
   ```bash
   npm start
   ```

## Usage

1. **Registration**: Visit `/login` and click "Sign Up" to create a new account
2. **Login**: Use your credentials to access the dashboard
3. **Upload Documents**: 
   - **Invoices**: Upload PDF invoices for automatic processing
   - **Bank Statements**: Upload various formats (PDF, TXT, DOC, DOCX, CSV)
   - **Balance Entry**: Manually enter current account balances
4. **Data Isolation**: All uploaded data is automatically associated with your user account

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout

### Financial Data (Protected)
- `POST /api/financial/upload-invoice` - Upload invoice
- `POST /api/financial/upload-statement` - Upload bank statement
- `POST /api/financial/add-balance` - Add balance entry
- `GET /api/financial/records` - Get user's financial records
- `GET /api/financial/summary` - Get financial summary

## n8n Integration

The system maintains compatibility with your existing n8n workflows:

1. **Invoice Processing**: Webhook at `/webhook/upload-pdf`
2. **Bank Statement Processing**: Webhook at `/webhook/upload-passbook`
3. **Balance Entry**: Webhook at `/webhook/name,balance`

The frontend now sends user authentication data along with document uploads, allowing you to modify your n8n workflows to use dynamic user IDs instead of hardcoded values.

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique, lowercase),
  password: String (hashed),
  createdAt: Date
}
```

### FinancialRecords Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (references Users),
  recordType: String ("INVOICE" | "BALANCE" | "TRANSACTION"),
  amount: Number (for invoices/transactions),
  payee: String (for invoices),
  purpose: String (for invoices),
  dueDate: Date (for invoices),
  balanceAmount: Number (for balance entries),
  fileName: String,
  uploadedAt: Date,
  metadata: Object
}
```

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive validation on all endpoints
- **CORS Protection**: Configurable CORS settings
- **Rate Limiting**: Protection against brute force attacks
- **Helmet.js**: Security headers

## Development

### Backend Development
```bash
# Start with nodemon for auto-restart
npm run dev

# Start without nodemon
npm start
```

### Frontend Development
```bash
# Start development server
npm start

# Build for production
npm run build
```

## Deployment

### Backend Deployment
1. Set up MongoDB (Atlas recommended for cloud)
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Configure environment variables for API URL

## Future Enhancements

- **File Storage**: Implement cloud storage for uploaded documents
- **Data Analytics**: Add charts and visualizations for financial data
- **Notifications**: Email notifications for important financial events
- **Mobile App**: React Native version for mobile access
- **Advanced AI**: Enhanced document processing with machine learning

## Troubleshooting

### Common Issues

1. **MongoDB Connection**: Ensure MongoDB is running and URI is correct
2. **CORS Errors**: Check FRONTEND_URL in environment variables
3. **JWT Issues**: Verify JWT_SECRET is set and consistent
4. **File Upload**: Check file size limits and format support

### Getting Help

- Check the browser console for frontend errors
- Check server logs for backend errors
- Verify environment variables are properly set
- Ensure all dependencies are installed

## License

This project is open source and available under the [MIT License](LICENSE).