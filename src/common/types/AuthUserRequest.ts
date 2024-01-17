import { Request as ExpressRequest } from 'express';

export type RequestUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  document: string;
};

export interface AuthUserRequest extends ExpressRequest {
  user: RequestUser;
}
