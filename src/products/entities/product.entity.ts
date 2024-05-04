
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({name:'products'})
export class Product {

    @ApiProperty({
        example:'ksajhfk-asfd-ansf',
        description:'id (uuid) product',
        uniqueItems:true,
    })//?agregar a la documentacion
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ApiProperty({
        example:'gino shirts',
        description:'titulo del producto',
        uniqueItems:false,
    })//?agregar a la documentacion
    @Column('text', {
        unique: true
    })
    title: string

    @ApiProperty({
        example:10,
        description:'precio del producto',
        uniqueItems:false,
        default:0
    })//?agregar a la documentacion
    @Column('float', {
        default: 0
    })
    price: number

    @ApiProperty({
        example:'es producto es genial',
        description:'descripcion del producto',
        uniqueItems:false,
        default:null,
        nullable:true
    })//?agregar a la documentacion
    @Column({
        type: 'text',
        nullable: true//? para hacer opcional
    })
    description: string

    @ApiProperty()//?agregar a la documentacion
    @Column({
        type: 'text',
        unique: true
    })
    slug: string

    @ApiProperty()//?agregar a la documentacion
    @Column('int', { default: 0 })
    stock: number

    @ApiProperty()//?agregar a la documentacion
    @Column('text', {
        array: true
    })
    sizes: string[]

    @ApiProperty()//?agregar a la documentacion
    @Column('text')
    gender: string

    //tags
    @ApiProperty()//?agregar a la documentacion
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[]

    @BeforeInsert()//? antes de insertar hacer esto y actualizar:
    // @BeforeUpdate()//? otra forma de hacer el update
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title
                .trim()
                .toLowerCase()
                .replaceAll(' ', '_')
                .replaceAll("'", '')
        }
        // else {
        //     this.slug = this.slug
        //         .trim()
        //         .toLowerCase()
        //         .replaceAll(' ', '_')
        //         .replaceAll("'", '')
        // }
    }
    ///images
    //? establecer una relacion en las dos entity que esten involucradas
    //* uno a muchos, 3 partes
    //* un producto pertenece a muchas imagenes
    @ApiProperty()//?agregar a la documentacion
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        {
            cascade: true,
            eager: true//? para que retornen las imagenes desde cualquier metodo find (findOne)
        }
    )
    images?: ProductImage[]

    @BeforeUpdate()//? antes de actualizar hacer esto:
    checkSlugUpdate() {
        this.slug = this.slug
            .trim()
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
    }

    //? relacion muchos productos pertenecen a un usuario:
    @ManyToOne(
        ()=>User,
        (user)=>user.product,
        {eager:true}//? cargar el userId por cada consulta
    )
    user:User

}
