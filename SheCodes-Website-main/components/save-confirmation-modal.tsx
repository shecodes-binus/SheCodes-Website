'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
// Using a different icon for confirmation vs. warning
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

interface SaveConfirmationModalProps {
  onConfirm: () => void;
  onClose: () => void;
  isSaving?: boolean;
}

export const SaveConfirmationModal: React.FC<SaveConfirmationModalProps> = ({
  onConfirm,
  onClose,
  isSaving = false,
}) => {
  return (
    <DialogContent className="sm:max-w-[600px] bg-white rounded-2xl p-8">
      <div className="space-y-6">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <IoIosCheckmarkCircleOutline className="w-10 h-10 text-blueSky" />
            <DialogTitle className="text-2xl font-semibold text-black">
              Confirm Changes
            </DialogTitle>
          </div>
        </DialogHeader>

        <p className="text-gray-700 text-md leading-relaxed">
          Are you sure you want to save these changes to your profile?
        </p>

        <DialogFooter className="sm:justify-end pt-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="rounded-lg px-6 py-2"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isSaving}
            className="bg-blueSky hover:bg-blueSky/90 text-white rounded-lg px-6 py-2"
          >
            {isSaving ? 'Saving...' : 'Yes, Save Changes'}
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  );
};