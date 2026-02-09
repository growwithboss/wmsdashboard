# WMS Inventory Dashboard 📦

A modern, feature-rich Warehouse Management System (WMS) dashboard built with React, Vite, and Tailwind CSS. This application provides real-time inventory tracking with advanced filtering capabilities.

![WMS Dashboard](https://img.shields.io/badge/React-18.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-5.0.8-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.6-cyan)

## 🌟 Features

### Dashboard Overview
- **Real-time Metrics**: Total stock, inbound/outbound transactions, unique products
- **Visual Analytics**: Color-coded metric cards with trend indicators
- **Recent Activity**: Quick view of the latest transactions

### Transactions Management
- **Advanced Filtering**:
  - Search by product name, SKU, or transaction ID
  - Filter by transaction type (Inbound/Outbound)
  - Filter by status (Completed/Pending/Processing)
  - Date range filtering
- **Data Export**: Export filtered data to CSV
- **Comprehensive Table**: View all transaction details in a responsive table

### Current Stock View
- **Live Inventory**: Real-time stock calculation (Inbound - Outbound)
- **Product Cards**: Beautiful card layout showing current quantities
- **Location Tracking**: See where each product is stored
- **Stock Metrics**: Total unique items and unit counts

### Design Highlights
- Modern, clean UI with gradient accents
- Fully responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Professional color scheme with accessibility in mind
- Lucide React icons for consistent iconography

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd wms-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 📦 Deploying to Vercel

### Method 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: WMS Dashboard"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite configuration
   - Click "Deploy"

3. **Configuration** (Auto-detected by Vercel)
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow the prompts**
   - Link to existing project or create new
   - Confirm settings
   - Deploy!

### Environment Variables (for future API integration)

When you're ready to connect to your backend:

1. In Vercel Dashboard, go to your project
2. Navigate to Settings → Environment Variables
3. Add your variables:
   ```
   VITE_API_BASE_URL=https://your-api-url.com
   VITE_API_KEY=your-api-key
   ```

## 🔌 Backend Integration

The dashboard currently uses mock data. To connect to your WMS API:

### 1. Create API Service File

Create `src/services/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const api = {
  // Inbound Transactions
  async getInboundTransactions() {
    const response = await fetch(`${API_BASE_URL}/inbound/transactions`);
    return response.json();
  },

  // Outbound Transactions
  async getOutboundTransactions() {
    const response = await fetch(`${API_BASE_URL}/outbound/transactions`);
    return response.json();
  },

  // Master Data
  async getProducts() {
    const response = await fetch(`${API_BASE_URL}/master/products`);
    return response.json();
  },

  async getLocations() {
    const response = await fetch(`${API_BASE_URL}/master/locations`);
    return response.json();
  },

  // Current Stock
  async getCurrentStock() {
    const response = await fetch(`${API_BASE_URL}/inventory/current-stock`);
    return response.json();
  }
};
```

### 2. Update App.jsx

Replace the mock data generation with API calls:

```javascript
import { api } from './services/api';

// In your component
useEffect(() => {
  async function fetchData() {
    try {
      const [inbound, outbound] = await Promise.all([
        api.getInboundTransactions(),
        api.getOutboundTransactions()
      ]);
      setTransactions([...inbound, ...outbound]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  fetchData();
}, []);
```

### 3. API Endpoints Based on Your Documentation

Based on the Swagger files you provided, you'll need to implement:

- `/api/inbound/*` - Inbound microservice endpoints
- `/api/outbound/*` - Outbound microservice endpoints
- `/api/master/*` - Master data endpoints
- `/api/inventory/*` - Product and stock endpoints

## 📁 Project Structure

```
wms-dashboard/
├── src/
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # Entry point
│   ├── index.css            # Global styles
│   └── services/            # API services (to be added)
├── public/                  # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── README.md              # This file
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to change the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    }
  }
}
```

### Mock Data
Modify the `generateMockData()` function in `App.jsx` to match your data structure.

## 🛠️ Tech Stack

- **React 18.2** - UI Framework
- **Vite 5** - Build tool and dev server
- **Tailwind CSS 3** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **PostCSS & Autoprefixer** - CSS processing

## 📝 Future Enhancements

- [ ] Real-time WebSocket updates
- [ ] Advanced analytics and charts
- [ ] PDF report generation
- [ ] Barcode scanning integration
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] User authentication
- [ ] Role-based access control
- [ ] Notification system
- [ ] Batch operations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 💡 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ for modern warehouse management**
