import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';
export class BaseEntityRoot extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ name: 'created_at', default: () => `now()`, nullable: false })
    createdAt: Date;
    @Column({ name: 'updated_at', default: () => `now()`, nullable: false })
    updatedAt: Date;
    @Column({ nullable: true })
    create_person: string;
}
