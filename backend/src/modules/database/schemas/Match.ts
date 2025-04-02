import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  ownerId: string;

  @Prop({ required: true, default: 0 })
  score: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

@Schema()
export class Block {
  @Prop({ required: true })
  value: string;

  @Prop({ required: false })
  action: string;
}

export const BlockSchema = SchemaFactory.createForClass(Block);

@Schema()
export class Board {
  @Prop({ type: [BlockSchema], required: true })
  blocks: Block[];
}

export const BoardSchema = SchemaFactory.createForClass(Board);

@Schema()
export class Panel {
  @Prop({ required: false, default: false })
  active: boolean;

  @Prop({ required: true })
  ownerId: string;

  @Prop({ type: [BoardSchema], required: true })
  boards: Board[];
}

export const PanelSchema = SchemaFactory.createForClass(Panel);

@Schema({ timestamps: true })
export class Match extends Document {
  @Prop({ type: [UserSchema], required: true })
  users: User[];

  @Prop({ type: [PanelSchema], required: true })
  panels: Panel[];

  @Prop({ type: Number, required: true })
  round: number;

  @Prop({ type: Boolean, required: true, default: true })
  firstHalf: number;
}

export const MatchSchema = SchemaFactory.createForClass(Match);
