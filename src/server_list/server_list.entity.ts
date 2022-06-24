import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('server_list')
export class ServerListEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name:'Name', length: 150 })
  Name: string;

  @Column({ name:'DataSource', length: 150 })
  DataSource: string;

  @Column({ name:'Catalog', length: 150 })
  Catalog: string;

  @Column({ name:'UserID', length: 150 })
  UserID: string;

  @Column({ name:'Password', length: 150 })
  Password: string;

  @Column({ name:'KeyRequest', length: 250 })
  KeyRequest: string;

  @Column({ name:'RequestUrl', length: 250 })
  RequestUrl: string;

  @Column({ name:'FlashUrl', length: 250 })
  FlashUrl: string;

  @Column({ name:'ConfigUrl', length: 250 })
  ConfigUrl: string;
  
  @Column({ name:'LinkCenter', length: 500 })
  LinkCenter: string;

  @Column({ name:'Status' })
  Status: number;
  @Column({ name:'Port' })
  Port: number;
}
