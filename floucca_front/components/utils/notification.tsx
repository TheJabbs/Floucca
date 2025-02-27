// components/utils/notification.tsx
import React, { useEffect } from "react";
import { AlertCircle, CheckCircle, X } from "lucide-react";

export interface NotificationProps {
  type: "success" | "error";
  message: string;
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  isVisible,
  onClose,
  autoClose = true,
  duration = 5000,
}) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVisible && autoClose) {
      timer = setTimeout(() => {
        onClose();
      }, duration);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVisible, autoClose, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-slide-up">
      <div
        className={`rounded-lg shadow-lg p-4 flex items-center justify-between
          ${
            type === "success"
              ? "bg-green-50 text-green-800 border-l-4 border-green-500"
              : "bg-red-50 text-red-800 border-l-4 border-red-500"
          }`}
      >
        <div className="flex items-center gap-3">
          {type === "success" ? (
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          )}
          <p className="font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className={`p-1 rounded-full hover:bg-${
            type === "success" ? "green" : "red"
          }-100`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Notification;