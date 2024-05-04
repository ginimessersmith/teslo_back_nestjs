import { Product } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'users'})
export class User {

    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column('text')
    fullname:string
    
    @Column('text',{
        unique:true
    })
    email:string

    @Column('text',{
        select:false//? para no retornar el password cuando se haga un select o findby
    })
    password:string

    @Column('bool',{
        default:true
    })//? postgres usa bool
    isActive:boolean

    @Column('text',{
        array:true,
        default:['user']
    })
    roles:string[]

    //? relacion 1 usuario tendra muchos productos OneToMany:
    @OneToMany(
        ()=>Product,
        (product)=>product.user
    )//? crear nuevo columna en product.
    product:Product[]//? immportar de las entities
    //? triggers
    @BeforeInsert()
    toLowerCaseEmail(){
        this.email=this.email.toLowerCase().trim()
    }

    @BeforeUpdate()
    toLowerCaseEmailUpdate(){
        this.toLowerCaseEmail()
    }
}
