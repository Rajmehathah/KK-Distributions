import { create } from 'zustand';
import { apiService } from '../services/api';

export interface UserProfile {
  name: string;
  phone: string;
  isB2B: boolean;
  gstin?: string;
  shopName?: string;
  address: string;
  city: string;
  pincode: string;
  role: 'customer' | 'admin';
}

interface AuthState {
  user: UserProfile | null;
  otpCode: string | null;
  otpPhone: string | null;
  otpSent: boolean;
  isLoading: boolean;

  // Actions
  sendOtp: (phone: string) => Promise<{ success: boolean; otp: string }>;
  verifyOtp: (phone: string, code: string) => Promise<{ success: boolean; message: string; user?: UserProfile }>;
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: UserProfile }>;
  registerB2B: (profile: Omit<UserProfile, 'role' | 'isB2B'> & { gstin: string; shopName: string }) => Promise<{ success: boolean }>;
  loginAsAdmin: () => void;
  logout: () => void;
  updateAddress: (address: string, city: string, pincode: string) => void;
}

// Helpers
const saveUserToStorage = (user: UserProfile | null) => {
  if (user) {
    localStorage.setItem('kk_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('kk_user');
  }
};

const loadUserFromStorage = (): UserProfile | null => {
  const data = localStorage.getItem('kk_user');
  try {
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: loadUserFromStorage(),
  otpCode: null,
  otpPhone: null,
  otpSent: false,
  isLoading: false,

  sendOtp: async (phone: string) => {
    set({ isLoading: true });
    const res = await apiService.sendOtp(phone);
    
    set({
      otpCode: res.otp,
      otpPhone: phone,
      otpSent: res.success,
      isLoading: false,
    });

    return { success: res.success, otp: res.otp };
  },

  verifyOtp: async (phone: string, code: string) => {
    set({ isLoading: true });
    const { otpCode } = useAuthStore.getState();
    
    const res = await apiService.verifyOtp(phone, code, otpCode);
    
    if (res.success && res.user) {
      set({ user: res.user, otpSent: false, otpCode: null, otpPhone: null, isLoading: false });
      saveUserToStorage(res.user);
      return { success: true, message: res.message, user: res.user };
    }

    set({ isLoading: false });
    return { success: false, message: res.message };
  },

  loginWithEmail: async (email: string, password: string) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (email === 'demo@kkdistributions.com' && password === '123456') {
      const mockProfile: UserProfile = {
        name: 'Demo Merchant Partner',
        phone: '9845012345',
        isB2B: true,
        shopName: 'Demo KK Dist Shop',
        gstin: '29AAAAA0000A1Z5',
        address: '12/A, Industrial Area, Rajajinagar',
        city: 'Bengaluru',
        pincode: '560010',
        role: 'customer',
      };
      set({ user: mockProfile, isLoading: false });
      saveUserToStorage(mockProfile);
      return { success: true, message: 'Logged in successfully as Demo Partner!', user: mockProfile };
    }

    set({ isLoading: false });
    return { success: false, message: 'Invalid credentials. Use demo@kkdistributions.com and 123456.' };
  },

  registerB2B: async (profile) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const finalProfile: UserProfile = {
      ...profile,
      isB2B: true,
      role: 'customer',
    };

    set({ user: finalProfile, isLoading: false });
    saveUserToStorage(finalProfile);
    return { success: true };
  },

  loginAsAdmin: () => {
    const adminProfile: UserProfile = {
      name: 'Super Admin - KK Distributions',
      phone: '9999999999',
      isB2B: true,
      shopName: 'KK HQ Dispatch Node',
      gstin: '29KKDIS0000Z1D5',
      address: 'Industrial Sector 4, Yeshwanthpur',
      city: 'Bengaluru',
      pincode: '560022',
      role: 'admin',
    };
    set({ user: adminProfile });
    saveUserToStorage(adminProfile);
  },

  logout: () => {
    set({ user: null });
    saveUserToStorage(null);
  },

  updateAddress: (address, city, pincode) => {
    set((state) => {
      if (!state.user) return {};
      const updatedUser = { ...state.user, address, city, pincode };
      saveUserToStorage(updatedUser);
      return { user: updatedUser };
    });
  },
}));
