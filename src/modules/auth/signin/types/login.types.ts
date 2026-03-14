export interface User {
  id: string;
  phoneNumber: string;
  name: string;
  points: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
