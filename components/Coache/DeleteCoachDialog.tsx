"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

type DeleteCoachDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitting: boolean;
  trigger: React.ReactNode;
  onConfirm: (password: string) => void | Promise<void>;
};

const DeleteCoachDialog: React.FC<DeleteCoachDialogProps> = ({
  isOpen,
  onOpenChange,
  isSubmitting,
  trigger,
  onConfirm,
}) => {
  const [password, setPassword] = useState("");

  const handleConfirm = async () => {
    await onConfirm(password);
    setPassword("");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => {
      if (!open) setPassword("");
      onOpenChange(open);
    }}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Enter your login password to confirm deleting this coach. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isSubmitting || password.length === 0}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCoachDialog;


