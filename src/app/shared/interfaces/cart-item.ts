import { Product } from './product';

export interface CartItem {
    product: Product;
    options: {
        name: string;
        value: string;
    }[];
    quantity: number;
    id_producto_color: any;
    id_atributo_producto: any;
    atributo_producto:any;
}
