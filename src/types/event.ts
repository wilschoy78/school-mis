
export interface Event {
  id: string;
  title: string;
  date: Date;
  time?: string;
  description?: string;
  type: 'meeting' | 'sports' | 'academic' | 'holiday' | 'other';
  allDay: boolean;
}
