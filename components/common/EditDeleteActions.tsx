"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Loader2, Trash2 } from "lucide-react";
import ConfirmWithPasswordDialog from "@/components/common/ConfirmWithPasswordDialog";

type EditDeleteActionsProps = {
  onEdit: () => void;
  editLabel?: string;
  editDisabled?: boolean;
  editButtonClassName?: string;

  isDeleteOpen: boolean;
  onDeleteOpenChange: (open: boolean) => void;
  onConfirmDelete: (password: string) => void | Promise<void>;
  deleteSubmitting: boolean;
  deleteLabel?: string;
  deleteButtonClassName?: string;
  deleteTitle?: string;
  deleteDescription?: string;
  deleteConfirmLabel?: string;
};

const EditDeleteActions: React.FC<EditDeleteActionsProps> = ({
  onEdit,
  editLabel = "Edit",
  editDisabled = false,
  editButtonClassName,

  isDeleteOpen,
  onDeleteOpenChange,
  onConfirmDelete,
  deleteSubmitting,
  deleteLabel = "Delete",
  deleteButtonClassName,
  deleteTitle = "Confirm deletion",
  deleteDescription = "Enter your login password to confirm deletion. This action cannot be undone.",
  deleteConfirmLabel = "Confirm Delete",
}) => {
  return (
    <div className="flex gap-4">
      <ConfirmWithPasswordDialog
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        isSubmitting={deleteSubmitting}
        title={deleteTitle}
        description={deleteDescription}
        confirmLabel={deleteConfirmLabel}
        onConfirm={onConfirmDelete}
        trigger={
          <Button
            type="button"
            variant="outline"
            className={deleteButtonClassName}
            disabled={deleteSubmitting}
          >
            {deleteSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:block">{deleteLabel}</span>
              </>
            )}
          </Button>
        }
      />

      <Button
        type="button"
        variant="outline"
        className={editButtonClassName}
        onClick={onEdit}
        disabled={editDisabled}
      >
        <Edit className="w-4 h-4" />
        <span className="hidden sm:block">{editLabel}</span>
      </Button>
    </div>
  );
};

export default EditDeleteActions;


