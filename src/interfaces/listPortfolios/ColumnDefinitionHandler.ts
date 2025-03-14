import { DeletePortfolioConfirmationModalData } from '@/components/DeletePortfolioConfirmationModal/DeletePortfolioConfirmationModal.props';

export interface ColumnDefinitionHandlerProps {
  setShowDeleteDialog: ({ id, title, open }: DeletePortfolioConfirmationModalData) => void;
}
