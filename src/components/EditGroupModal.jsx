import { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import toast from 'react-hot-toast';

ReactModal.setAppElement('#root');

function EditGroupModal({ isOpen, onRequestClose, group, allFriends, onUpdateGroup, onDeleteGroup }) {
  const [name, setName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  // When the modal opens, pre-fill it with the group's current data
  useEffect(() => {
    if (group) {
      setName(group.name);
      // Set members to an array of just their IDs
      setSelectedMembers(group.members.map(m => m._id));
    }
  }, [group, isOpen]);

  const handleMemberSelect = (friendId) => {
    setSelectedMembers((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId) // Uncheck: remove
        : [...prev, friendId] // Check: add
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return toast.error('Group name is required');
    onUpdateGroup({ name, members: selectedMembers });
  };
  
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the group "${group.name}"? This action cannot be undone.`)) {
      onDeleteGroup();
    }
  };

  return (
    <ReactModal isOpen={isOpen} onRequestClose={onRequestClose} /* ... modal styles ... */ >
      <h2 className="text-2xl font-bold mb-4">Edit Group</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">Group Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border rounded-lg"/>
        </div>
        
        <div className="mb-6">
          <label className="block mb-2">Members</label>
          <div className="space-y-2 h-40 overflow-y-auto border p-2 rounded-lg">
            {allFriends.map((friend) => (
              <div key={friend._id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`friend-${friend._id}`}
                  checked={selectedMembers.includes(friend._id)}
                  onChange={() => handleMemberSelect(friend._id)}
                  className="mr-2"
                />
                <label htmlFor={`friend-${friend._id}`}>{friend.name}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          {/* Delete Button (left) */}
          <button
            type="button"
            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
            onClick={handleDelete}
          >
            Delete Group
          </button>
          
          {/* Save/Cancel Buttons (right) */}
          <div className="flex justify-end gap-4">
            <button type="button" className="bg-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300" onClick={onRequestClose}>Cancel</button>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">Save Changes</button>
          </div>
        </div>
      </form>
    </ReactModal>
  );
}

export default EditGroupModal;