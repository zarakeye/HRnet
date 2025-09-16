// src/components/PasswordModal.tsx
import React, { useState } from 'react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
  error: string | null;
}

/**
 * A React component that renders a modal to authenticate the user.
 * The modal prompts the user to enter a password and calls the onSubmit function with the password input.
 * The modal also displays an error message if the error prop is not null.
 * The modal is closed when the user clicks the cancel button or when the onSubmit function is called successfully.
 * @example
 * <PasswordModal isOpen={true} onClose={() => {}} onSubmit={(password) => {}} error={null} />
 */
const PasswordModal: React.FC<PasswordModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  error 
}) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles the submission of the password modal form.
   * Prevents the default form submission behavior.
   * If the password input is empty, does nothing.
   * Otherwise, sets the isLoading state to true, calls the onSubmit function with the password input, and sets the isLoading state to false after the onSubmit function has finished executing.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    
    setIsLoading(true);
    onSubmit(password);
    setIsLoading(false);
  };

  /**
   * Resets the password input and closes the password modal.
   */
  const handleClose = () => {
    setPassword('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
        <p className="mb-4 text-gray-600">
          Please enter the password to access the encrypted employee data.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>
          
          {error && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !password}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Authenticating...' : 'Authenticate'}
            </button>
          </div>
        </form>
        
        <div className="mt-4 text-xs text-gray-500">
          <p>This password is used to decrypt your locally stored employee data.</p>
          <p>It is not stored on any server.</p>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;