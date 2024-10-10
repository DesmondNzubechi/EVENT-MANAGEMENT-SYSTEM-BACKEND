export interface userType {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string | undefined;
  correctPassword(
    userPassword: string,
    originalPassword: string
  ): Promise<boolean>;
}
