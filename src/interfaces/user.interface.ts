export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    meta?: {
        description?: string;
    };
}