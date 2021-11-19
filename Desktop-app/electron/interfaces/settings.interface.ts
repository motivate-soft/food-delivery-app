export interface Settings {
    id: number;
    shop_name: string;
    street: string;
    postal_code: string;
    city: string;
    telephone: string;
    fax: string;
    tax_number: string;
    activation_key: string;
}


export interface UpdateSettingsDto {
    shop_name?: string;
    street?: string;
    postal_code?: string;
    city?: string;
    telephone?: string;
    fax?: string;
    tax_number?: string;
    activation_key?: string;
}
