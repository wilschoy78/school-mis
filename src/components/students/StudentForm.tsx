
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogFooter } from '@/components/ui/dialog';

export type StudentFormData = {
  firstName: string;
  lastName: string;
  middleName: string;
  suffix: string;
  grade: string;
  section: string;
  gender: string;
  birthdate: Date;
  age: string;
  address: string;
  email: string;
  contact: string;
  guardianName: string;
  guardianContact: string;
};

// Updated to match the type in SettingsGradeLevels.tsx
type GradeLevel = {
  id: number;
  name: string;
  sequence: number;
};

interface StudentFormProps {
  formData: StudentFormData;
  gradeLevels: GradeLevel[];
  selectedStudentId: string | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateChange: (date: Date, field: string) => void;
  onSelectChange: (name: string, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({
  formData,
  gradeLevels,
  selectedStudentId,
  onInputChange,
  onDateChange,
  onSelectChange,
  onSave,
  onCancel
}) => {
  const [activeTab, setActiveTab] = useState("basic");
  const sortedGradeLevels = [...gradeLevels].sort((a, b) => a.sequence - b.sequence);

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="contact">Contact Information</TabsTrigger>
          <TabsTrigger value="guardian">Guardian Information</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">First Name*</Label>
              <Input 
                id="firstName" 
                name="firstName" 
                value={formData.firstName} 
                onChange={onInputChange} 
                className="col-span-3" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">Last Name*</Label>
              <Input 
                id="lastName" 
                name="lastName" 
                value={formData.lastName} 
                onChange={onInputChange} 
                className="col-span-3" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="middleName" className="text-right">Middle Name</Label>
              <Input 
                id="middleName" 
                name="middleName" 
                value={formData.middleName} 
                onChange={onInputChange} 
                className="col-span-3" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="suffix" className="text-right">Suffix</Label>
              <Input 
                id="suffix" 
                name="suffix" 
                value={formData.suffix} 
                onChange={onInputChange} 
                className="col-span-3" 
                placeholder="Jr., Sr., III, etc."
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gender" className="text-right">Gender*</Label>
              <Select 
                value={formData.gender} 
                onValueChange={(value) => onSelectChange('gender', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="birthdate" className="text-right">Birthdate</Label>
              <Input 
                id="birthdate" 
                name="birthdate" 
                type="date"
                value={formData.birthdate ? format(new Date(formData.birthdate), 'yyyy-MM-dd') : ''}
                onChange={(e) => onDateChange(new Date(e.target.value), 'birthdate')}
                className="col-span-3" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="age" className="text-right">Age</Label>
              <Input 
                id="age" 
                name="age" 
                value={formData.age} 
                onChange={onInputChange} 
                className="col-span-3"
                type="number"
                min="0"
                readOnly
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="grade" className="text-right">Grade*</Label>
              <Select 
                value={formData.grade} 
                onValueChange={(value) => onSelectChange('grade', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select grade" />
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
              <Label htmlFor="section" className="text-right">Section*</Label>
              <Select 
                value={formData.section} 
                onValueChange={(value) => onSelectChange('section', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Section A</SelectItem>
                  <SelectItem value="B">Section B</SelectItem>
                  <SelectItem value="C">Section C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="contact" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">Address</Label>
              <Input 
                id="address" 
                name="address" 
                value={formData.address} 
                onChange={onInputChange} 
                className="col-span-3" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email"
                value={formData.email} 
                onChange={onInputChange} 
                className="col-span-3" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact" className="text-right">Contact Number</Label>
              <Input 
                id="contact" 
                name="contact" 
                value={formData.contact} 
                onChange={onInputChange} 
                className="col-span-3" 
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="guardian" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="guardianName" className="text-right">Guardian Name</Label>
              <Input 
                id="guardianName" 
                name="guardianName" 
                value={formData.guardianName} 
                onChange={onInputChange} 
                className="col-span-3" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="guardianContact" className="text-right">Guardian Contact</Label>
              <Input 
                id="guardianContact" 
                name="guardianContact" 
                value={formData.guardianContact} 
                onChange={onInputChange} 
                className="col-span-3" 
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave}>Save</Button>
      </DialogFooter>
    </>
  );
};

export default StudentForm;
