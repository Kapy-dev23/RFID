export interface User {
  _id: string;

  firstName: string;

  lastName: string;

  email: string;

  password?: string;

  rfid: string;

  role: "admin" | "receptionist" | "doctor" | "nurse" | "patient" | "visitor";

  active: boolean;

  createdAt: string;
  
  updatedAt: string;
}