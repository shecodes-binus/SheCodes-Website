// src/components/admin/delete-confirmation-modal.tsx
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { RiErrorWarningFill } from "react-icons/ri"; // Reusing the warning icon

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
    <DialogContent className="sm:max-w-[600px] bg-white rounded-2xl p-8">
      {/* No form needed if it just triggers a callback */}
      <div className="space-y-6">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <RiErrorWarningFill className="w-10 h-10 text-red-500" />
            <DialogTitle className="text-2xl font-semibold text-black">
              Confirm Deletion
            </DialogTitle>
          </div>
        </DialogHeader>

        <p className="text-gray-700 text-md leading-relaxed">
          Are you sure you want to delete{' '}
          <span className="font-semibold">{itemCount}</span> {itemName}?
          This action cannot be undone.
        </p>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <DialogFooter className="sm:justify-end pt-2"> {/* Added padding-top */}
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="rounded-lg px-6 py-2" // Adjusted padding
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
            className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-6 py-2"
          >
            {isLoading ? 'Deleting...' : `Delete ${itemCount} ${itemName}`}
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  );
};