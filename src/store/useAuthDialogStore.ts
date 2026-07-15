import { create } from "zustand";

export enum SignTypes {
  SIGNIN,
  SIGNUP,
}

interface AuthDialogState {
  isOpen: boolean;
  signType: SignTypes;
  onOpenChange: (open: boolean) => void;
  openDialog: () => void;
  closeDialog: () => void;
  onSignTypeChange: (signType: SignTypes) => void;
}

export const useAuthDialogStore = create<AuthDialogState>((set) => ({
  isOpen: false,
  signType: SignTypes.SIGNIN,
  openDialog: () => set({ isOpen: true }),
  closeDialog: () => set({ isOpen: false }),
  onOpenChange: (open: boolean) => set({ isOpen: open }),
  onSignTypeChange: (signType: SignTypes) => set({ signType }),
}));
