import React from 'react';

function Modal({ isOpen, onClose, user }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-xl font-bold mb-4">{user?.name ? `${user.name}'s Profile` : 'No Profile Data'}</h2>
        <div>
          <p><strong>Email:</strong> {user?.email || 'No email available'}</p>
          <p><strong>Role:</strong> {user?.role || 'No role available'}</p>
          <p><strong>Favorites:</strong> {user?.favorites?.length ? user.favorites.join(', ') : 'No favorites available'}</p>
        </div>
        <button
          className="mt-4 bg-black text-white py-2 px-4 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default Modal;
