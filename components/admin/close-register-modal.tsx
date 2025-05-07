'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { RiErrorWarningFill } from "react-icons/ri";

interface CloseRegisterModalProps {
  onSuccess?: () => void;
}

export const CloseRegisterModal: React.FC<CloseRegisterModalProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Simulate async task
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log("Successfully closed registration");
      onSuccess?.();
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px] bg-white rounded-2xl p-8">
      <form onSubmit={handleSubmit} id="close-register-form" className="space-y-6">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <RiErrorWarningFill className="w-10 h-10 text-red-500" />
            <DialogTitle className="text-2xl font-semibold text-black">
              Close Event Registration
            </DialogTitle>
          </div>
        </DialogHeader>

        <p className="text-gray-700 text-md leading-relaxed">
          Are you sure you want to close the event registration? This action cannot be undone.
        </p>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="rounded-lg px-4"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="close-register-form"
            disabled={isLoading}
            className="bg-blueSky hover:bg-blueSky/90 text-white rounded-lg px-6 py-2"
          >
            {isLoading ? 'Closing...' : 'Confirm Close'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};