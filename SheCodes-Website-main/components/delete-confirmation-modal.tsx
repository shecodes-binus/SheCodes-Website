'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { RiErrorWarningFill } from "react-icons/ri";

interface DeleteConfirmationModalProps {
  itemCount: number;
  // It's best practice for this to be a singular noun, e.g., "project", "event"
  itemName?: string; 
  onConfirm: () => void;
  onClose?: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  itemCount,
  itemName = "item", // Default to singular "item"
  onConfirm,
  onClose,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleConfirmClick = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await onConfirm();
    } catch (err: any) {
      console.error("Deletion failed:", err);
      setError(err.message || "An error occurred during deletion.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Improvement: Handle pluralization automatically
  const pluralizedItemName = `${itemName}${itemCount !== 1 ? 's' : ''}`;

  return (
    <DialogContent className="sm:max-w-[600px] bg-white rounded-2xl p-8">
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
          Are you sure you want to delete{' '} project?
          This action cannot be undone.
        </p>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <DialogFooter className="sm:justify-end pt-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="rounded-lg px-6 py-2"
              disabled={isLoading}
              onClick={onClose}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleConfirmClick}
            disabled={isLoading || itemCount === 0}
            className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-6 py-2"
          >
            {isLoading ? 'Deleting...' : `Delete project`}
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  );
};