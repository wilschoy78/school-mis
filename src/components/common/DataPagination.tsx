
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface DataPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const DataPagination = ({ currentPage, totalPages, onPageChange }: DataPaginationProps) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  // Calculate pages to show (show maximum 5 pages at once)
  let startPage = Math.max(currentPage - 2, 1);
  let endPage = Math.min(startPage + 4, totalPages);
  
  // Adjust start if we're showing less than 5 pages
  if (endPage - startPage < 4) {
    startPage = Math.max(endPage - 4, 1);
  }

  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <Pagination className="my-4">
      <PaginationContent>
        {/* First page */}
        {currentPage > 2 && (
          <PaginationItem>
            <PaginationLink onClick={() => handlePageChange(1)}>
              <ChevronsLeft className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Previous page */}
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => handlePageChange(currentPage - 1)} 
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {/* Page numbers */}
        {pages.map(page => (
          <PaginationItem key={page}>
            <PaginationLink 
              isActive={page === currentPage} 
              onClick={() => handlePageChange(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Next page */}
        <PaginationItem>
          <PaginationNext 
            onClick={() => handlePageChange(currentPage + 1)} 
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {/* Last page */}
        {currentPage < totalPages - 1 && (
          <PaginationItem>
            <PaginationLink onClick={() => handlePageChange(totalPages)}>
              <ChevronsRight className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default DataPagination;
