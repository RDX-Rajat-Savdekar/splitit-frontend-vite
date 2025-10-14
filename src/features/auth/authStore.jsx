import { create } from 'zustand';

// Get user from localStorage to stay logged in
const user = JSON.parse(localStorage.getItem('user'));

export const useAuthStore = create((set) => ({
  // --- STATE ---
  user: user ? user : null, // If there's a user in storage, use it
  isError: false,
  isLoading: false,
  message: '',
    
  // --- ACTIONS ---
  // We will add our register and login functions here later
}));