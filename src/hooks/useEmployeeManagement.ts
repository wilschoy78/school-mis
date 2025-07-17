import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  Position,
  Department,
  CreatePositionData,
  CreateDepartmentData,
  EmployeeFormData,
  EmployeeStats,
  EmployeeFilters,
} from '../types/employee';
import { User } from '../types/auth';
import { positionService, departmentService, employeeService } from '../services/employeeService';

const ITEMS_PER_PAGE = 10;

export const useEmployeeManagement = () => {
  // Employee state
  const [employees, setEmployees] = useState<User[]>([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [employeeStats, setEmployeeStats] = useState<EmployeeStats | null>(null);
  const [isEmployeesLoading, setIsEmployeesLoading] = useState(false);
  const [employeesError, setEmployeesError] = useState<string | null>(null);

  // Position state
  const [positions, setPositions] = useState<Position[]>([]);
  const [isPositionsLoading, setIsPositionsLoading] = useState(false);
  const [positionsError, setPositionsError] = useState<string | null>(null);

  // Department state
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isDepartmentsLoading, setIsDepartmentsLoading] = useState(false);
  const [departmentsError, setDepartmentsError] = useState<string | null>(null);

  // Filters and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedPosition, setSelectedPosition] = useState<string>('');

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPositionDialogOpen, setIsPositionDialogOpen] = useState(false);
  const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [selectedPositionForEdit, setSelectedPositionForEdit] = useState<Position | null>(null);
  const [selectedDepartmentForEdit, setSelectedDepartmentForEdit] = useState<Department | null>(null);

  // Fetch employees
  const fetchEmployees = useCallback(async () => {
    setIsEmployeesLoading(true);
    setEmployeesError(null);
    try {
      const filters: EmployeeFilters = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchTerm || undefined,
        department: selectedDepartment || undefined,
        position: selectedPosition || undefined,
      };
      const response = await employeeService.getEmployees(filters);
      setEmployees(response.users);
      setTotalEmployees(response.total);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch employees';
      setEmployeesError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsEmployeesLoading(false);
    }
  }, [currentPage, searchTerm, selectedDepartment, selectedPosition]);

  // Fetch positions
  const fetchPositions = useCallback(async () => {
    setIsPositionsLoading(true);
    setPositionsError(null);
    try {
      const data = await positionService.getPositions(undefined, true);
      setPositions(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch positions';
      setPositionsError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsPositionsLoading(false);
    }
  }, []);

  // Fetch departments
  const fetchDepartments = useCallback(async () => {
    setIsDepartmentsLoading(true);
    setDepartmentsError(null);
    try {
      const data = await departmentService.getDepartments(undefined, true);
      setDepartments(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch departments';
      setDepartmentsError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsDepartmentsLoading(false);
    }
  }, []);

  // Fetch employee stats
  const fetchEmployeeStats = useCallback(async () => {
    try {
      const stats = await employeeService.getEmployeeStats();
      setEmployeeStats(stats);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch employee stats';
      toast.error(errorMessage);
    }
  }, []);

  // Employee CRUD operations
  const handleAddEmployee = async (data: EmployeeFormData) => {
    try {
      await employeeService.createEmployee(data);
      toast.success('Employee added successfully');
      setIsAddDialogOpen(false);
      fetchEmployees();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add employee';
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleEditEmployee = async (data: Partial<EmployeeFormData>) => {
    if (!selectedEmployee) return;
    try {
      await employeeService.updateEmployee(Number(selectedEmployee.id), data);
      toast.success('Employee updated successfully');
      setIsEditDialogOpen(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update employee';
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    try {
      await employeeService.deleteEmployee(id);
      toast.success('Employee deleted successfully');
      fetchEmployees();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete employee';
      toast.error(errorMessage);
    }
  };

  // Position CRUD operations
  const handleAddPosition = async (data: CreatePositionData) => {
    try {
      await positionService.createPosition(data);
      toast.success('Position added successfully');
      setIsPositionDialogOpen(false);
      fetchPositions();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add position';
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleEditPosition = async (data: Partial<CreatePositionData>) => {
    if (!selectedPositionForEdit) return;
    try {
      await positionService.updatePosition(selectedPositionForEdit.id, data);
      toast.success('Position updated successfully');
      setIsPositionDialogOpen(false);
      setSelectedPositionForEdit(null);
      fetchPositions();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update position';
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleDeletePosition = async (id: number) => {
    try {
      await positionService.deletePosition(id);
      toast.success('Position deleted successfully');
      fetchPositions();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete position';
      toast.error(errorMessage);
    }
  };

  // Department CRUD operations
  const handleAddDepartment = async (data: CreateDepartmentData) => {
    try {
      await departmentService.createDepartment(data);
      toast.success('Department added successfully');
      setIsDepartmentDialogOpen(false);
      fetchDepartments();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add department';
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleEditDepartment = async (data: Partial<CreateDepartmentData>) => {
    if (!selectedDepartmentForEdit) return;
    try {
      await departmentService.updateDepartment(selectedDepartmentForEdit.id, data);
      toast.success('Department updated successfully');
      setIsDepartmentDialogOpen(false);
      setSelectedDepartmentForEdit(null);
      fetchDepartments();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update department';
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleDeleteDepartment = async (id: number) => {
    try {
      await departmentService.deleteDepartment(id);
      toast.success('Department deleted successfully');
      fetchDepartments();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete department';
      toast.error(errorMessage);
    }
  };

  // Dialog handlers
  const openEditDialog = (employee: User) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const openPositionEditDialog = (position: Position) => {
    setSelectedPositionForEdit(position);
    setIsPositionDialogOpen(true);
  };

  const openDepartmentEditDialog = (department: Department) => {
    setSelectedDepartmentForEdit(department);
    setIsDepartmentDialogOpen(true);
  };

  // Pagination
  const totalPages = Math.ceil(totalEmployees / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Search and filter handlers
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleDepartmentFilter = (department: string) => {
    setSelectedDepartment(department);
    setCurrentPage(1);
  };

  const handlePositionFilter = (position: string) => {
    setSelectedPosition(position);
    setCurrentPage(1);
  };

  // Effects
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    fetchPositions();
    fetchDepartments();
    fetchEmployeeStats();
  }, [fetchPositions, fetchDepartments, fetchEmployeeStats]);

  return {
    // Employee data
    employees,
    totalEmployees,
    employeeStats,
    isEmployeesLoading,
    employeesError,

    // Position data
    positions,
    isPositionsLoading,
    positionsError,

    // Department data
    departments,
    isDepartmentsLoading,
    departmentsError,

    // Pagination and filters
    currentPage,
    totalPages,
    searchTerm,
    selectedDepartment,
    selectedPosition,

    // Dialog states
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isPositionDialogOpen,
    setIsPositionDialogOpen,
    isDepartmentDialogOpen,
    setIsDepartmentDialogOpen,
    selectedEmployee,
    selectedPositionForEdit,
    selectedDepartmentForEdit,

    // Handlers
    handleAddEmployee,
    handleEditEmployee,
    handleDeleteEmployee,
    handleAddPosition,
    handleEditPosition,
    handleDeletePosition,
    handleAddDepartment,
    handleEditDepartment,
    handleDeleteDepartment,
    openEditDialog,
    openPositionEditDialog,
    openDepartmentEditDialog,
    handlePageChange,
    handleSearch,
    handleDepartmentFilter,
    handlePositionFilter,

    // Refresh functions
    fetchEmployees,
    fetchPositions,
    fetchDepartments,
    fetchEmployeeStats,
  };
};