import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');

function SettleUpModal({ isOpen, onRequestClose, debtDetails, onSettle }) {
  if (!debtDetails) return null; // Don't render if no details

  // Determine who to pay and the amount
  const { userToPay, amount } = debtDetails;
  const positiveAmount = Math.abs(amount).toFixed(2);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
    >
      <h2 className="text-2xl font-bold mb-4">Settle Up</h2>
      <p className="mb-6 text-lg">
        Are you sure you want to record a payment of 
        <strong className="text-blue-600"> ${positiveAmount} </strong> 
        to <strong className="text-blue-600">{userToPay.name}</strong>?
      </p>
      <div className="flex justify-end gap-4">
        <button 
          type="button" 
          className="bg-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300" 
          onClick={onRequestClose}
        >
          Cancel
        </button>
        <button 
          type="button" 
          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600" 
          onClick={onSettle}
        >
          Confirm Payment
        </button>
      </div>
    </ReactModal>
  );
}

export default SettleUpModal;