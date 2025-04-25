import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { io, Socket } from "socket.io-client";

interface ActivityItem {
  message: string;
  timestamp: string;
  portName?: string;
  userName?: string;
}

const RecentActivity = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      message: "Landing data updated for Beirut and Sidon ports",
      timestamp: "3 hours ago",
    },
    {
      message: "New Sea Bass and Swordfish records added to Tripoli data",
      timestamp: "Yesterday",
    },
    {
      message: "Gear usage report generated for Batroun cooperative",
      timestamp: "2 days ago",
    },
  ]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>(
    new Date().toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  useEffect(() => {
    const newSocket = io("http://localhost:4000", {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    
    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    newSocket.on("newForm", (data: any) => {
      try {
        if (!data) {
          console.warn("Received empty form data");
          return;
        }

        const now = new Date();
        const formattedDate = now.toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        
        setLastUpdate(formattedDate);
        
        const userName = data.users 
          ? `${data.users.user_fname || 'Unknown'} ${data.users.user_lname || ''}`.trim()
          : 'Unknown user';
        
        const portInfo = data.port_id ? `Port ID: ${data.port_id}` : undefined;

        const newActivity: ActivityItem = {
          message: `New form submitted by ${userName}`,
          timestamp: "Just now",
          portName: portInfo,
        };

        setActivities((prev) => [newActivity, ...prev.slice(0, 2)]);
      } catch (error) {
        console.error("Error processing newForm event:", error);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <div className="mt-8 rounded-xl bg-blue-50 p-6 border border-blue-200">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-blue-100 p-3 text-blue-600">
          <TrendingUp className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <p className="text-sm text-gray-600">
            Last data update:{" "}
            <span className="font-medium">{lastUpdate}</span>
          </p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {activities.map((activity, index) => (
          <div key={index} className="flex justify-between rounded-lg bg-white p-3 text-sm">
            <div>
              <p>{activity.message}</p>
              {activity.portName && (
                <p className="text-xs text-gray-500 mt-1">{activity.portName}</p>
              )}
            </div>
            <span className="text-gray-500">{activity.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;