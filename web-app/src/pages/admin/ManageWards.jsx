import { useState, useEffect, useCallback } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { wardService } from '../../services/wardService';
import WardManagement from '../../components/admin/WardManagement';
import Loader, { PageLoader } from '../../components/common/Loader';
import Badge from '../../components/common/Badge';

/* --- SVG Icons --- */
const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const ChartBarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const ManageWards = () => {
  const { showSuccess, showError } = useNotification();
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'capacity', 'observations'

  const fetchWards = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const response = await wardService.getWards();
      const fetchedWards = (response.wards || []).map(ward => ({
        id: ward._id,
        name: ward.name,
        capacity: ward.capacity || 0,
        totalObservations: ward.totalObservations || 0,
        isActive: ward.isActive !== false,
        createdAt: ward.createdAt,
      }));
      setWards(fetchedWards);
    } catch (error) {
      showError(error.message || 'Failed to load wards');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchWards();
  }, [fetchWards]);

  const handleRefresh = () => {
    if (!refreshing) {
      fetchWards(true);
    }
  };

  const handleAdd = async (newWard) => {
    try {
      const response = await wardService.createWard({
        name: newWard.name,
        capacity: parseInt(newWard.capacity) || 0,
      });
      
      const createdWard = response.ward;
      setWards([...wards, {
        id: createdWard._id,
        name: createdWard.name,
        capacity: createdWard.capacity || 0,
        totalObservations: 0,
        isActive: true,
        createdAt: createdWard.createdAt,
      }]);
      showSuccess('Ward added successfully');
    } catch (error) {
      showError(error.message || 'Failed to add ward');
    }
  };

  const handleEdit = async (ward) => {
    try {
      await wardService.updateWard(ward.id, {
        name: ward.name,
        capacity: ward.capacity,
      });
      setWards(wards.map(w => w.id === ward.id ? ward : w));
      showSuccess('Ward updated successfully');
    } catch (error) {
      showError(error.message || 'Failed to update ward');
    }
  };

  const handleDelete = async (wardId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this ward? This action cannot be undone.');
    if (confirmDelete) {
      try {
        await wardService.deleteWard(wardId);
        setWards(wards.filter(w => w.id !== wardId));
        showSuccess('Ward deleted successfully');
      } catch (error) {
        showError(error.message || 'Failed to delete ward');
      }
    }
  };

  // Filter and sort wards
  const filteredWards = wards
    .filter(ward => 
      ward.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'capacity':
          return b.capacity - a.capacity;
        case 'observations':
          return b.totalObservations - a.totalObservations;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  // Calculate stats
  const stats = {
    totalWards: wards.length,
    totalCapacity: wards.reduce((sum, w) => sum + (w.capacity || 0), 0),
    totalObservations: wards.reduce((sum, w) => sum + (w.totalObservations || 0), 0),
    activeWards: wards.filter(w => w.isActive).length,
  };

  // Calculate average observations per ward
  const avgObservations = stats.totalWards > 0 
    ? Math.round(stats.totalObservations / stats.totalWards) 
    : 0;

  if (loading) {
    return <PageLoader text="Loading wards..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-500/30">
                <BuildingIcon />
              </div>
              
              {/* Title */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Manage Wards
                  </h1>
                  <MapPinIcon className="h-6 w-6 text-teal-500" />
                </div>
                <p className="text-gray-500">
                  Configure hospital wards and locations
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`
                  inline-flex items-center gap-2 px-4 py-2.5
                  bg-white border border-gray-200 rounded-xl
                  text-sm font-medium text-gray-700
                  hover:bg-gray-50 hover:border-gray-300
                  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <RefreshIcon className={refreshing ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>

              {/* Add Ward Button */}
              <button
                onClick={() => {/* Handled by WardManagement component */}}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl shadow-lg shadow-teal-600/25 hover:shadow-xl hover:shadow-teal-600/30 transition-all duration-200"
              >
                <PlusIcon />
                <span className="hidden sm:inline">Add Ward</span>
              </button>

              {/* Admin Badge */}
              <Badge variant="primary" size="medium">
                Admin
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                <BuildingIcon className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-teal-600">{stats.totalWards}</p>
                <p className="text-xs text-gray-500">Total Wards</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <UsersIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.totalCapacity.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Total Capacity</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <ClipboardIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{stats.totalObservations.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Observations</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <ChartBarIcon className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{avgObservations}</p>
                <p className="text-xs text-gray-500">Avg/Ward</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/8 overflow-hidden">
          
          {/* Filter Bar */}
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search wards by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                >
                  <option value="name">Sort by Name</option>
                  <option value="capacity">Sort by Capacity</option>
                  <option value="observations">Sort by Observations</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`
                    p-2.5 rounded-lg transition-all duration-200
                    ${viewMode === 'grid' 
                      ? 'bg-white text-teal-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                  title="Grid View"
                >
                  <GridIcon />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`
                    p-2.5 rounded-lg transition-all duration-200
                    ${viewMode === 'list' 
                      ? 'bg-white text-teal-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                  title="List View"
                >
                  <ListIcon />
                </button>
              </div>
            </div>

            {/* Results Info */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-700">{filteredWards.length}</span> of{' '}
                <span className="font-semibold text-gray-700">{wards.length}</span> wards
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>

          {/* Ward Management Component */}
          <div className="p-6">
            {filteredWards.length > 0 ? (
              <WardManagement
                wards={filteredWards}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                viewMode={viewMode}
              />
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <BuildingIcon className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchQuery ? 'No wards found' : 'No wards yet'}
                </h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
                  {searchQuery 
                    ? `No wards match "${searchQuery}". Try a different search term.`
                    : 'Get started by adding your first ward to the system.'
                  }
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => {/* Trigger add modal */}}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl shadow-lg shadow-teal-600/25 transition-all duration-200"
                  >
                    <PlusIcon />
                    Add First Ward
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        {wards.length > 0 && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Top Wards by Observations */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/8 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <ChartBarIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Top Wards</h3>
                    <p className="text-sm text-gray-500">By observation count</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {wards
                    .sort((a, b) => b.totalObservations - a.totalObservations)
                    .slice(0, 5)
                    .map((ward, index) => (
                      <div key={ward.id} className="flex items-center gap-4">
                        <div className={`
                          w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
                          ${index === 0 ? 'bg-amber-100 text-amber-700' :
                            index === 1 ? 'bg-gray-200 text-gray-700' :
                            index === 2 ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-600'
                          }
                        `}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate" title={ward.name}>{ward.name}</p>
                          <p className="text-sm text-gray-500">{ward.capacity} capacity</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-purple-600">{ward.totalObservations}</p>
                          <p className="text-xs text-gray-500">observations</p>
                        </div>
                      </div>
                    ))
                  }
                </div>
                {wards.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No data available</p>
                )}
              </div>
            </div>

            {/* Ward Distribution */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/8 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                    <BuildingIcon className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Capacity Overview</h3>
                    <p className="text-sm text-gray-500">Ward size distribution</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {/* Small Wards */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm text-gray-600">Small (1-20)</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {wards.filter(w => w.capacity <= 20).length} wards
                    </span>
                  </div>
                  {/* Medium Wards */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm text-gray-600">Medium (21-50)</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {wards.filter(w => w.capacity > 20 && w.capacity <= 50).length} wards
                    </span>
                  </div>
                  {/* Large Wards */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="text-sm text-gray-600">Large (51+)</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {wards.filter(w => w.capacity > 50).length} wards
                    </span>
                  </div>
                </div>

                {/* Visual Bar */}
                <div className="mt-6">
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-green-500 transition-all duration-500"
                      style={{ 
                        width: `${(wards.filter(w => w.capacity <= 20).length / wards.length) * 100}%` 
                      }}
                    />
                    <div 
                      className="bg-blue-500 transition-all duration-500"
                      style={{ 
                        width: `${(wards.filter(w => w.capacity > 20 && w.capacity <= 50).length / wards.length) * 100}%` 
                      }}
                    />
                    <div 
                      className="bg-purple-500 transition-all duration-500"
                      style={{ 
                        width: `${(wards.filter(w => w.capacity > 50).length / wards.length) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl border border-teal-100 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                <svg className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-teal-800 mb-1">Ward Management Tips</h3>
                <p className="text-sm text-teal-700">
                  Each ward represents a hospital location where hand hygiene observations are recorded. 
                  Set accurate capacity values to track compliance rates effectively. 
                  Observations are automatically linked to wards for detailed reporting.
                </p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white hover:bg-teal-50 text-teal-700 text-sm font-medium rounded-lg border border-teal-200 transition-colors">
                  View Guide
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManageWards;