import React, { useState, useMemo } from 'react';
import { Search, Filter, Package, TrendingUp, TrendingDown, Archive, BarChart3, Download, RefreshCw } from 'lucide-react';

// Mock data - will be replaced with real API calls
const generateMockData = () => {
  const products = ['Laptop Dell XPS', 'iPhone 14 Pro', 'Samsung Galaxy S23', 'iPad Air', 'MacBook Pro', 
                    'Sony Headphones', 'Logitech Mouse', 'Mechanical Keyboard', 'Monitor 27"', 'USB-C Cable'];
  const locations = ['Warehouse A', 'Warehouse B', 'Warehouse C', 'Storage 1', 'Storage 2'];
  const types = ['INBOUND', 'OUTBOUND'];
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `TXN-${String(i + 1).padStart(5, '0')}`,
    product: products[Math.floor(Math.random() * products.length)],
    sku: `SKU-${Math.floor(Math.random() * 10000)}`,
    type: types[Math.floor(Math.random() * types.length)],
    quantity: Math.floor(Math.random() * 100) + 1,
    location: locations[Math.floor(Math.random() * locations.length)],
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: ['Completed', 'Pending', 'Processing'][Math.floor(Math.random() * 3)],
    reference: `REF-${Math.floor(Math.random() * 100000)}`
  }));
};

// Calculate current stock from transactions
const calculateStock = (transactions) => {
  const stockMap = new Map();
  
  transactions.forEach(txn => {
    const key = `${txn.product}-${txn.sku}`;
    const current = stockMap.get(key) || { product: txn.product, sku: txn.sku, quantity: 0, location: txn.location };
    
    if (txn.type === 'INBOUND' && txn.status === 'Completed') {
      current.quantity += txn.quantity;
    } else if (txn.type === 'OUTBOUND' && txn.status === 'Completed') {
      current.quantity -= txn.quantity;
    }
    
    stockMap.set(key, current);
  });
  
  return Array.from(stockMap.values()).filter(item => item.quantity > 0);
};

function App() {
  const [transactions] = useState(generateMockData());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Calculate metrics
  const metrics = useMemo(() => {
    const stock = calculateStock(transactions);
    const totalStock = stock.reduce((sum, item) => sum + item.quantity, 0);
    const inbound = transactions.filter(t => t.type === 'INBOUND' && t.status === 'Completed')
                               .reduce((sum, t) => sum + t.quantity, 0);
    const outbound = transactions.filter(t => t.type === 'OUTBOUND' && t.status === 'Completed')
                                .reduce((sum, t) => sum + t.quantity, 0);
    
    return {
      totalStock,
      inbound,
      outbound,
      uniqueProducts: stock.length,
      pending: transactions.filter(t => t.status === 'Pending').length
    };
  }, [transactions]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(txn => {
      const matchesSearch = searchTerm === '' || 
        txn.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'ALL' || txn.type === filterType;
      const matchesStatus = filterStatus === 'ALL' || txn.status === filterStatus;
      
      const matchesDate = (!dateRange.start || txn.date >= dateRange.start) &&
                         (!dateRange.end || txn.date <= dateRange.end);
      
      return matchesSearch && matchesType && matchesStatus && matchesDate;
    });
  }, [transactions, searchTerm, filterType, filterStatus, dateRange]);

  const currentStock = useMemo(() => calculateStock(transactions), [transactions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-2.5 rounded-xl shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Inventory Dashboard
                </h1>
                <p className="text-sm text-slate-500">Warehouse Management System</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'transactions', label: 'Transactions', icon: Archive },
              { id: 'stock', label: 'Current Stock', icon: Package }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative ${
                  activeTab === tab.id
                    ? 'text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Stock"
                value={metrics.totalStock.toLocaleString()}
                icon={Package}
                color="blue"
                trend="+12%"
              />
              <MetricCard
                title="Inbound"
                value={metrics.inbound.toLocaleString()}
                icon={TrendingUp}
                color="green"
                trend="+8%"
              />
              <MetricCard
                title="Outbound"
                value={metrics.outbound.toLocaleString()}
                icon={TrendingDown}
                color="orange"
                trend="-5%"
              />
              <MetricCard
                title="Unique Products"
                value={metrics.uniqueProducts}
                icon={Archive}
                color="purple"
                trend="+3"
              />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Transactions</h2>
              <div className="space-y-3">
                {transactions.slice(0, 5).map(txn => (
                  <div key={txn.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        txn.type === 'INBOUND' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {txn.type === 'INBOUND' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{txn.product}</p>
                        <p className="text-sm text-slate-500">{txn.sku} • {txn.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">{txn.quantity} units</p>
                      <p className="text-sm text-slate-500">{txn.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Transactions View */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by product, SKU, or ID..."
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="ALL">All Types</option>
                    <option value="INBOUND">Inbound</option>
                    <option value="OUTBOUND">Outbound</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="ALL">All Status</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                  </select>
                </div>

                {/* Export Button */}
                <div className="flex items-end">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">SKU</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredTransactions.map(txn => (
                      <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-mono text-slate-600">{txn.id}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{txn.product}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{txn.sku}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            txn.type === 'INBOUND' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {txn.type === 'INBOUND' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {txn.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">{txn.quantity}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{txn.location}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{txn.date}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            txn.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                            txn.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {txn.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredTransactions.length === 0 && (
                <div className="text-center py-12">
                  <Filter className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No transactions found matching your filters</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Current Stock View */}
        {activeTab === 'stock' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Current Inventory</h2>
                <div className="text-sm text-slate-500">
                  {currentStock.length} unique items • {metrics.totalStock.toLocaleString()} total units
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentStock.map((item, idx) => (
                  <div key={idx} className="p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">{item.product}</h3>
                        <p className="text-sm text-slate-600">{item.sku}</p>
                      </div>
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Package className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                      <span className="text-sm text-slate-600">{item.location}</span>
                      <span className="text-xl font-bold text-blue-600">{item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Metric Card Component
function MetricCard({ title, value, icon: Icon, color, trend }) {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-400',
    green: 'from-green-500 to-emerald-400',
    orange: 'from-orange-500 to-amber-400',
    purple: 'from-purple-500 to-pink-400'
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className="text-sm font-medium text-green-600">{trend}</span>
        )}
      </div>
      <h3 className="text-sm font-medium text-slate-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default App;
