import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { io, Socket } from "socket.io-client";

interface Port {
  port_id: number;
  port_name: string;
  coop_code?: number;
}

interface ActivityItem {
  message: string;
  timestamp: string;
  portId?: number;
  portName?: string;
  userName?: string;
}

interface RecentActivityProps {
  ports?: Port[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ ports = [] }) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
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

  // Get port name from port ID
  const getPortName = (portId: number | undefined): string | undefined => {
    if (!portId) return undefined;
    
    const foundPort = ports.find(p => p.port_id === portId);
    return foundPort ? foundPort.port_name : `Port ID: ${portId}`;
  };

  // Load activities from localStorage
  useEffect(() => {
    const savedActivities = localStorage.getItem("recentActivities");
    if (savedActivities) {
      try {
        const parsed = JSON.parse(savedActivities) as ActivityItem[];
        setActivities(parsed);
      } catch (error) {
        console.error("Error parsing saved activities:", error);
      }
    }
  }, []);

  // Update port names whenever ports data changes
  useEffect(() => {
    if (ports.length > 0) {
      setActivities(prevActivities => 
        prevActivities.map(activity => ({
          ...activity,
          portName: getPortName(activity.portId)
        }))
      );
    }
  }, [ports]);

  // Setup socket connection
  useEffect(() => {
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

    const newSocket = io(socketUrl, {
      transports: ["websocket"],
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
          ? `${data.users.user_fname || "Unknown"} ${
              data.users.user_lname || ""
            }`.trim()
          : "Unknown user";

        const portId = data.port_id;
        const portName = getPortName(portId);

        const newActivity: ActivityItem = {
          message: `New form submitted by ${userName}`,
          timestamp: "Just now",
          portId: portId,
          portName: portName,
        };

        setActivities((prev) => {
          const newActivities = [newActivity, ...prev.slice(0, 2)];
          localStorage.setItem(
            "recentActivities",
            JSON.stringify(newActivities)
          );
          return newActivities;
        });
      } catch (error) {
        console.error("Error processing newForm event:", error);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [ports]);

  return (
    <div className="mt-8 rounded-xl bg-blue-50 p-6 border border-blue-200">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-blue-100 p-3 text-blue-600">
          <TrendingUp className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <p className="text-sm text-gray-600">
            Last data update: <span className="font-medium">{lastUpdate}</span>
          </p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div
              key={index}
              className="flex justify-between rounded-lg bg-white p-3 text-sm"
            >
              <div>
                <p>{activity.message}</p>
                {activity.portName && (
                  <p className="text-xs text-gray-500 mt-1">
                    {activity.portName}
                  </p>
                )}
              </div>
              <span className="text-gray-500">{activity.timestamp}</span>
            </div>
          ))
        ) : (
          <div className="rounded-lg bg-white p-3 text-sm text-gray-500">
            No recent activity yet
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;