// components/ChangeEmailModal.tsx
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose, // Import DialogClose
} from "@/components/ui/dialog";

// Optional: Define props if you need to pass data in or callbacks out
interface ChangeEmailModalProps {
  currentEmail?: string; // Example: If needed for display or validation
  onSuccess?: () => void; // Example: Callback on successful change
}

// Using React.FC for functional component type hinting (optional)
export const ChangeEmailModal: React.FC<ChangeEmailModalProps> = (/* props */) => {
  const [newEmail, setNewEmail] = React.useState('');
  const [confirmEmail, setConfirmEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (newEmail !== confirmEmail) {
      setError("Email addresses do not match.");
      return;
    }
     if (!newEmail.includes('@')) { // Basic validation
        setError("Please enter a valid email address.");
        return;
    }

    setIsLoading(true);
    console.log("Attempting to change email to:", newEmail);

    // --- Replace with your actual API call ---
    try {
      // await api.changeUserEmail(newEmail); // Example API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      alert("Email change request sent (Placeholder)!");
      // Optionally call onSuccess prop if provided: props.onSuccess?.();
      // Reset form or rely on DialogClose to close
      setNewEmail('');
      setConfirmEmail('');
      // Programmatically close if needed, but DialogClose button is preferred
    } catch (err) {
      console.error("Failed to change email:", err);
      setError("Failed to change email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // DialogContent is rendered *by* the parent Dialog component
    <DialogContent className="sm:max-w-[720px] bg-white rounded-xl p-16">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-pink mb-6 text-left">Change Email</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} id="change-email-form" className="grid gap-6">
        <div className="grid gap-4">
          <Label htmlFor="modal-new-email" className="text-left font-semibold text-black">
            New Email
          </Label>
          <Input
            id="modal-new-email" // Use unique ID if needed
            type="email"
            placeholder="Enter your new email here"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
            className="border-[#bfbfbf] rounded-lg placeholder:text-[#bfbfbf] py-5 px-3"
            disabled={isLoading}
          />
        </div>
        <div className="grid gap-4">
          <Label htmlFor="modal-confirm-email" className="text-left font-semibold text-black">
            Confirm Email
          </Label>
          <Input
            id="modal-confirm-email" // Use unique ID
            type="email"
            placeholder="Enter your email confirmation here"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
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
          form="change-email-form" // Link button to the form
          disabled={isLoading}
          className="bg-blueSky hover:bg-blueSky/90 text-white rounded-lg px-6 py-2"
          >
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};