export interface UserDetail {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  roles: string[];
  towFacotrEnable: boolean;
  phoneNumberConfirmed: boolean;
  accessFailedCount: number;
}
