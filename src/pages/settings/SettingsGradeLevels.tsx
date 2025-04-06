
import React, { useState } from 'react';
import { MainLayout, PageHeader } from '@/components/layout/MainLayout';
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

// Define a type for Grade Level
interface GradeLevel {
  id: number;
  name: string;
  description: string;
  sequence: number;
}

type SortDirection = 'asc' | 'desc' | null;
type SortField = 'name' | 'description' | 'sequence' | null;

// Initial grade levels data
const initialGradeLevels: GradeLevel[] = [
  { id: 1, name: 'Grade 1', description: 'First grade elementary', sequence: 1 },
  { id: 2, name: 'Grade 2', description: 'Second grade elementary', sequence: 2 },
  { id: 3, name: 'Grade 3', description: 'Third grade elementary', sequence: 3 },
  { id: 4, name: 'Grade 4', description: 'Fourth grade elementary', sequence: 4 },
  { id: 5, name: 'Grade 5', description: 'Fifth grade elementary', sequence: 5 },
  { id: 6, name: 'Grade 6', description: 'Sixth grade elementary', sequence: 6 },
  { id: 7, name: 'Grade 7', description: 'First year junior high', sequence: 7 },
  { id: 8, name: 'Grade 8', description: 'Second year junior high', sequence: 8 },
  { id: 9, name: 'Grade 9', description: 'Third year junior high', sequence: 9 },
  { id: 10, name: 'Grade 10', description: 'Fourth year junior high', sequence: 10 },
  { id: 11, name: 'Grade 11', description: 'First year senior high', sequence: 11 },
  { id: 12, name: 'Grade 12', description: 'Second year senior high', sequence: 12 },
];

// Create context to share grade levels across components
export const GradeLevelsContext = React.createContext<{
  gradeLevels: GradeLevel[];
  setGradeLevels: React.Dispatch<React.SetStateAction<GradeLevel[]>>;
}>({
  gradeLevels: initialGradeLevels,
  setGradeLevels: () => {},
});

export const useGradeLevels = () => React.useContext(GradeLevelsContext);

export const GradeLevelsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Initialize from localStorage if available
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>(() => {
    const savedGradeLevels = localStorage.getItem('gradeLevels');
    return savedGradeLevels ? JSON.parse(savedGradeLevels) : initialGradeLevels;
  });

  // Update localStorage when gradeLevels change
  React.useEffect(() => {
    localStorage.setItem('gradeLevels', JSON.stringify(gradeLevels));
  }, [gradeLevels]);

  return (
    <GradeLevelsContext.Provider value={{ gradeLevels, setGradeLevels }}>
      {children}
    </GradeLevelsContext.Provider>
  );
};

const SettingsGradeLevels = () => {
  const { gradeLevels, setGradeLevels } = useGradeLevels();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGradeId, setEditingGradeId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sequence: 0
  });
  const [sortField, setSortField] = useState<SortField>('sequence');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  const { toast } = useToast();

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedGradeLevels = React.useMemo(() => {
    if (!sortField || !sortDirection) return gradeLevels;
    
    return [...gradeLevels].sort((a, b) => {
      let aValue, bValue;
      
      if (sortField === 'sequence') {
        aValue = a[sortField];
        bValue = b[sortField];
      } else {
        aValue = String(a[sortField]).toLowerCase();
        bValue = String(b[sortField]).toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  }, [gradeLevels, sortField, sortDirection]);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    
    return sortDirection === 'asc' 
      ? <ArrowUp className="ml-2 h-4 w-4" /> 
      : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const handleEditGradeLevel = (gradeLevel: GradeLevel) => {
    setFormData({
      name: gradeLevel.name,
      description: gradeLevel.description,
      sequence: gradeLevel.sequence
    });
    setEditingGradeId(gradeLevel.id);
    setIsDialogOpen(true);
  };

  const handleAddNewGradeLevel = () => {
    // Set next sequence number
    const nextSequence = gradeLevels.length > 0 
      ? Math.max(...gradeLevels.map(g => g.sequence)) + 1 
      : 1;
      
    setFormData({
      name: '',
      description: '',
      sequence: nextSequence
    });
    setEditingGradeId(null);
    setIsDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'sequence' ? Number(value) : value 
    }));
  };

  const handleSubmit = () => {
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Please fill in the grade level name",
        variant: "destructive"
      });
      return;
    }

    if (editingGradeId) {
      // Update existing grade level
      setGradeLevels(gradeLevels.map(grade => 
        grade.id === editingGradeId 
          ? { ...grade, ...formData } 
          : grade
      ));
      
      toast({
        title: "Success",
        description: "Grade level updated successfully"
      });
    } else {
      // Add new grade level
      const newGradeLevel = {
        id: Math.max(0, ...gradeLevels.map(g => g.id)) + 1,
        ...formData
      };
      
      setGradeLevels([...gradeLevels, newGradeLevel]);
      
      toast({
        title: "Success",
        description: "New grade level added successfully"
      });
    }

    setIsDialogOpen(false);
  };

  const handleDeleteGradeLevel = (id: number) => {
    setGradeLevels(gradeLevels.filter(grade => grade.id !== id));
    
    toast({
      title: "Success",
      description: "Grade level deleted successfully"
    });
  };

  return (
    <MainLayout>
      <PageHeader 
        title="Manage Grade Levels" 
        description="Add, edit or remove grade levels for your school"
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Grade Levels</CardTitle>
            <CardDescription>
              Define the grade levels used throughout the system
            </CardDescription>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNewGradeLevel}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Grade Level
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingGradeId ? 'Edit Grade Level' : 'Add New Grade Level'}</DialogTitle>
                <DialogDescription>
                  {editingGradeId 
                    ? 'Update the details of this grade level.' 
                    : 'Create a new grade level by filling in the details below.'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Grade Name</Label>
                  <Input 
                    id="name" 
                    name="name"
                    value={formData.name} 
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="e.g., Grade 1"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Input 
                    id="description" 
                    name="description"
                    value={formData.description} 
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="e.g., First grade elementary"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sequence" className="text-right">Sequence</Label>
                  <Input 
                    id="sequence" 
                    name="sequence"
                    type="number"
                    value={formData.sequence} 
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmit}>{editingGradeId ? 'Update' : 'Add'} Grade Level</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableCaption>A list of all grade levels</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/30 transition-colors" 
                  onClick={() => handleSort('sequence')}
                >
                  <div className="flex items-center">
                    Sequence
                    {renderSortIcon('sequence')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/30 transition-colors" 
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Grade Name
                    {renderSortIcon('name')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/30 transition-colors" 
                  onClick={() => handleSort('description')}
                >
                  <div className="flex items-center">
                    Description
                    {renderSortIcon('description')}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedGradeLevels.length > 0 ? (
                sortedGradeLevels.map((gradeLevel) => (
                  <TableRow key={gradeLevel.id}>
                    <TableCell>{gradeLevel.sequence}</TableCell>
                    <TableCell className="font-medium">{gradeLevel.name}</TableCell>
                    <TableCell>{gradeLevel.description}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditGradeLevel(gradeLevel)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteGradeLevel(gradeLevel.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No grade levels found. Click "Add Grade Level" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default SettingsGradeLevels;
