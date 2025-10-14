import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../features/auth/authStore';
import groupService from '../features/groups/groupService';
import expenseService from '../features/expenses/expenseService';
import ExpenseModal from '../components/ExpenseModal'; // Import the new modal

function GroupPage() {
  const { groupId } = useParams();
  const { user } = useAuthStore();
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false); // State for modal

  const fetchData = async () => {
    try {
      const groupData = await groupService.getGroup(groupId, user.token);
      setGroup(groupData);
      const expenseData = await expenseService.getExpensesForGroup(groupId, user.token);
      setExpenses(expenseData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [groupId, user.token]);

  const handleCreateExpense = async (expenseData) => {
    try {
      const newExpenseData = { ...expenseData, groupId };
      await expenseService.addExpense(newExpenseData, user.token);
      setModalIsOpen(false); // Close modal
      fetchData(); // Refresh data to show the new expense
    } catch (error) {
      console.error('Failed to create expense:', error);
    }
  };

  if (isLoading) return <h2>Loading...</h2>;
  if (!group) return <h2>Group not found</h2>;

    return (
    <div>
      <ExpenseModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        onCreateExpense={handleCreateExpense}
      />

      <h1 className="text-3xl font-bold text-center mb-8">{group.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Members Card */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Members</h3>
          <ul className="space-y-2">
            {group.members.map((member) => (
              <li key={member._id}>{member.name}</li>
            ))}
          </ul>
        </div>

        {/* Expenses Card */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Expenses</h3>
            <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600" onClick={() => setModalIsOpen(true)}>
              + Add Expense
            </button>
          </div>
          {expenses.length > 0 ? (
            <ul className="space-y-3">
              {expenses.map((expense) => (
                <li key={expense._id} className="flex justify-between border-b pb-2">
                  <span>{expense.description}</span>
                  <span>${expense.amount.toFixed(2)} (Paid by {expense.paidBy.name})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No expenses have been added to this group yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default GroupPage;