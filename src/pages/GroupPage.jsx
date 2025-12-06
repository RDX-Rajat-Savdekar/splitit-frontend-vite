import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/authStore';
import groupService from '../features/groups/groupService';
import expenseService from '../features/expenses/expenseService';
import activityService from '../features/activity/activityService';
import friendService from '../features/friends/friendService';
import ExpenseModal from '../components/ExpenseModal';
import EditGroupModal from '../components/EditGroupModal';
import EditExpenseModal from '../components/EditExpenseModal';
import toast from 'react-hot-toast';

function GroupPage() {
  const { groupId } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // State
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [activity, setActivity] = useState([]);
  const [allFriends, setAllFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editGroupModalOpen, setEditGroupModalOpen] = useState(false);
  const [editExpenseModalOpen, setEditExpenseModalOpen] = useState(false);
  
  // State for which expense to edit
  const [currentExpense, setCurrentExpense] = useState(null);

  // --- Data Fetching ---
  const fetchData = useCallback(async () => {
    try {
      const [groupData, expenseData, activityData, friendData] = await Promise.all([
        groupService.getGroup(groupId, user.token),
        expenseService.getExpensesForGroup(groupId, user.token),
        activityService.getGroupActivity(groupId, user.token),
        friendService.getFriends(user.token),
      ]);
      setGroup(groupData);
      setExpenses(expenseData);
      setActivity(activityData);
      setAllFriends(friendData);
    } catch (error) {
      toast.error('Failed to fetch group data');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  }, [groupId, user.token, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Handlers ---
  const handleCreateExpense = async (expenseData) => {
    try {
      await expenseService.addExpense({ ...expenseData, groupId }, user.token);
      toast.success('Expense added!');
      setExpenseModalOpen(false);
      fetchData(); // Refresh all data
    } catch (error) {
      const message = error.response?.data?.message || 'Could not add expense';
      toast.error(message);
    }
  };

  const handleUpdateGroup = async (groupData) => {
    try {
      await groupService.updateGroup(groupId, groupData, user.token);
      toast.success('Group updated!');
      setEditGroupModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to update group');
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await groupService.deleteGroup(groupId, user.token);
      toast.success('Group deleted');
      setEditGroupModalOpen(false);
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || 'Could not delete group';
      toast.error(message);
    }
  };
  
  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseService.deleteExpense(expenseId, user.token);
        toast.success('Expense deleted');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete expense');
      }
    }
  };

  const openEditExpenseModal = (expense) => {
    setCurrentExpense(expense);
    setEditExpenseModalOpen(true);
  };

  const handleUpdateExpense = async (expenseId, expenseData) => {
    try {
      await expenseService.updateExpense(expenseId, expenseData, user.token);
      toast.success('Expense updated!');
      setEditExpenseModalOpen(false);
      setCurrentExpense(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to update expense');
    }
  };

  if (isLoading) return <h2>Loading...</h2>;
  if (!group) return <h2>Group not found</h2>;

  return (
    <div>
      {/* --- ALL THREE MODALS --- */}
      <ExpenseModal
        isOpen={expenseModalOpen}
        onRequestClose={() => setExpenseModalOpen(false)}
        onCreateExpense={handleCreateExpense}
        groupMembers={group.members}
        currentUserId={user._id}
      />
      <EditGroupModal
        isOpen={editGroupModalOpen}
        onRequestClose={() => setEditGroupModalOpen(false)}
        group={group}
        allFriends={allFriends}
        onUpdateGroup={handleUpdateGroup}
        onDeleteGroup={handleDeleteGroup}
      />
      <EditExpenseModal
        isOpen={editExpenseModalOpen}
        onRequestClose={() => setEditExpenseModalOpen(false)}
        onUpdateExpense={handleUpdateExpense}
        groupMembers={group.members}
        currentUserId={user._id}
        expense={currentExpense}
      />

      {/* Page Header */}
      <div className="flex justify-between items-center text-center mb-8">
        <h1 className="text-3xl font-bold">{group.name}</h1>
        <button 
          className="bg-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300" 
          onClick={() => setEditGroupModalOpen(true)}
        >
          Edit Group
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column (Expenses & History) */}
        <div className="md:col-span-2 space-y-8">
          
          {/* --- EXPENSES CARD (FIXED) --- */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Expenses</h3>
              {/* --- THIS BUTTON IS NOW RESTORED --- */}
              <button 
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600" 
                onClick={() => setExpenseModalOpen(true)}
              >
                + Add Expense
              </button>
            </div>
            {expenses.length > 0 ? (
              <ul className="space-y-3">
                {expenses.map((expense) => (
                  <li key={expense._id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <span className="block">{expense.description}</span>
                      <span className="text-sm text-gray-600">${expense.amount.toFixed(2)} (Paid by {expense.paidBy.name})</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openEditExpenseModal(expense)}
                        className="text-xs text-blue-600"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteExpense(expense._id)} 
                        className="text-xs text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : <p>No expenses added yet.</p>}
          </div>
          
          {/* Group Activity Feed */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Group History</h3>
            <ul className="space-y-3">
              {activity.length > 0 ? activity.map(item => (
                <li key={item._id} className="text-sm text-gray-700 border-b pb-2">
                  <span>{item.text}</span>
                  <span className="block text-xs text-gray-500">
                    by {item.user.name} on {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </li>
              )) : <p>No activity to show.</p>}
            </ul>
          </div>
        </div>

        {/* Right Column (Members) */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
          <h3 className="text-xl font-bold mb-4">Members</h3>
          <ul className="space-y-2">
            {group.members.map((member) => (
              <li key={member._id}>{member.name} {member._id === user._id ? '(You)' : ''}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default GroupPage;