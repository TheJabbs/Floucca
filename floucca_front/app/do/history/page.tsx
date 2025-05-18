"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, Fish, MapPin, Users, Ruler, Scale, Hash, Anchor, RefreshCw } from 'lucide-react';
import { getFromCache, saveToCache, isCacheValid } from '@/components/utils/cache-utils';
import { getUserById } from '@/services';
import { useAuth } from '@/hooks/useAuth';

interface SubmittedForm {
  form: {
    form_id: number;
    user_id: number;
    port_id: number;
    fisher_name: string;
    period_date?: string;
    boat_detail?: number;
  };
  ports: {
    port_name: string;
  };
  boat_details: {
    fleet_owner: string;
    fleet_registration: number;
    fleet_hp: number;
    fleet_crew: number;
    fleet_max_weight: number;
    fleet_length: number;
  };
  landing?: {
    latitude: number;
    longitude: number;
  };
  fish: Array<{
    specie_code: number;
    gear_code: number;
    fish_weight: number;
    fish_length: number;
    fish_quantity: number;
  }>;
  effort?: {
    hours_fished: number;
  };
  gearDetail: Array<{
    gear_code: number;
    detail_name: string;
    detail_value: string;
  }>;
  lastw: Array<{
    gear_code: number;
    days_fished: number;
  }>;
}

interface FilterOptions {
  startDate: string;
  endDate: string;
  portId?: number;
}

// Cache key constants
const SUBMISSIONS_CACHE_KEY = 'flouca_submissions';
const CACHE_EXPIRATION = 30 * 60 * 1000; 

const SubmissionHistory = () => {
  const [forms, setForms] = useState<SubmittedForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFormId, setExpandedFormId] = useState<number | null>(null);
  const { register, handleSubmit } = useForm<FilterOptions>({
    defaultValues: {
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
    }
  });
  const [user, setUser] = useState<string | null>(null);
  const { user: authUser, loading: authLoading } = useAuth();
  

  // Function to fetch submissions from API
  const fetchSubmissionsFromApi = useCallback(async () => {
    try {
      // Check if authUser is available and has user_id
      if (!authUser || !authUser.user_id) {
        throw new Error('User not authenticated or user ID not available');
      }

      const userId = authUser.user_id;
      console.log("Fetching submissions from API for user:", userId);
      const baseURL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${baseURL}/api/dev/form/top/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }
      const data = await response.json();
      console.log("API:", data);
      
      saveToCache(SUBMISSIONS_CACHE_KEY, data);
      
      return data;
    } catch (error) {
      console.error('Error fetching submissions:', error);
      throw error;
    }
  }, [authUser]);

  const loadSubmissions = useCallback(async () => {
    // if auth is still loading or user is not available
    if (authLoading || !authUser) {
      return;
    }

    setLoading(true);
    try {
      // Try to get data from cache first
      const cachedData = getFromCache<SubmittedForm[]>(SUBMISSIONS_CACHE_KEY, CACHE_EXPIRATION);
      
      if (cachedData) {
        console.log("Using cached submissions data");
        setForms(cachedData);
      } else {
        // Fetch fresh data if cache is invalid or missing
        const freshData = await fetchSubmissionsFromApi();
        setForms(freshData);
        console.log(freshData);
      }
      
      setError(null);
    } catch (err) {
      setError('Error loading submissions. Please try again later.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [authUser, authLoading, fetchSubmissionsFromApi]);

  // Load submissions when auth is ready
  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = authUser.user_id; 
        const userData = await getUserById(userId);
        setUser(userData.user_fname + ' ' + userData.user_lname);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Only fetch user data when auth is loaded and user is available
    if (!authLoading && authUser) {
      fetchUser();
    }
  }, [authUser, authLoading]);

  // Force refresh submissions from API
  const refreshSubmissions = async () => {
    if (!authUser) {
      setError('User not authenticated');
      return;
    }
    setLoading(true);
    try {
      const freshData = await fetchSubmissionsFromApi();
      setForms(freshData);
      setError(null);
    } catch (err) {
      setError('Error refreshing submissions. Please try again later.');
      console.error('Refresh error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const onFilterSubmit = (data: FilterOptions) => {
    console.log('Filter applied:', data);
    // filter to be added here
  };

  const toggleExpand = (formId: number) => {
    setExpandedFormId(expandedFormId === formId ? null : formId);
  };

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading user data...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Submission History</h1>
        <button 
          onClick={refreshSubmissions}
          className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filter Form */}
      <div className="mb-6 p-4 bg-white rounded-lg border shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Filter Submissions</h2>
        <form onSubmit={handleSubmit(onFilterSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              {...register('startDate')}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              {...register('endDate')}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading submissions...</span>
        </div>
      )}

      {/* Submissions List */}
      {!loading && (
        <>
          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          ) : forms.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 text-gray-700 p-8 rounded-lg text-center">
              <p className="text-lg font-medium">No submissions found</p>
              <p className="text-gray-500 mt-2">Your submitted forms will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {forms.map(form => (
                <div 
                  key={form.form.form_id}
                  className="bg-white rounded-lg border shadow-sm overflow-hidden"
                >
                  {/* Summary Row */}
                  <div 
                    className="p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                    onClick={() => toggleExpand(form.form.form_id)}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Fish className="w-4 h-4 text-blue-600" />
                        <h3 className="font-medium">{form.form.fisher_name || 'Unknown'}</h3>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{form.ports.port_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDate(form.form.period_date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                      <span className="text-gray-300">|</span>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedFormId === form.form.form_id && (
                    <div className="p-4 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Boat Details */}
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">Boat Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Hash className="w-4 h-4 text-blue-600" />
                              <span className="text-gray-600">Registration:</span>
                              <span className="font-medium">{form.boat_details.fleet_registration || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Ruler className="w-4 h-4 text-blue-600" />
                              <span className="text-gray-600">Length:</span>
                              <span className="font-medium">{form.boat_details.fleet_length || 'N/A'} m</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Scale className="w-4 h-4 text-blue-600" />
                              <span className="text-gray-600">Max Weight:</span>
                              <span className="font-medium">{form.boat_details.fleet_max_weight || 'N/A'} kg</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-blue-600" />
                              <span className="text-gray-600">Crew:</span>
                              <span className="font-medium">{form.boat_details.fleet_crew || 'N/A'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Fishing Activity Details */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <h4 className="font-medium text-gray-800 mb-2">Fishing Activity</h4>
                          <div className="space-y-2 text-sm">
                            {form.fish && form.fish.length > 0 ? (
                              <>
                                <div className="flex items-center gap-2">
                                  <Fish className="w-4 h-4 text-gray-600" />
                                  <span className="text-gray-600">Catch:</span>
                                  <span className="font-medium">{form.fish.length} species recorded</span>
                                </div>
                                {form.fish.slice(0, 2).map((fish, index) => (
                                  <div key={index} className="flex items-center gap-2 ml-6">
                                    <span className="text-gray-600">Species {fish.specie_code}:</span>
                                    <span className="font-medium">{fish.fish_quantity} fish, {fish.fish_weight}kg</span>
                                  </div>
                                ))}
                                {form.fish.length > 2 && (
                                  <div className="ml-6 text-blue-600 text-xs">
                                    + {form.fish.length - 2} more species
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Fish className="w-4 h-4 text-gray-600" />
                                <span className="text-gray-600">Catch:</span>
                                <span className="font-medium">No catch recorded</span>
                              </div>
                            )}
                            
                            {form.effort && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-600" />
                                <span className="text-gray-600">Hours Fished:</span>
                                <span className="font-medium">{form.effort.hours_fished}</span>
                              </div>
                            )}
                            
                            {form.lastw && form.lastw.length > 0 && (
                              <div className="flex items-center gap-2">
                                <Anchor className="w-4 h-4 text-gray-600" />
                                <span className="text-gray-600">Gears Used:</span>
                                <span className="font-medium">{form.lastw.length}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <button className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                          View Complete Details
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      
      {/* Last updated information */}
      {!loading && forms.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Last updated: {new Date(isCacheValid(SUBMISSIONS_CACHE_KEY) 
              ? Number(localStorage.getItem(`${SUBMISSIONS_CACHE_KEY}_timestamp`)) 
              : Date.now()
            ).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;