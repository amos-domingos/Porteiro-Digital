
export interface Visitor {
  id: string;
  name: string;
  unit: string;
  checkIn: string;
  status: 'pending' | 'authorized' | 'denied' | 'checked-out';
  type: 'guest' | 'delivery' | 'service';
  qrCode?: string;
}

export interface Delivery {
  id: string;
  recipient: string;
  unit: string;
  carrier: string;
  arrivedAt: string;
  status: 'pending' | 'collected';
  trackingNumber: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachment?: string;
}

export interface Occurrence {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  unit: string;
}

export interface Reservation {
  id: string;
  area: string;
  date: string;
  timeSlot: string;
  unit: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  category: 'event' | 'maintenance' | 'security' | 'general';
}

export interface Invoice {
  id: string;
  month: string;
  dueDate: string;
  value: number;
  status: 'paid' | 'pending' | 'overdue';
  type: 'condo' | 'extra';
}

export interface AuditEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  status: 'success' | 'warning' | 'alert';
}

export type UserRole = 'resident' | 'admin' | 'concierge_desk';
export type View = 'dashboard' | 'visitors' | 'deliveries' | 'concierge' | 'cameras' | 'occurrences' | 'reservations' | 'settings' | 'admin' | 'notices' | 'audit' | 'financial';
