
import React, { useState } from 'react';
import { MainLayout, PageHeader } from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookInventory } from '@/components/library/BookInventory';
import { BorrowingSystem } from '@/components/library/BorrowingSystem';
import { LibraryReports } from '@/components/library/LibraryReports';
import { useAuth } from '@/context/AuthContext';

const Library = () => {
  const [activeTab, setActiveTab] = useState<string>('inventory');
  const { user } = useAuth();
  
  return (
    <MainLayout>
      <div className="py-6">
        <PageHeader 
          title="Library Management" 
          description="Manage books, borrowing and view library reports"
        />
        
        <Tabs defaultValue="inventory" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 max-w-md">
            <TabsTrigger value="inventory">Book Inventory</TabsTrigger>
            <TabsTrigger value="borrowing">Borrowing</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="inventory" className="pt-4">
            <BookInventory />
          </TabsContent>
          
          <TabsContent value="borrowing" className="pt-4">
            <BorrowingSystem />
          </TabsContent>
          
          <TabsContent value="reports" className="pt-4">
            <LibraryReports />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Library;
