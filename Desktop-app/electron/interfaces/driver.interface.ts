export interface Driver {
    id: number;
    code: string;
    name: string;
    telephone: string;
}

export interface CreateDriverDto {
    code: string;
    name?: string;
    telephone?: string;
}

export interface UpdateDriverDto {
    code?: string;
    name?: string;
    telephone?: string;
}
