import { useEffect, useState } from 'react';
import { useAuthStore } from '../features/auth/authStore';
import activityService from '../features/activity/activityService';
import toast from 'react-hot-toast';

function ActivityFeed() {
  const { user } = useAuthStore();
  const [activity, setActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const data = await activityService.getOverallActivity(user.token);
        setActivity(data);
      } catch (error) {
        toast.error('Could not load activity');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (isLoading) return <p>Loading activity...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
      <ul className="space-y-3">
        {activity.length > 0 ? activity.map(item => (
          <li key={item._id} className="text-sm text-gray-700 border-b pb-2">
            {/* The new 'text' field makes this much simpler */}
            <span>{item.text}</span>
            <span className="block text-xs text-gray-500">
              by {item.user.name} on {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </li>
        )) : <p>No recent activity.</p>}
      </ul>
    </div>
  );
}

export default ActivityFeed;