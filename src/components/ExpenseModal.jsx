import { useState } from 'react';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');

function ExpenseModal({ isOpen, onRequestClose, onCreateExpense }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || isNaN(amount)) {
      alert('Please enter a valid description and amount.');
      return;
    }
    onCreateExpense({ description, amount: Number(amount) });
    // Reset form after submission
    setDescription('');
    setAmount('');
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
    >
      <h2 className="text-2xl font-bold mb-4">Add New Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-2">Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="amount" className="block mb-2">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="flex justify-end gap-4">
          <button type="button" className="bg-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300" onClick={onRequestClose}>Cancel</button>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">Add</button>
        </div>
      </form>
    </ReactModal>
  );
}

export default ExpenseModal;