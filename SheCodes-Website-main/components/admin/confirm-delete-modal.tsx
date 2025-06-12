// src/components/admin/delete-confirmation-modal.tsx
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { RiErrorWarningFill } from "react-icons/ri"; // Reusing the warning icon
import { Trash2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
  itemCount: number;
  itemName?: string; // Optional: e.g., "events", "items"
  onConfirm: () => void; // Function to call when deletion is confirmed
  onClose?: () => void; // Optional: function to call when modal closes (useful if parent needs to know)
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  itemCount,
  itemName = "items", // Default item name
  onConfirm,
  onClose,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleConfirmClick = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Call the confirmation function passed from the parent
      await onConfirm();
      // Parent's onConfirm should handle closing or further actions
      // If onClose prop is provided, call it
      // onClose?.(); // Usually DialogClose handles this, but can be added if needed after async op

    } catch (err: any) {
      console.error("Deletion failed:", err);
      setError(err.message || "An error occurred during deletion.");
    } finally {
      setIsLoading(false);
      // Note: The modal might be closed by DialogClose before isLoading is set back to false
      // if the onConfirm is very fast. For async operations, this is generally fine.
    }
  };

  return (
    // Apply similar styling as CloseRegisterModal
    <DialogContent className="sm:max-w-[600px] bg-white rounded-2xl p-16 text-center">
      {/* No form needed if it just triggers a callback */}
      <div className="flex flex-col items-center justify-center space-y-10">
        

        {/* Header */}
        <DialogHeader className="flex flex-col items-center justify-center space-y-4">
          {/* Icon */}
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-pink-100">
            <Trash2 className="w-8 h-8 text-pink" />
          </div>
          <DialogTitle className="text-2xl font-bold text-pink text-center tracking-normal">
            Delete
          </DialogTitle>
          <p className="text-black text-sm max-w-xs mx-auto leading-relaxed">
            Are you sure you want to delete {itemCount} {itemName}?
            All associated data will be permanently lost.
          </p>
        </DialogHeader>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <DialogFooter className="flex flex-col sm:flex-row gap-12 justify-center items-center mt-10"> {/* Added padding-top */}
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="rounded-lg px-10 py-4 rounded-lg border-blueSky border text-blueSky hover:text-blueSky" // Adjusted padding
              disabled={isLoading}
              onClick={onClose} // Call onClose if provided when Cancel is clicked
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button" // It's not submitting a form within the modal
            onClick={handleConfirmClick}
            disabled={isLoading || itemCount === 0} // Disable if loading or nothing selected
            // Use a destructive style for delete confirmation
            className="bg-blueSky text-white hover:bg-blueSky/90 rounded-lg px-10 py-4"
          >
            {isLoading ? 'Deleting...' : `Delete`}
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  );
};