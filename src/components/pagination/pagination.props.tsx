export interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  handlePageChange: (value: number) => void;
  handlePageSizeChange: (value: number) => void;
}
