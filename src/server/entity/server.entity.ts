import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ServerEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isBooting: boolean;

  @Column({ default: false })
  isStopping: boolean;

  // @Column()
  // internalIp: string;

  @Column()
  baseUri: string;

  @Column({ default: false })
  isAvailable: boolean;
}
