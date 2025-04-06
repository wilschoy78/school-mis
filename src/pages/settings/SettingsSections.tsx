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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGradeLevels } from './SettingsGradeLevels';

// Initial sections data
const initialSections = [
  { id: 1, name: 'Grade 1 - Rose', grade: 'Grade 1', capacity: 30, adviser: 'Ms. Jane Smith' },
  { id: 2, name: 'Grade 1 - Daisy', grade: 'Grade 1', capacity: 30, adviser: 'Mr. John Doe' },
  { id: 3, name: 'Grade 2 - Lily', grade: 'Grade 2', capacity: 35, adviser: 'Ms. Mary Johnson' },
  { id: 4, name: 'Grade 3 - Tulip', grade: 'Grade 3', capacity: 35, adviser: 'Mr. Robert Brown' },
];

// Define a type for Section
interface Section {
  id: number;
  name: string;
  grade: string;
  capacity: number;
  adviser: string;
}

type SortDirection = 'asc' | 'desc' | null;
type SortField = 'name' | 'grade' | 'capacity' | 'adviser' | null;

const SettingsSections = () => {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    capacity: 30,
    adviser: ''
  });
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  
  const { toast } = useToast();
  const { gradeLevels } = useGradeLevels();

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

  const sortedSections = React.useMemo(() => {
    if (!sortField || !sortDirection) return sections;
    
    return [...sections].sort((a, b) => {
      let aValue, bValue;
      
      if (sortField === 'capacity') {
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
  }, [sections, sortField, sortDirection]);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    
    return sortDirection === 'asc' 
      ? <ArrowUp className="ml-2 h-4 w-4" /> 
      : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const handleEditSection = (section: Section) => {
    setFormData({
      name: section.name,
      grade: section.grade,
      capacity: section.capacity,
      adviser: section.adviser
    });
    setEditingSectionId(section.id);
    setIsDialogOpen(true);
  };

  const handleAddNewSection = () => {
    setFormData({
      name: '',
      grade: '',
      capacity: 30,
      adviser: ''
    });
    setEditingSectionId(null);
    setIsDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'capacity' ? Number(value) : value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.grade) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (editingSectionId) {
      // Update existing section
      setSections(sections.map(section => 
        section.id === editingSectionId 
          ? { ...section, ...formData } 
          : section
      ));
      
      toast({
        title: "Success",
        description: "Section updated successfully"
      });
    } else {
      // Add new section
      const newSection = {
        id: Math.max(0, ...sections.map(s => s.id)) + 1,
        ...formData
      };
      
      setSections([...sections, newSection]);
      
      toast({
        title: "Success",
        description: "New section added successfully"
      });
    }

    setIsDialogOpen(false);
  };

  const handleDeleteSection = (id: number) => {
    setSections(sections.filter(section => section.id !== id));
    
    toast({
      title: "Success",
      description: "Section deleted successfully"
    });
  };

  const sortedGradeLevels = [...gradeLevels].sort((a, b) => a.sequence - b.sequence);

  return (
    <MainLayout>
      <PageHeader 
        title="Manage Sections" 
        description="Add, edit or remove class sections"
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Class Sections</CardTitle>
            <CardDescription>
              Organize students into different class sections
            </CardDescription>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNewSection}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Section
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingSectionId ? 'Edit Section' : 'Add New Section'}</DialogTitle>
                <DialogDescription>
                  {editingSectionId 
                    ? 'Update the details of this section.' 
                    : 'Create a new class section by filling in the details below.'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Section Name</Label>
                  <Input 
                    id="name" 
                    name="name"
                    value={formData.name} 
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="e.g., Grade 1 - Rose"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="grade" className="text-right">Grade Level</Label>
                  <Select
                    value={formData.grade}
                    onValueChange={(value) => handleSelectChange('grade', value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select grade level" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortedGradeLevels.map((grade) => (
                        <SelectItem key={grade.id} value={grade.name}>
                          {grade.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="capacity" className="text-right">Capacity</Label>
                  <Input 
                    id="capacity" 
                    name="capacity"
                    type="number"
                    value={formData.capacity} 
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="adviser" className="text-right">Class Adviser</Label>
                  <Input 
                    id="adviser" 
                    name="adviser"
                    value={formData.adviser} 
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="e.g., Ms. Jane Smith"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmit}>{editingSectionId ? 'Update' : 'Add'} Section</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableCaption>A list of all class sections</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/30 transition-colors" 
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Section Name
                    {renderSortIcon('name')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/30 transition-colors" 
                  onClick={() => handleSort('grade')}
                >
                  <div className="flex items-center">
                    Grade Level
                    {renderSortIcon('grade')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/30 transition-colors" 
                  onClick={() => handleSort('capacity')}
                >
                  <div className="flex items-center">
                    Capacity
                    {renderSortIcon('capacity')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/30 transition-colors" 
                  onClick={() => handleSort('adviser')}
                >
                  <div className="flex items-center">
                    Class Adviser
                    {renderSortIcon('adviser')}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSections.length > 0 ? (
                sortedSections.map((section) => (
                  <TableRow key={section.id}>
                    <TableCell className="font-medium">{section.name}</TableCell>
                    <TableCell>{section.grade}</TableCell>
                    <TableCell>{section.capacity}</TableCell>
                    <TableCell>{section.adviser}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditSection(section)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteSection(section.id)}
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
                  <TableCell colSpan={5} className="h-24 text-center">
                    No sections found. Click "Add Section" to create one.
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

export default SettingsSections;
