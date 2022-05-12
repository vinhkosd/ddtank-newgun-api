import { IUser } from '../interfaces/user.interface';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';

@Entity({ name: 'user' })
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  money: number;

  @Column({ default: 0 })
  vip_level: number;

  @Column({ default: 0 })
  vip_exp: number;

  @Column({ default: "" })
  phone_number: string;

  @Column({ default: "" })
  email: string;

  @Column({ default: new Date() })
  create_at: Date;

  @Column({ default: true })
  is_exist: boolean;
  // @PrimaryGeneratedColumn()
  // id: string;

  // @Column({ length: 25, nullable: true })
  // name: string;

  // @Column({ unique: true, length: 255 })
  // email: string;

  // @Column({ name: 'password', length: 255 })
  // password: string;

  // @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  // createdAt: Date;

  // @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  // updatedAt: Date;

  // @BeforeInsert()
  // emailToLowerCase() {
  //   this.email = this.email.toLowerCase();
  // }

  // @OneToOne(() => Profile, (profile) => profile.user)
  // profile: Profile;

  // @OneToMany(
  //   () => UserConversation,
  //   (userConversation) => userConversation.user,
  // )
  // userConversation?: UserConversation[];

  // @OneToMany(() => Message, (message) => message.user)
  // messages?: Message[];

  // @OneToMany(() => Information, (information) => information.user, {
  //   eager: true,
  // })
  // information?: Information[];

  // @ManyToMany(() => Conversation, (conversations) => conversations.users)
  // @JoinTable({
  //   name: 'user_conversation',
  //   joinColumn: { name: 'user_id', referencedColumnName: 'id' },
  //   inverseJoinColumn: { name: 'conversation_id' },
  // })
  // conversations: Conversation[];
}
