export interface DeletePortfolioConfirmationModalData {
  id: number | null;
  title: string | null;
  open: boolean;
}

export interface DeletePortfolioConfirmationModalProps
  extends DeletePortfolioConfirmationModalData {
  setOpen: ({ id, title, open }: DeletePortfolioConfirmationModalData) => void;
}
