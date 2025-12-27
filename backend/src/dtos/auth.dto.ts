export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
  role?: "customer" | "partner" | "admin";
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface UserResponseDto {
  _id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
}
