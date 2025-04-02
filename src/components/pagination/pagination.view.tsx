import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { PaginationProps } from '@/components/pagination/pagination.props';
import { Button } from '@/components/ui/button';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  handlePageChange,
  handlePageSizeChange,
}: PaginationProps) => {
  const totalPages: number = Math.ceil(totalItems / itemsPerPage);
  const pageSizeOptions = [10, 20, 30, 40, 50];
  // const filtersOptions: any | null = useAppSelector(filterOptionsSelector);

  const pageSizeChange = (value: number) => {
    if (value < 1) return;
    if (value > Math.ceil(totalItems / itemsPerPage)) return;
    const offset = value === 1 ? 0 : (value - 1) * itemsPerPage;
    console.log('offset', offset);
    handlePageChange(offset);
  };

  return (
    <div className="flex items-center justify-end px-2">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${itemsPerPage}`}
            defaultValue={`${itemsPerPage}`}
            onValueChange={(value) => {
              handlePageSizeChange(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handlePageChange(0)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => pageSizeChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => pageSizeChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => pageSizeChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
  // return (
  //   <div className="flex w-full flex-col-reverse justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8">
  //     <div className="flex items-center space-x-2">
  //       <p className="whitespace-nowrap text-sm font-medium">Rows per page</p>
  //       <Select
  //         value={`${itemsPerPage}`}
  //         defaultValue={`${itemsPerPage}`}
  //         onValueChange={(value) => {
  //           handlePageSizeChange(Number(value));
  //         }}
  //       >
  //         <SelectTrigger className="h-8 w-[4.5rem]">
  //           <SelectValue placeholder={'what is this?'} />
  //         </SelectTrigger>
  //         <SelectContent side="bottom">
  //           {pageSizeOptions.map((pageSize) => (
  //             <SelectItem key={pageSize} value={`${pageSize}`}>
  //               {pageSize}
  //             </SelectItem>
  //           ))}
  //         </SelectContent>
  //       </Select>
  //     </div>
  //     <div className="flex gap-2">
  //       <div className="flex items-center justify-center text-sm font-medium">
  //         Page {currentPage + 1} of {totalPages}
  //       </div>
  //       <div className="flex items-center justify-center space-x-2">
  //         <button
  //           onClick={() => handlePageChange(currentPage - 1)}
  //           disabled={currentPage === 0}
  //           className={`rounded border px-3 py-1 ${currentPage === 0 ? 'disabled:opacity-50' : ''}`}
  //         >
  //           Previous
  //         </button>
  //
  //         {[...Array(totalPages)].map((_, index) => (
  //           <button
  //             key={index}
  //             onClick={() => {
  //               const offset = index * itemsPerPage;
  //               handlePageChange(offset);
  //             }}
  //             className={`rounded border px-3 py-1 ${currentPage === index ? 'bg-primary text-white' : ''}`}
  //           >
  //             {index + 1}
  //           </button>
  //         ))}
  //         <button
  //           onClick={() => handlePageChange(currentPage + 1)}
  //           disabled={currentPage + 1 === totalPages}
  //           className={`rounded border px-3 py-1 ${currentPage + 1 === totalPages ? 'disabled:opacity-50' : ''}`}
  //         >
  //           Next
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default Pagination;
