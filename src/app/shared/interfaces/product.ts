import { Brand } from './brand';
import { Category } from './category';
import { CustomFields } from './custom-fields';

export interface ProductFeature {
    name: string;
    value: string;
}

export interface ProductFeaturesSection {
    name: string;
    features: any;
}



export interface ProductAttributeValue {
    name: string;
    slug: string;
    hexadecimal?:string,
    customFields: CustomFields;
}

export interface ProductAttribute {
    name: string;
    slug: string;
    featured: boolean;
    values: ProductAttributeValue[];
    customFields: CustomFields;
}

export interface Product {
    id: number;
    slug: string;
    name: string;
    sku: string;
    stock?:number;
    descripcion?:string,
    detallelargo_producto?:string,
    price: number;
    compareAtPrice: number|null;
    images: string[];
    badges: string[];
    especificaciones?:any;
    rating: number;
    reviews: number;
    availability: string;
    brand: Brand|null;
    categories: Category[];
    attributes: ProductAttribute[];
    customFields: CustomFields;
    atributo_producto?:any;
}
