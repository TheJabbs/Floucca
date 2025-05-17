import React from 'react';
import { useRouter } from 'next/navigation';
import { Shield, AlertTriangle, Lock, LogIn, Fish } from 'lucide-react';

interface AccessDeniedProps {
  type?: 'not-logged-in' | 'access-denied' | 'loading';
  title?: string;
  message?: string;
  showLoginButton?: boolean;
  requiredRoles?: string[];
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
  type = 'access-denied',
  title,
  message,
  showLoginButton = true,
  requiredRoles = []
}) => {
  const router = useRouter();

  // Default configurations based on type
  const getTypeConfig = () => {
    switch (type) {
      case 'not-logged-in':
        return {
          icon: <LogIn className="w-16 h-16" />,
          iconColor: 'text-blue-500',
          bgColor: 'from-blue-50 to-indigo-50',
          borderColor: 'border-blue-200',
          defaultTitle: title,
          defaultMessage: message,
          actionColor: 'from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
        };
      default: // access-denied
        return {
          icon: <Shield className="w-16 h-16" />,
          iconColor: 'text-red-500',
          bgColor: 'from-red-50 to-pink-50',
          borderColor: 'border-red-200',
          defaultTitle: title,
          defaultMessage: message,
          actionColor: 'from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
        };
    }
  };

  const config = getTypeConfig();

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  if (type === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50 flex items-center justify-center p-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
          </div>
        </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bgColor} flex items-center justify-center p-4 relative overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-white/10 rounded-full"></div>
        <div className="absolute top-1/3 -left-8 w-96 h-96 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-10 right-1/3 w-64 h-64 bg-white/10 rounded-full"></div>
      </div>

      <div className="relative">
        <div className={`bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border ${config.borderColor} p-8 max-w-lg w-full text-center`}>
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${config.bgColor} mb-6`}>
            <div className={config.iconColor}>
              {config.icon}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>

          {/* Message */}
          <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>

          {/* Required roles info */}
          {requiredRoles.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-sm font-medium text-yellow-800">Required Permissions</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {requiredRoles.map((role, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                  >
                    <Lock className="w-3 h-3 mr-1" />
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {showLoginButton && type === 'not-logged-in' && (
              <button
                onClick={handleLoginRedirect}
                className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${config.actionColor} text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all transform hover:scale-105 active:scale-95`}
              >
                <LogIn className="w-5 h-5 mr-2" />
                Login
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Need help? Contact your system administrator
            </p>
            <div className="flex items-center justify-center mt-2">
              <Fish className="w-4 h-4 text-blue-400 mr-1" />
              <span className="text-xs text-gray-400">FLOUCA - Fish Landing System</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;