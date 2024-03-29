import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { category } from './category';

export interface incomeAttributes {
  id: string;
  name?: string;
  nominal: string;
  user_id?: string;
  category_id?: string;
  income_datetime?: Date;
  created_at?: Date;
}

@Table({ tableName: 'income', timestamps: false })
export class income
  extends Model<incomeAttributes, incomeAttributes>
  implements incomeAttributes
{
  @Column({ primaryKey: true, type: DataType.STRING(255) })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  id!: string;

  @Column({ allowNull: true, type: DataType.STRING })
  name?: string;

  @Column({ type: DataType.STRING })
  nominal!: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  @Index({ name: 'user_id', using: 'BTREE', order: 'ASC', unique: false })
  user_id?: string;

  @ForeignKey(() => category)
  @Column({ allowNull: true, type: DataType.STRING(255) })
  @Index({ name: 'category_id', using: 'BTREE', order: 'ASC', unique: false })
  category_id?: string;

  @Column({ allowNull: true, type: DataType.DATE, defaultValue: DataType.NOW })
  income_datetime?: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  created_at?: Date;

  @BelongsTo(() => category)
  category?: category;
}
