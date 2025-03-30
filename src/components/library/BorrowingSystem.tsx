
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, BookOpen, CheckCircle, CalendarX } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";
import { format, addDays, isAfter } from 'date-fns';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  available: number;
}

interface BorrowRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  studentId: string;
  studentName: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate: Date | null;
  status: 'borrowed' | 'returned' | 'overdue';
}

// Mock data for books
const mockBooks: Book[] = [
  { id: '1', title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0446310789', available: 3 },
  { id: '2', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0743273565', available: 2 },
  { id: '3', title: '1984', author: 'George Orwell', isbn: '978-0451524935', available: 0 },
  { id: '4', title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '978-0316769488', available: 5 },
  { id: '5', title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '978-0141439518', available: 1 },
];

// Mock data for students
const mockStudents = [
  { id: 'S001', name: 'John Smith' },
  { id: 'S002', name: 'Maria Garcia' },
  { id: 'S003', name: 'David Johnson' },
  { id: 'S004', name: 'Emily Wilson' },
  { id: 'S005', name: 'Michael Brown' },
];

// Mock data for borrow records
const mockBorrowRecords: BorrowRecord[] = [
  {
    id: 'B001',
    bookId: '1',
    bookTitle: 'To Kill a Mockingbird',
    studentId: 'S001',
    studentName: 'John Smith',
    borrowDate: new Date('2023-04-15'),
    dueDate: new Date('2023-04-29'),
    returnDate: new Date('2023-04-25'),
    status: 'returned'
  },
  {
    id: 'B002',
    bookId: '2',
    bookTitle: 'The Great Gatsby',
    studentId: 'S002',
    studentName: 'Maria Garcia',
    borrowDate: new Date('2023-04-20'),
    dueDate: new Date('2023-05-04'),
    returnDate: null,
    status: 'borrowed'
  },
  {
    id: 'B003',
    bookId: '4',
    bookTitle: 'The Catcher in the Rye',
    studentId: 'S003',
    studentName: 'David Johnson',
    borrowDate: new Date('2023-04-01'),
    dueDate: new Date('2023-04-15'),
    returnDate: null,
    status: 'overdue'
  },
];

export const BorrowingSystem: React.FC = () => {
  const [books] = useState<Book[]>(mockBooks);
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>(mockBorrowRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<string>('borrowed');
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const { toast } = useToast();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredRecords = borrowRecords.filter(record => {
    const matchesSearch = record.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.studentId.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (selectedTab === 'all') return matchesSearch;
    return matchesSearch && record.status === selectedTab;
  });

  const handleCheckout = () => {
    const book = books.find(b => b.id === selectedBook);
    const student = mockStudents.find(s => s.id === selectedStudent);
    
    if (!book || !student) return;
    
    // Check if book is available
    if (book.available <= 0) {
      toast({
        title: "Checkout Failed",
        description: `"${book.title}" is not available for checkout.`,
        variant: "destructive",
      });
      return;
    }
    
    const today = new Date();
    const dueDate = addDays(today, 14); // 2 weeks loan period
    
    const newRecord: BorrowRecord = {
      id: `B${Date.now().toString().slice(-3)}`,
      bookId: book.id,
      bookTitle: book.title,
      studentId: student.id,
      studentName: student.name,
      borrowDate: today,
      dueDate: dueDate,
      returnDate: null,
      status: 'borrowed'
    };
    
    setBorrowRecords([...borrowRecords, newRecord]);
    setIsCheckoutDialogOpen(false);
    setSelectedBook('');
    setSelectedStudent('');
    
    toast({
      title: "Book Checked Out",
      description: `"${book.title}" has been checked out to ${student.name}.`,
    });
  };

  const handleReturn = (recordId: string) => {
    const updatedRecords = borrowRecords.map(record => {
      if (record.id === recordId) {
        return { ...record, returnDate: new Date(), status: 'returned' as const };
      }
      return record;
    });
    
    setBorrowRecords(updatedRecords);
    
    const record = borrowRecords.find(r => r.id === recordId);
    
    toast({
      title: "Book Returned",
      description: `"${record?.bookTitle}" has been returned by ${record?.studentName}.`,
    });
  };

  const updateOverdueStatus = () => {
    const today = new Date();
    const updatedRecords = borrowRecords.map(record => {
      if (record.status === 'borrowed' && isAfter(today, record.dueDate)) {
        return { ...record, status: 'overdue' as const };
      }
      return record;
    });
    
    setBorrowRecords(updatedRecords);
  };

  // Check for overdue books
  React.useEffect(() => {
    updateOverdueStatus();
    // Update status every day
    const intervalId = setInterval(updateOverdueStatus, 86400000);
    return () => clearInterval(intervalId);
  }, [borrowRecords]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Borrowing System</h2>
        <Dialog open={isCheckoutDialogOpen} onOpenChange={setIsCheckoutDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <BookOpen className="mr-2 h-4 w-4" />
              Checkout Book
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Checkout Book</DialogTitle>
              <DialogDescription>
                Select a book and student to complete checkout.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="book">Select Book</Label>
                <select 
                  id="book"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                >
                  <option value="">-- Select a book --</option>
                  {books.filter(book => book.available > 0).map(book => (
                    <option key={book.id} value={book.id}>
                      {book.title} by {book.author} ({book.available} available)
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="student">Select Student</Label>
                <select 
                  id="student"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                >
                  <option value="">-- Select a student --</option>
                  {mockStudents.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.id})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Loan Period</Label>
                <div className="text-sm">14 days (standard)</div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCheckoutDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleCheckout}
                disabled={!selectedBook || !selectedStudent}
              >
                Checkout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search by book title, student name or ID..." 
            className="max-w-sm" 
            value={searchTerm} 
            onChange={handleSearch}
          />
        </div>

        <Tabs defaultValue="borrowed" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="all">All Records</TabsTrigger>
            <TabsTrigger value="borrowed">Borrowed</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
            <TabsTrigger value="returned">Returned</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book Title</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Borrow Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No records found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.bookTitle}</TableCell>
                    <TableCell>
                      {record.studentName}
                      <div className="text-xs text-muted-foreground">{record.studentId}</div>
                    </TableCell>
                    <TableCell>{format(record.borrowDate, 'MMM d, yyyy')}</TableCell>
                    <TableCell>{format(record.dueDate, 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      {record.returnDate ? format(record.returnDate, 'MMM d, yyyy') : '-'}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.status === 'borrowed' ? 'bg-blue-100 text-blue-800' :
                        record.status === 'returned' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {record.status === 'borrowed' ? 'Borrowed' :
                         record.status === 'returned' ? 'Returned' :
                         'Overdue'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {(record.status === 'borrowed' || record.status === 'overdue') && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center space-x-1"
                          onClick={() => handleReturn(record.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Return</span>
                        </Button>
                      )}
                      {record.status === 'overdue' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="flex items-center space-x-1 text-red-600 mt-1"
                        >
                          <CalendarX className="h-4 w-4" />
                          <span>Send Reminder</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
