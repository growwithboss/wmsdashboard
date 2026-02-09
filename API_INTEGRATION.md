# 🔌 API Integration Guide

This guide explains how to connect your WMS Dashboard to your backend API.

## Current Status

✅ **Frontend Complete** - Dashboard is fully functional with mock data
⏳ **Backend Integration** - Ready to connect to your API endpoints

## Your WMS Microservices

Based on your API documentation, you have these microservices:

1. **Inbound Microservice** - Handle incoming inventory
2. **Outbound Microservice** - Handle outgoing inventory
3. **Master Microservice** - Products, SKUs, locations
4. **Product & Task Microservice** - Inventory and tasks
5. **User Microservice** - Authentication and user management
6. **Tenant Microservice** - Multi-tenant configuration
7. **Isolation Microservice** - Data isolation
8. **Document Microservice** - Document management

## Integration Steps

### 1. Set Up Environment Variables

Create `.env.local` file:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
VITE_API_BASE_URL=http://your-api-domain.com
```

### 2. Update App.jsx to Use Real API

Replace the mock data section in `src/App.jsx`:

```javascript
import { dashboardAPI } from './services/api';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real data on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await dashboardAPI.getDashboardData();
        
        // Combine inbound and outbound transactions
        const allTransactions = [
          ...data.inbound.map(t => ({ ...t, type: 'INBOUND' })),
          ...data.outbound.map(t => ({ ...t, type: 'OUTBOUND' }))
        ];
        
        setTransactions(allTransactions);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    
    // Optional: Set up polling for real-time updates
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  // ... rest of your component
}
```

### 3. Map API Response to Dashboard Format

Your API responses need to be transformed to match the dashboard's expected format:

```javascript
// src/utils/dataTransformers.js

export function transformInboundTransaction(apiData) {
  return {
    id: apiData.transactionId || apiData.id,
    product: apiData.productName || apiData.product,
    sku: apiData.sku || apiData.productSku,
    type: 'INBOUND',
    quantity: apiData.quantity || apiData.qty,
    location: apiData.warehouseLocation || apiData.location,
    date: apiData.createdDate || apiData.date,
    status: apiData.status || 'Pending',
    reference: apiData.referenceNumber || apiData.reference
  };
}

export function transformOutboundTransaction(apiData) {
  return {
    id: apiData.transactionId || apiData.id,
    product: apiData.productName || apiData.product,
    sku: apiData.sku || apiData.productSku,
    type: 'OUTBOUND',
    quantity: apiData.quantity || apiData.qty,
    location: apiData.warehouseLocation || apiData.location,
    date: apiData.createdDate || apiData.date,
    status: apiData.status || 'Pending',
    reference: apiData.referenceNumber || apiData.reference
  };
}

export function transformStockData(apiData) {
  return {
    product: apiData.productName || apiData.product,
    sku: apiData.sku,
    quantity: apiData.currentQuantity || apiData.quantity,
    location: apiData.location || apiData.warehouse,
  };
}
```

### 4. Add Authentication (if required)

Update `src/services/api.js` to include authentication:

```javascript
async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  // ... rest of the function
}
```

### 5. Handle API Errors Gracefully

Add error handling component:

```javascript
// src/components/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

## API Endpoint Mapping

### Transactions Tab
```javascript
GET /api/inbound/transactions    // Inbound transactions
GET /api/outbound/transactions   // Outbound transactions
```

Query parameters:
- `startDate`: Filter by start date
- `endDate`: Filter by end date
- `status`: Filter by status
- `location`: Filter by location

### Current Stock Tab
```javascript
GET /api/inventory/stock         // Current stock levels
GET /api/master/products         // Product details
GET /api/master/locations        // Location details
```

### Dashboard Metrics
```javascript
GET /api/inventory/stock         // Calculate totals
GET /api/inbound/transactions    // Get inbound count
GET /api/outbound/transactions   // Get outbound count
```

## Testing API Integration

### 1. Test Individual Endpoints

```javascript
// Test in browser console or create a test page
import api from './services/api';

// Test inbound transactions
api.inbound.getTransactions()
  .then(data => console.log('Inbound:', data))
  .catch(err => console.error('Error:', err));

// Test outbound transactions
api.outbound.getTransactions()
  .then(data => console.log('Outbound:', data))
  .catch(err => console.error('Error:', err));

// Test current stock
api.productTask.getCurrentStock()
  .then(data => console.log('Stock:', data))
  .catch(err => console.error('Error:', err));
```

### 2. Use Browser DevTools

1. Open Developer Tools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Perform actions in the dashboard
5. Check API calls and responses

### 3. Handle CORS Issues

If you get CORS errors, your backend needs to allow the frontend domain:

```javascript
// Backend (example for Node.js/Express)
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app'
  ],
  credentials: true
}));
```

## Production Deployment with API

### 1. Set Environment Variables in Vercel

Vercel Dashboard → Your Project → Settings → Environment Variables

Add:
```
VITE_API_BASE_URL=https://your-production-api.com
VITE_API_KEY=your_api_key (if needed)
```

### 2. Redeploy

Deployments → Latest → ... → Redeploy

### 3. Verify

Check that API calls work in production using browser DevTools

## Common Issues & Solutions

### Issue: CORS Errors
**Solution**: Configure backend to allow your Vercel domain

### Issue: 401 Unauthorized
**Solution**: Check authentication token is being sent correctly

### Issue: 404 Not Found
**Solution**: Verify API endpoint URLs match your backend

### Issue: Slow Loading
**Solution**: Implement loading states and pagination

### Issue: Data Format Mismatch
**Solution**: Use data transformer functions to normalize API responses

## Next Steps

1. ✅ Review your API documentation (Swagger files)
2. ⏳ Identify exact endpoint URLs and response formats
3. ⏳ Update `src/services/api.js` with correct endpoints
4. ⏳ Create data transformer functions
5. ⏳ Test each endpoint individually
6. ⏳ Update `App.jsx` to use real API calls
7. ⏳ Test thoroughly in development
8. ⏳ Deploy to Vercel with production API URL

## Need Help?

Check these resources:
- Your Swagger API documentation
- Browser DevTools Network tab
- Vercel deployment logs
- Backend API logs

---

**Ready to connect your API?** Start with Step 1 above and work through each section systematically.
