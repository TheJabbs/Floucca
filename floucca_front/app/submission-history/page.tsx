"use client";
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, Fish, MapPin, Users, Ruler, Scale, Hash } from 'lucide-react';

interface SubmittedForm {
  form_id: number;
  user_id: number;
  port_id: number;
  period_date: string;
  fisher_name: string;
  creation_time: string;
  ports: {
    port_name: string;
  };
  boat_details: {
    boat_id: number;
    fleet_owner: string;
    fleet_size: number;
    fleet_crew: number;
    fleet_max_weight: number;
    fleet_length: number;
    fleet_registration: number;
  };
}

interface FilterOptions {
  startDate: string;
  endDate: string;
  portId?: number;
}

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

  useEffect(() => {
    const fetchForms = async () => {
      setLoading(true);
      try {
        const userId = 1;
        
        const response = await fetch(`http://localhost:4000/api/dev/form/top/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch submissions');
        }
        const data = await response.json();
        
        setForms(data);
        setError(null);
      } catch (err) {
        setError('Error loading submissions. Please try again later.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const onFilterSubmit = (data: FilterOptions) => {
    console.log('Filter applied:', data);
  };

  const toggleExpand = (formId: number) => {
    setExpandedFormId(expandedFormId === formId ? null : formId);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Submission History</h1>

      {/* Filter Form */}
      <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
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

      {/* Submissions List */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
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
              key={form.form_id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
            >
              {/* Summary Row (always visible) */}
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                onClick={() => toggleExpand(form.form_id)}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Fish className="w-4 h-4 text-blue-600" />
                    <h3 className="font-medium">{form.fisher_name}</h3>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{form.ports.port_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(form.creation_time)}</span>
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
              {expandedFormId === form.form_id && (
                <div className="p-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Boat Details */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Boat Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-600">Owner:</span>
                          <span className="font-medium">{form.boat_details.fleet_owner}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-600">Registration:</span>
                          <span className="font-medium">{form.boat_details.fleet_registration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Ruler className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-600">Length:</span>
                          <span className="font-medium">{form.boat_details.fleet_length} m</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Scale className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-600">Max Weight:</span>
                          <span className="font-medium">{form.boat_details.fleet_max_weight} kg</span>
                        </div>
                      </div>
                    </div>

                    {/* Submission Details */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">Submission Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">{formatDate(form.creation_time)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-600">Time:</span>
                          <span className="font-medium">{formatTime(form.creation_time)}</span>
                        </div>
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
    </div>
  );
};

export default SubmissionHistory;