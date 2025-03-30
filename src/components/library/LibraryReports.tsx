
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for reports
const inventoryData = [
  { category: 'Fiction', count: 145 },
  { category: 'Science', count: 98 },
  { category: 'History', count: 76 },
  { category: 'Biography', count: 52 },
  { category: 'Reference', count: 38 },
  { category: 'Textbooks', count: 120 },
];

const borrowingData = [
  { month: 'Jan', count: 35 },
  { month: 'Feb', count: 42 },
  { month: 'Mar', count: 58 },
  { month: 'Apr', count: 49 },
  { month: 'May', count: 63 },
  { month: 'Jun', count: 47 },
];

const bookStatusData = [
  { name: 'Available', value: 420 },
  { name: 'Borrowed', value: 87 },
  { name: 'Overdue', value: 23 },
  { name: 'Maintenance', value: 12 },
];

const COLORS = ['#4CAF50', '#2196F3', '#FF5722', '#9E9E9E'];

interface Statistic {
  label: string;
  value: string | number;
  percentage?: number;
  increasedFrom?: string | number;
}

const statisticsData: Statistic[] = [
  {
    label: 'Total Books',
    value: 542,
    percentage: 8,
    increasedFrom: 501,
  },
  {
    label: 'Books Borrowed This Month',
    value: 87,
    percentage: 12,
    increasedFrom: 78,
  },
  {
    label: 'Active Borrowers',
    value: 132,
    percentage: 5,
    increasedFrom: 125,
  },
  {
    label: 'Overdue Books',
    value: 23,
    percentage: -15,
    increasedFrom: 27,
  },
];

interface TopBookData {
  title: string;
  author: string;
  borrowCount: number;
}

const topBooksData: TopBookData[] = [
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', borrowCount: 28 },
  { title: '1984', author: 'George Orwell', borrowCount: 24 },
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', borrowCount: 19 },
  { title: 'Pride and Prejudice', author: 'Jane Austen', borrowCount: 17 },
  { title: 'The Catcher in the Rye', author: 'J.D. Salinger', borrowCount: 15 },
];

export const LibraryReports: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Library Reports</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statisticsData.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardDescription>{stat.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.percentage !== undefined && (
                  <div className={`text-sm flex items-center ${stat.percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.percentage >= 0 ? '↑' : '↓'} {Math.abs(stat.percentage)}%
                    <span className="text-muted-foreground ml-1">from {stat.increasedFrom}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Borrowing Trends</CardTitle>
            <CardDescription>Number of books borrowed per month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={borrowingData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value} books`, 'Borrowed']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="count" name="Books Borrowed" fill="#2196F3" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Book Status Distribution</CardTitle>
            <CardDescription>Current status of all library books</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {bookStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} books`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Books by Category</CardTitle>
            <CardDescription>Distribution of books across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={inventoryData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" width={100} />
                  <Tooltip
                    formatter={(value) => [`${value} books`, 'Count']}
                    labelFormatter={(label) => `Category: ${label}`}
                  />
                  <Bar dataKey="count" name="Number of Books" fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Borrowed Books</CardTitle>
            <CardDescription>Most popular books in the library</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] overflow-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-medium p-2">Title</th>
                    <th className="text-left font-medium p-2">Author</th>
                    <th className="text-right font-medium p-2">Borrowed</th>
                  </tr>
                </thead>
                <tbody>
                  {topBooksData.map((book, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="p-2">{book.title}</td>
                      <td className="p-2 text-muted-foreground">{book.author}</td>
                      <td className="p-2 text-right">
                        <span className="font-medium">{book.borrowCount}</span>
                        <span className="text-xs text-muted-foreground"> times</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
