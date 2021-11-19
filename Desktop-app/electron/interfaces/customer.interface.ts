export interface Customer {
    id: number;
    name: string;
    street: string;
    city: string;
    postal_code: string;
    telephone: string;
}

export interface CreateCustomerDto {
    name: string;
    street: string;
    city: string;
    postal_code: string;
    telephone: string;
}

export interface UpdateCustomerDto {
    name?: string;
    street?: string;
    city?: string;
    postal_code?: string;
    telephone?: string;
}

