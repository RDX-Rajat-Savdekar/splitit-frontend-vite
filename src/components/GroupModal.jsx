import { useState } from 'react';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');

function GroupModal({ isOpen, onRequestClose, friends, onCreateGroup }) {
  const [name, setName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);

  // ... handleFriendSelect logic is the same ...

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    onCreateGroup({ name, members: selectedFriends });
    // Reset form after submission
    setName('');
    setSelectedFriends([]);
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
    >
      <h2 className="text-2xl font-bold mb-4">Create New Group</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">Group Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border rounded-lg"/>
        </div>
        <div className="mb-6">
          <label className="block mb-2">Select Friends</label>
          <div className="space-y-2">
            {friends.map((friend) => (
              <div key={friend._id} className="flex items-center">
                <input type="checkbox" id={friend._id} onChange={() => handleFriendSelect(friend._id)} className="mr-2"/>
                <label htmlFor={friend._id}>{friend.name}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button type="button" className="bg-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300" onClick={onRequestClose}>Cancel</button>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">Create</button>
        </div>
      </form>
    </ReactModal>
  );
}

export default GroupModal;