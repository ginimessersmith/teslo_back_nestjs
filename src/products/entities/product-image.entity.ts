import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity({name:'product_images'})//? nombre de la tabla en la db
export class ProductImage {

    @PrimaryGeneratedColumn('uuid')
    id: number

    @Column('text')
    url: string

    //? establecer una relacion en las dos entity que esten involucradas
    //?muchas imagenes pertenecen a un producto:
    @ManyToOne(
        ()=>Product,
        (product)=>product.images,
        //? establecer como se van a eliminar las img cuando se elimine el producto:
        {
            onDelete:'CASCADE'
        }
    )
    product:Product
}