import { User, UserRole } from '@/types';

const initialUsers: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@school.edu',
    role: UserRole.ADMIN,
    roles: [UserRole.ADMIN, UserRole.TEACHER],
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@school.edu',
    role: UserRole.TEACHER,
    roles: [UserRole.TEACHER],
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@school.edu',
    role: UserRole.REGISTRAR,
    roles: [UserRole.REGISTRAR],
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@school.edu',
    role: UserRole.LIBRARIAN,
    roles: [UserRole.LIBRARIAN],
  },
  {
    id: '5',
    firstName: 'Robert',
    lastName: 'Wilson',
    email: 'robert.wilson@school.edu',
    role: UserRole.TEACHER,
    roles: [UserRole.TEACHER],
  },
  {
    id: '6',
    firstName: 'Lisa',
    lastName: 'Anderson',
    email: 'lisa.anderson@school.edu',
    role: UserRole.STUDENT,
    roles: [UserRole.STUDENT],
  },
  {
    id: '7',
    firstName: 'Mark',
    lastName: 'Johnson',
    email: 'mark.johnson@school.edu',
    role: UserRole.TEACHER,
    roles: [UserRole.TEACHER],
  },
  {
    id: '8',
    firstName: 'Susan',
    lastName: 'Williams',
    email: 'susan.williams@school.edu',
    role: UserRole.CASHIER,
    roles: [UserRole.CASHIER],
  },
  {
    id: '9',
    firstName: 'Kevin',
    lastName: 'Harris',
    email: 'kevin.harris@school.edu',
    role: UserRole.REGISTRAR,
    roles: [UserRole.REGISTRAR],
  },
  {
    id: '10',
    firstName: 'Emma',
    lastName: 'Garcia',
    email: 'emma.garcia@school.edu',
    role: UserRole.STUDENT,
    roles: [UserRole.STUDENT],
  }
];

// Simulate API delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
  getUsers: async (): Promise<User[]> => {
    await sleep(500); // Simulate network latency
    console.log('Fetching users from mock service');
    return Promise.resolve(initialUsers);
  },

  addUser: async (user: Omit<User, 'id'>): Promise<User> => {
    await sleep(500);
    const newUser = { ...user, id: String(initialUsers.length + 1) };
    initialUsers.push(newUser);
    console.log('Added user:', newUser);
    return Promise.resolve(newUser);
  },

  updateUser: async (user: User): Promise<User> => {
    await sleep(500);
    const index = initialUsers.findIndex(u => u.id === user.id);
    if (index !== -1) {
      initialUsers[index] = user;
      console.log('Updated user:', user);
      return Promise.resolve(user);
    }
    throw new Error('User not found');
  },

  deleteUser: async (id: string): Promise<void> => {
    await sleep(500);
    const index = initialUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      initialUsers.splice(index, 1);
      console.log('Deleted user with id:', id);
      return Promise.resolve();
    }
    throw new Error('User not found');
  }
};
