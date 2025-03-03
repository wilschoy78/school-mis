
import React, { useState } from 'react';
import { MainLayout, PageHeader } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Search, Pencil, Receipt, ArrowUp, ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const accountsData = [
  { 
    id: '1', 
    studentName: 'John Doe', 
    studentId: 'S001', 
    transactionType: 'Payment', 
    amount: 500, 
    date: new Date(2023, 8, 15), 
    category: 'Tuition Fee',
    paymentMethod: 'Card',
    status: 'Completed'
  },
  { 
    id: '2', 
    studentName: 'Jane Smith', 
    studentId: 'S002', 
    transactionType: 'Payment', 
    amount: 750, 
    date: new Date(2023, 8, 12), 
    category: 'Tuition Fee',
    paymentMethod: 'Cash',
    status: 'Completed'
  },
  { 
    id: '3', 
    studentName: 'Michael Johnson', 
    studentId: 'S003', 
    transactionType: 'Refund', 
    amount: 200, 
    date: new Date(2023, 8, 20), 
    category: 'Lab Fee',
    paymentMethod: 'Bank Transfer',
    status: 'Pending'
  },
  { 
    id: '4', 
    studentName: 'Emily Brown', 
    studentId: 'S004', 
    transactionType: 'Payment', 
    amount: 1200, 
    date: new Date(2023, 8, 5), 
    category: 'Annual Fee',
    paymentMethod: 'Card',
    status: 'Completed'
  },
];

const AccountsPage = () => {
  const [transactions, setTransactions] = useState(accountsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    transactionType: 'Payment',
    amount: '',
    category: '',
    paymentMethod: '',
    status: 'Pending'
  });
  const { toast } = useToast();

  const filteredTransactions = transactions.filter(transaction => 
    transaction.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTransaction = () => {
    // Validate form
    if (!formData.studentName || !formData.studentId || !formData.amount || !formData.category || !formData.paymentMethod) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    // Validate amount
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    if (selectedTransaction) {
      // Update existing transaction
      const updatedTransactions = transactions.map(transaction => 
        transaction.id === selectedTransaction.id 
          ? { 
              ...transaction, 
              ...formData,
              amount: parseFloat(formData.amount),
              date: transaction.date // Keep the original date
            } 
          : transaction
      );
      setTransactions(updatedTransactions);
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
    } else {
      // Add new transaction
      const newTransaction = {
        id: (transactions.length + 1).toString(),
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date() // Current date
      };
      setTransactions([...transactions, newTransaction]);
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
    }
    
    // Reset form and close dialog
    setFormData({
      studentName: '',
      studentId: '',
      transactionType: 'Payment',
      amount: '',
      category: '',
      paymentMethod: '',
      status: 'Pending'
    });
    setSelectedTransaction(null);
    setIsAddDialogOpen(false);
  };

  const handleEditTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setFormData({
      studentName: transaction.studentName,
      studentId: transaction.studentId,
      transactionType: transaction.transactionType,
      amount: transaction.amount.toString(),
      category: transaction.category,
      paymentMethod: transaction.paymentMethod,
      status: transaction.status
    });
    setIsAddDialogOpen(true);
  };

  const getStatusBadge = (status) => {
    if (status === 'Completed') {
      return <Badge className="bg-green-500">Completed</Badge>;
    } else if (status === 'Pending') {
      return <Badge className="bg-yellow-500">Pending</Badge>;
    } else {
      return <Badge className="bg-red-500">Failed</Badge>;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <MainLayout>
      <PageHeader 
        title="Accounts" 
        description="Manage financial transactions and payments"
      />
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search transactions..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedTransaction ? 'Edit Transaction' : 'New Transaction'}</DialogTitle>
              <DialogDescription>
                Enter the transaction details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="studentName" className="text-right">Student Name</Label>
                <Input 
                  id="studentName" 
                  name="studentName" 
                  value={formData.studentName} 
                  onChange={handleInputChange} 
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="studentId" className="text-right">Student ID</Label>
                <Input 
                  id="studentId" 
                  name="studentId" 
                  value={formData.studentId} 
                  onChange={handleInputChange} 
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="transactionType" className="text-right">Type</Label>
                <Select 
                  value={formData.transactionType} 
                  onValueChange={(value) => handleSelectChange('transactionType', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Payment">Payment</SelectItem>
                    <SelectItem value="Refund">Refund</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">Amount</Label>
                <Input 
                  id="amount" 
                  name="amount" 
                  value={formData.amount} 
                  onChange={handleInputChange} 
                  type="number"
                  min="0"
                  step="0.01"
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tuition Fee">Tuition Fee</SelectItem>
                    <SelectItem value="Lab Fee">Lab Fee</SelectItem>
                    <SelectItem value="Library Fee">Library Fee</SelectItem>
                    <SelectItem value="Annual Fee">Annual Fee</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="paymentMethod" className="text-right">Payment Method</Label>
                <Select 
                  value={formData.paymentMethod} 
                  onValueChange={(value) => handleSelectChange('paymentMethod', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsAddDialogOpen(false);
                setSelectedTransaction(null);
                setFormData({
                  studentName: '',
                  studentId: '',
                  transactionType: 'Payment',
                  amount: '',
                  category: '',
                  paymentMethod: '',
                  status: 'Pending'
                });
              }}>
                Cancel
              </Button>
              <Button onClick={handleAddTransaction}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableCaption>Financial transactions history</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.studentName}</TableCell>
                  <TableCell>{transaction.studentId}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {transaction.transactionType === 'Payment' ? (
                        <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      {transaction.transactionType}
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{format(transaction.date, 'MMM d, yyyy')}</TableCell>
                  <TableCell>{transaction.paymentMethod}</TableCell>
                  <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEditTransaction(transaction)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Receipt className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </MainLayout>
  );
};

export default AccountsPage;
