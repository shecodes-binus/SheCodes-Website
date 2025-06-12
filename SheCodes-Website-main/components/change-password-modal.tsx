// components/ChangePasswordModal.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import apiService from '@/lib/apiService';
import toast from 'react-hot-toast';

interface ChangePasswordModalProps {
  onSuccess?: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = (/* props */) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Saving new password...");

    try {
      const response = await apiService.put('/users/me/password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      toast.success(response.data.msg || "Password changed successfully!", { id: toastId });
      // Clear form and implicitly close via DialogClose button
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // In a real app, you might programmatically close the dialog here
      // but clicking the 'Cancel' or 'X' button after success also works.
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "Failed to change password. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[720px] bg-white rounded-xl p-16">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-pink mb-6 text-left">Change Password</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} id="change-password-form" className="grid gap-6">
         {/* Optional: Current Password */}
         <div className="grid gap-4">
            <Label htmlFor="modal-current-password" className="text-left font-semibold text-black">
            Current Password
            </Label>
            <Input
            id="modal-current-password"
            type="password"
            placeholder="Enter your current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="border-[#bfbfbf] rounded-lg placeholder:text-[#bfbfbf] py-5 px-3"
            disabled={isLoading}
            />
        </div>
        <div className="grid gap-4">
          <Label htmlFor="modal-new-password" className="text-left font-semibold text-black">
            New Password
          </Label>
          <Input
            id="modal-new-password"
            type="password"
            placeholder="Enter your new password here"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="border-[#bfbfbf] rounded-lg placeholder:text-[#bfbfbf] py-5 px-3"
            disabled={isLoading}
          />
        </div>
        <div className="grid gap-4">
          <Label htmlFor="modal-confirm-password" className="text-left font-semibold text-black">
            Confirm Password
          </Label>
          <Input
            id="modal-confirm-password"
            type="password"
            placeholder="Enter your password confirmation here"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="border-[#bfbfbf] rounded-lg placeholder:text-[#bfbfbf] py-5 px-3"
            disabled={isLoading}
          />
        </div>
         {error && (
            <p className="text-sm text-red-600 mt-2">{error}</p>
         )}
      </form>
      <DialogFooter className="sm:justify-end mt-4">
          <DialogClose asChild>
            <Button type="button" variant="ghost" className="mr-2 rounded-lg" disabled={isLoading}>Cancel</Button>
          </DialogClose>
        <Button
          type="submit"
          form="change-password-form" // Link to form
          disabled={isLoading}
          className="bg-blueSky hover:bg-blueSky/90 text-white rounded-lg px-6 py-2"
        >
          {isLoading ? 'Saving...' : 'Send'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};