import { create } from 'zustand';

interface UIState {
    isIntroComplete: boolean;
    setIntroComplete: (completed: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
    isIntroComplete: false,
    setIntroComplete: (completed) => set({ isIntroComplete: completed }),
}));
