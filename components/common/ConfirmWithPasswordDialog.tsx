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

type ConfirmWithPasswordDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitting: boolean;
  trigger: React.ReactNode;
  title?: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: (password: string) => void | Promise<void>;
};

const ConfirmWithPasswordDialog: React.FC<ConfirmWithPasswordDialogProps> = ({
  isOpen,
  onOpenChange,
  isSubmitting,
  trigger,
  title = "Confirm action",
  description = "Enter your login password to proceed.",
  confirmLabel = "Confirm",
  onConfirm,
}) => {
  const [password, setPassword] = useState("");

  const handleConfirm = async () => {
    await onConfirm(password);
    setPassword("");
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) setPassword("");
        onOpenChange(open);
      }}
    >
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
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
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmWithPasswordDialog;


