
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { PlusCircle, FileText, X, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { DocumentUploader } from './DocumentUploader';

const initialRequirements = [
  { 
    id: '1', 
    name: 'Birth Certificate', 
    description: 'Original or certified true copy of birth certificate',
    required: true,
    fileTypes: ['.pdf', '.jpg', '.png'],
    maxSize: 5,
  },
  { 
    id: '2', 
    name: 'Report Card', 
    description: 'Previous academic year report card',
    required: true,
    fileTypes: ['.pdf'],
    maxSize: 5,
  },
  { 
    id: '3', 
    name: 'Medical Certificate', 
    description: 'Medical clearance certificate',
    required: true,
    fileTypes: ['.pdf', '.jpg', '.png'],
    maxSize: 5,
  },
  { 
    id: '4', 
    name: 'Good Moral Certificate', 
    description: 'Good moral character certification from previous school',
    required: false,
    fileTypes: ['.pdf', '.jpg', '.png'],
    maxSize: 5,
  }
];

export const DocumentRequirements = ({ studentId }) => {
  const [requirements, setRequirements] = useState(initialRequirements);
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    required: true,
    fileTypes: '.pdf,.jpg,.png',
    maxSize: 5
  });
  const { toast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name, checked) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleAddRequirement = () => {
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Please provide a requirement name",
        variant: "destructive"
      });
      return;
    }

    const fileTypesArray = formData.fileTypes.split(',').map(type => type.trim());

    if (selectedRequirement) {
      const updatedRequirements = requirements.map(req => 
        req.id === selectedRequirement.id 
          ? { 
              ...req, 
              name: formData.name,
              description: formData.description,
              required: formData.required,
              fileTypes: fileTypesArray,
              maxSize: Number(formData.maxSize)
            } 
          : req
      );
      setRequirements(updatedRequirements);
      toast({
        title: "Success",
        description: "Document requirement updated successfully",
      });
    } else {
      const newRequirement = {
        id: (requirements.length + 1).toString(),
        name: formData.name,
        description: formData.description,
        required: formData.required,
        fileTypes: fileTypesArray,
        maxSize: Number(formData.maxSize)
      };
      setRequirements([...requirements, newRequirement]);
      toast({
        title: "Success",
        description: "Document requirement added successfully",
      });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      required: true,
      fileTypes: '.pdf,.jpg,.png',
      maxSize: 5
    });
    setSelectedRequirement(null);
    setIsAddDialogOpen(false);
  };

  const handleEdit = (requirement) => {
    setSelectedRequirement(requirement);
    setFormData({
      name: requirement.name,
      description: requirement.description,
      required: requirement.required,
      fileTypes: requirement.fileTypes.join(','),
      maxSize: requirement.maxSize
    });
    setIsAddDialogOpen(true);
  };

  const handleUpload = (requirement) => {
    setSelectedRequirement(requirement);
    setUploaderOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Document Requirements</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Requirement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedRequirement ? 'Edit Requirement' : 'Add Requirement'}</DialogTitle>
              <DialogDescription>
                Define document requirements for enrollment
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  className="col-span-3" 
                  placeholder="Birth Certificate"
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
                  placeholder="Original or certified true copy"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fileTypes" className="text-right">File Types</Label>
                <Input 
                  id="fileTypes" 
                  name="fileTypes" 
                  value={formData.fileTypes} 
                  onChange={handleInputChange} 
                  className="col-span-3" 
                  placeholder=".pdf,.jpg,.png"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maxSize" className="text-right">Max Size (MB)</Label>
                <Input 
                  id="maxSize" 
                  name="maxSize" 
                  type="number" 
                  value={formData.maxSize} 
                  onChange={handleInputChange} 
                  className="col-span-3" 
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Required</Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Checkbox 
                    id="required"
                    checked={formData.required}
                    onCheckedChange={(checked) => handleCheckboxChange('required', checked)}
                  />
                  <Label htmlFor="required">Mark as required</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
              <Button onClick={handleAddRequirement}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableCaption>List of document requirements for enrollment</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Requirement</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>File Types</TableHead>
            <TableHead>Max Size</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requirements.length > 0 ? (
            requirements.map((requirement) => (
              <TableRow key={requirement.id}>
                <TableCell className="font-medium">{requirement.name}</TableCell>
                <TableCell>{requirement.description}</TableCell>
                <TableCell>
                  {requirement.required ? 
                    <Badge className="bg-red-500">Required</Badge> : 
                    <Badge className="bg-blue-500">Optional</Badge>
                  }
                </TableCell>
                <TableCell>{requirement.fileTypes.join(', ')}</TableCell>
                <TableCell>{requirement.maxSize} MB</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(requirement)}>
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleUpload(requirement)}>
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                No requirements found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DocumentUploader 
        open={uploaderOpen} 
        setOpen={setUploaderOpen}
        requirement={selectedRequirement}
        studentId={studentId}
      />
    </div>
  );
};
