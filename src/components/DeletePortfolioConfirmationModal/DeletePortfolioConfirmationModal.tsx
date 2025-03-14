'use client';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DeletePortfolioConfirmationModalProps } from '@/components/DeletePortfolioConfirmationModal/DeletePortfolioConfirmationModal.props';
import { adminDeletePortfolioById } from '@/store/portfolio/portfolio.thunk';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store';
import { useState } from 'react';

const DeletePortfolioConfirmationModal = ({
  id,
  title,
  open,
  setOpen,
}: DeletePortfolioConfirmationModalProps) => {
  const dispatch = useAppDispatch();
  const [deleting, setDeleting] = useState(false);
  const [deleteButtonText, setDeleteButtonText] = useState('Delete Portfolio');

  const onDeleteHandler = async (id: number) => {
    try {
      setDeleteButtonText('Deleting...');
      setDeleting(true);
      await dispatch(adminDeletePortfolioById({ id }));
      toast.success('Successfully Deleted');
      setOpen({ id: null, title: null, open: false });
      setDeleting(false);
      setDeleteButtonText('Delete Portfolio');
    } catch (err: unknown) {
      toast.error(JSON.stringify(err));
    }
  };

  return (
    <Dialog
      open={open}
      modal={true}
      onOpenChange={() => setOpen({ id: null, title: null, open: false })}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mt-3 px-1">
          <DialogTitle className="my-1">
            Are you sure you want to delete the following Portfolio ?
          </DialogTitle>
          <DialogDescription>{title}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setOpen({ id: null, title: null, open: false });
              }}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant={'destructive'}
            disabled={deleting}
            className={deleting ? 'deleteButton deletingButton' : 'deleteButton'}
            onClick={() => {
              if (id) {
                onDeleteHandler(id);
              }
            }}
          >
            {deleteButtonText}
            {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePortfolioConfirmationModal;
