import { useState, useEffect } from 'react';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');

function ExpenseModal({ isOpen, onRequestClose, onCreateExpense, groupMembers, currentUserId }) {
  // Form state
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(currentUserId);
  const [splitType, setSplitType] = useState('equal');
  
  // State for split inputs. Using an object for easy lookup by member ID
  const [shares, setShares] = useState({});
  const [remainingAmount, setRemainingAmount] = useState(0);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setDescription('');
      setAmount('');
      setPaidBy(currentUserId);
      setSplitType('equal');
      
      // Initialize shares for all members
      const initialShares = {};
      groupMembers.forEach(member => {
        initialShares[member._id] = '';
      });
      setShares(initialShares);
    }
  }, [isOpen, currentUserId, groupMembers]);

  // Live calculator for remaining amount
  useEffect(() => {
    const totalAmount = parseFloat(amount) || 0;
    if (splitType === 'unequal' && totalAmount > 0) {
      let allocated = 0;
      Object.values(shares).forEach(share => {
        allocated += parseFloat(share) || 0;
      });
      setRemainingAmount(totalAmount - allocated);
    } else {
      setRemainingAmount(0);
    }
  }, [amount, shares, splitType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalAmount = Number(amount);
    let expenseData = {
      description,
      amount: totalAmount,
      paidBy,
      splitType,
    };

    if (splitType === 'equal') {
      expenseData.splitWith = groupMembers.map(m => m._id);
    } else if (splitType === 'unequal') {
      expenseData.shares = Object.entries(shares).map(([userId, share]) => ({
        user: userId,
        share: Number(share) || 0,
      }));
      // Validation for "live remaining amount"
      if (remainingAmount.toFixed(2) !== '0.00') {
        alert(`Shares must add up to $${totalAmount}. You have $${remainingAmount.toFixed(2)} remaining.`);
        return;
      }
    } else if (splitType === 'percentage') {
      let totalPercentage = 0;
      Object.values(shares).forEach(share => {
        totalPercentage += parseFloat(share) || 0;
      });
      if (totalPercentage !== 100) {
        alert('Percentages must add up to 100%.');
        return;
      }
      expenseData.shares = Object.entries(shares).map(([userId, share]) => ({
        user: userId,
        share: Number(share) || 0,
      }));
    }
    
    onCreateExpense(expenseData);
  };

  // Handler for updating share inputs
  const handleShareChange = (memberId, value) => {
    setShares(prev => ({
      ...prev,
      [memberId]: value,
    }));
  };

  // Render the inputs for unequal/percentage splits
  const renderSplitInputs = () => {
    return groupMembers.map(member => (
      <div key={member._id} className="flex justify-between items-center mb-2">
        <label htmlFor={`share-${member._id}`}>{member.name}</label>
        <input
          type="number"
          id={`share-${member._id}`}
          value={shares[member._id] || ''}
          onChange={(e) => handleShareChange(member._id, e.target.value)}
          className="w-24 px-2 py-1 border rounded-lg"
          placeholder={splitType === 'percentage' ? '%' : '$0.00'}
        />
      </div>
    ));
  };

  return (
    <ReactModal isOpen={isOpen} onRequestClose={onRequestClose} /* ... modal styles ... */ >
      <h2 className="text-2xl font-bold mb-4">Add New Expense</h2>
      <form onSubmit={handleSubmit}>
        {/* Description & Amount */}
        <div className="mb-4">
          <label htmlFor="description" className="block mb-2">Description</label>
          <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full px-3 py-2 border rounded-lg"/>
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="block mb-2">Amount</label>
          <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required className="w-full px-3 py-2 border rounded-lg"/>
        </div>

        {/* Paid By Dropdown */}
        <div className="mb-4">
          <label htmlFor="paidBy" className="block mb-2">Paid By</label>
          <select id="paidBy" value={paidBy} onChange={(e) => setPaidBy(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
            {groupMembers.map(member => (
              <option key={member._id} value={member._id}>
                {member.name} {member._id === currentUserId ? '(You)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Split Type Selector */}
        <div className="mb-4">
          <label className="block mb-2">Split</label>
          <div className="flex gap-4">
            <button type="button" onClick={() => setSplitType('equal')} className={`py-2 px-4 rounded-lg ${splitType === 'equal' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Equally</button>
            <button type="button" onClick={() => setSplitType('unequal')} className={`py-2 px-4 rounded-lg ${splitType === 'unequal' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Unequally</button>
            <button type="button" onClick={() => setSplitType('percentage')} className={`py-2 px-4 rounded-lg ${splitType === 'percentage' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>By %</button>
          </div>
        </div>
        
        {/* Conditional Split Inputs */}
        {splitType !== 'equal' && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            {renderSplitInputs()}
            {/* Live Remaining Amount Calculator */}
            {splitType === 'unequal' && (
              <div className={`text-right mt-2 font-semibold ${remainingAmount.toFixed(2) === '0.00' ? 'text-green-600' : 'text-red-600'}`}>
                ${remainingAmount.toFixed(2)} remaining
              </div>
            )}
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <button type="button" className="bg-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300" onClick={onRequestClose}>Cancel</button>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">Add</button>
        </div>
      </form>
    </ReactModal>
  );
}

export default ExpenseModal;