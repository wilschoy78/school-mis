
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import DataPagination from '@/components/common/DataPagination';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  quantity: number;
  location: string;
  status: 'available' | 'low_stock' | 'out_of_stock';
}

// Mock data for books - expanded for pagination example
const mockBooks: Book[] = [
  { id: '1', title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0446310789', quantity: 5, location: 'Fiction A-12', status: 'available' },
  { id: '2', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0743273565', quantity: 3, location: 'Fiction B-7', status: 'low_stock' },
  { id: '3', title: '1984', author: 'George Orwell', isbn: '978-0451524935', quantity: 0, location: 'Fiction C-3', status: 'out_of_stock' },
  { id: '4', title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '978-0316769488', quantity: 7, location: 'Fiction A-5', status: 'available' },
  { id: '5', title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '978-0141439518', quantity: 2, location: 'Fiction B-9', status: 'low_stock' },
  { id: '6', title: 'The Hobbit', author: 'J.R.R. Tolkien', isbn: '978-0547928227', quantity: 4, location: 'Fantasy D-2', status: 'available' },
  { id: '7', title: 'Harry Potter and the Philosopher\'s Stone', author: 'J.K. Rowling', isbn: '978-0439708180', quantity: 1, location: 'Fantasy D-5', status: 'low_stock' },
  { id: '8', title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', isbn: '978-0544003415', quantity: 3, location: 'Fantasy D-3', status: 'low_stock' },
  { id: '9', title: 'Animal Farm', author: 'George Orwell', isbn: '978-0451526342', quantity: 0, location: 'Fiction C-4', status: 'out_of_stock' },
  { id: '10', title: 'Brave New World', author: 'Aldous Huxley', isbn: '978-0060850524', quantity: 6, location: 'Fiction C-7', status: 'available' },
  { id: '11', title: 'The Odyssey', author: 'Homer', isbn: '978-0140268867', quantity: 2, location: 'Classics A-1', status: 'low_stock' },
  { id: '12', title: 'Moby Dick', author: 'Herman Melville', isbn: '978-1503280786', quantity: 4, location: 'Classics A-3', status: 'available' },
];

export const BookInventory: React.FC = () => {
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;

  // New book form state
  const [newBook, setNewBook] = useState<Omit<Book, 'id' | 'status'>>({
    title: '',
    author: '',
    isbn: '',
    quantity: 1,
    location: '',
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.includes(searchTerm)
  );

  // Calculate pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddBook = () => {
    const bookStatus = newBook.quantity === 0 
      ? 'out_of_stock' 
      : newBook.quantity <= 3 
        ? 'low_stock' 
        : 'available';
    
    const newBookWithId: Book = {
      ...newBook,
      id: Date.now().toString(),
      status: bookStatus as any,
    };
    
    setBooks([...books, newBookWithId]);
    setNewBook({
      title: '',
      author: '',
      isbn: '',
      quantity: 1,
      location: '',
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Book Added",
      description: `"${newBook.title}" has been added to the inventory.`,
    });
  };

  const handleEditBook = (book: Book) => {
    setBookToEdit(book);
  };

  const handleUpdateBook = () => {
    if (!bookToEdit) return;

    const updatedBooks = books.map(book => {
      if (book.id === bookToEdit.id) {
        const status = bookToEdit.quantity === 0 
          ? 'out_of_stock' 
          : bookToEdit.quantity <= 3 
            ? 'low_stock' 
            : 'available';
        
        return { ...bookToEdit, status: status as any };
      }
      return book;
    });
    
    setBooks(updatedBooks);
    setBookToEdit(null);
    
    toast({
      title: "Book Updated",
      description: `"${bookToEdit.title}" has been updated.`,
    });
  };

  const handleDeleteBook = (id: string) => {
    const bookToDelete = books.find(book => book.id === id);
    setBooks(books.filter(book => book.id !== id));
    
    toast({
      title: "Book Removed",
      description: `"${bookToDelete?.title}" has been removed from inventory.`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Book Inventory</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Book
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Book</DialogTitle>
              <DialogDescription>
                Enter the details of the new book to add to the inventory.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={newBook.title} 
                  onChange={(e) => setNewBook({...newBook, title: e.target.value})} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="author">Author</Label>
                <Input 
                  id="author" 
                  value={newBook.author} 
                  onChange={(e) => setNewBook({...newBook, author: e.target.value})} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input 
                  id="isbn" 
                  value={newBook.isbn} 
                  onChange={(e) => setNewBook({...newBook, isbn: e.target.value})} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    min="0" 
                    value={newBook.quantity} 
                    onChange={(e) => setNewBook({...newBook, quantity: parseInt(e.target.value) || 0})} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Shelf Location</Label>
                  <Input 
                    id="location" 
                    value={newBook.location} 
                    onChange={(e) => setNewBook({...newBook, location: e.target.value})} 
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddBook} disabled={!newBook.title || !newBook.author}>Add Book</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2 pb-4">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search by title, author or ISBN..." 
          className="max-w-sm" 
          value={searchTerm} 
          onChange={handleSearch}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentBooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No books found.
                </TableCell>
              </TableRow>
            ) : (
              currentBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.isbn}</TableCell>
                  <TableCell>{book.quantity}</TableCell>
                  <TableCell>{book.location}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      book.status === 'available' ? 'bg-green-100 text-green-800' :
                      book.status === 'low_stock' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {book.status === 'available' ? 'Available' :
                       book.status === 'low_stock' ? 'Low Stock' :
                       'Out of Stock'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => handleEditBook(book)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        {bookToEdit && (
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Book</DialogTitle>
                              <DialogDescription>
                                Make changes to the book details.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="edit-title">Title</Label>
                                <Input 
                                  id="edit-title" 
                                  value={bookToEdit.title} 
                                  onChange={(e) => setBookToEdit({...bookToEdit, title: e.target.value})} 
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-author">Author</Label>
                                <Input 
                                  id="edit-author" 
                                  value={bookToEdit.author} 
                                  onChange={(e) => setBookToEdit({...bookToEdit, author: e.target.value})} 
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-isbn">ISBN</Label>
                                <Input 
                                  id="edit-isbn" 
                                  value={bookToEdit.isbn} 
                                  onChange={(e) => setBookToEdit({...bookToEdit, isbn: e.target.value})} 
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-quantity">Quantity</Label>
                                  <Input 
                                    id="edit-quantity" 
                                    type="number" 
                                    min="0" 
                                    value={bookToEdit.quantity} 
                                    onChange={(e) => setBookToEdit({...bookToEdit, quantity: parseInt(e.target.value) || 0})} 
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-location">Shelf Location</Label>
                                  <Input 
                                    id="edit-location" 
                                    value={bookToEdit.location} 
                                    onChange={(e) => setBookToEdit({...bookToEdit, location: e.target.value})} 
                                  />
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setBookToEdit(null)}>Cancel</Button>
                              <Button onClick={handleUpdateBook}>Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        )}
                      </Dialog>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteBook(book.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {filteredBooks.length > 0 && (
        <div className="flex justify-center">
          <DataPagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </div>
      )}
    </div>
  );
};
