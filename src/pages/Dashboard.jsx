import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../features/auth/authStore';
import friendService from '../features/friends/friendService';
import groupService from '../features/groups/groupService';
import userService from '../features/users/userService';
import GroupModal from '../components/GroupModal';

function Dashboard() {
  const { user } = useAuthStore();
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [friendEmail, setFriendEmail] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const friendData = await friendService.getFriends(user.token);
      setFriends(friendData);
      const groupData = await groupService.getGroups(user.token);
      setGroups(groupData);
      const balanceData = await userService.getBalance(user.token);
      setBalance(balanceData);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [user.token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateGroup = async (groupData) => {
    try {
      await groupService.createGroup(groupData, user.token);
      toast.success('Group created!');
      setModalIsOpen(false);
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || 'Could not create group';
      toast.error(message);
    }
  };

  const handleAddFriend = async (e) => {
    e.preventDefault();
    if (!friendEmail) {
      return toast.error('Please enter an email');
    }
    try {
      await friendService.addFriend({ email: friendEmail }, user.token);
      toast.success('Friend added!');
      setFriendEmail('');
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || 'Could not add friend';
      toast.error(message);
    }
  };

  if (isLoading) return <h2>Loading...</h2>;

  return (
    <>
      <GroupModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        friends={friends}
        onCreateGroup={handleCreateGroup}
      />

      <section className="text-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user && user.name}</h1>
        <p className="text-gray-500 mt-2">Your Financial Summary</p>
      </section>

      {/* --- THIS IS THE MISSING SECTION --- */}
      {balance && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-8">
          <div className="bg-green-100 p-4 rounded-lg shadow">
            <h3 className="font-bold text-green-800">You are Owed</h3>
            <p className="text-2xl font-semibold text-green-900">${balance.totalOwedToUser}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg shadow">
            <h3 className="font-bold text-red-800">You Owe</h3>
            <p className="text-2xl font-semibold text-red-900">${balance.totalUserOwes}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg shadow">
            <h3 className="font-bold text-blue-800">Net Balance</h3>
            <p className="text-2xl font-semibold text-blue-900">${balance.netBalance}</p>
          </div>
        </section>
      )}
      {/* --- END OF MISSING SECTION --- */}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Your Groups</h2>
            <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600" onClick={() => setModalIsOpen(true)}>
              + Create Group
            </button>
          </div>
          {groups.length > 0 ? (
            <ul className="space-y-2">
              {groups.map((group) => (
                <li key={group._id} className="p-2 hover:bg-gray-100 rounded">
                  <Link to={`/group/${group._id}`}>{group.name}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>You are not in any groups yet.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Your Friends</h2>
          <form onSubmit={handleAddFriend} className="flex gap-2 mb-4">
            <input
              type="email"
              placeholder="Friend's email"
              className="w-full px-3 py-2 border rounded-lg"
              value={friendEmail}
              onChange={(e) => setFriendEmail(e.target.value)}
            />
            <button type="submit" className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600">
              Add
            </button>
          </form>
          {friends.length > 0 ? (
            <ul className="space-y-2">
              {friends.map((friend) => (
                <li key={friend._id} className="p-2">{friend.name}</li>
              ))}
            </ul>
          ) : (
            <p>You have not added any friends yet.</p>
          )}
        </div>
      </section>
    </>
  );
}

export default Dashboard;