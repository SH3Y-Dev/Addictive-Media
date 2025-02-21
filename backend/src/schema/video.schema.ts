import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose'; 
import { User } from './user.schema';

@Schema()
export class Video extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  videoPath: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: User;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
