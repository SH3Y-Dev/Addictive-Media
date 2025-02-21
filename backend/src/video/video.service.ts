import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video } from 'src/schema/video.schema';
import { CreateVideoDto } from './dto/video.dto';
import { User } from 'src/schema/user.schema';
import { Types } from 'mongoose';

@Injectable()
export class VideoService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<Video>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async uploadVideo(
    createVideoDto: CreateVideoDto,
    videoPath: string,
    userId: string,
  ): Promise<Video> {
    const newVideo = new this.videoModel({
      ...createVideoDto,
      videoPath,
      userId: new Types.ObjectId(userId),
    });

    return newVideo.save();
  }

  async findByUserId(userId: string): Promise<Video[]> {
    const objectId = new Types.ObjectId(userId);
    return this.videoModel.find({ userId: objectId }).exec();
  }

  async findLatestVideos(currentUserId: string) {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    const videos = await this.videoModel
      .find()
      .sort({ createdAt: -1 })
      .populate('userId', 'firstName lastName dp email')
      .exec();

    const userMap = new Map();

    videos.forEach((video) => {
      const userId = video.userId._id.toString();

      if (userId === currentUserId) {
        return;
      }

      if (!userMap.has(userId)) {
        userMap.set(userId, {
          firstName: video.userId.firstName,
          lastName: video.userId.lastName,
          emailId: video.userId.email,
          dp: `${baseUrl}${video.userId.dp.replace('.', '')}`,
          videos: [],
        });
      }

      userMap.get(userId).videos.push({
        title: video.title,
        description: video.description,
        videoUrl: `${baseUrl}${video.videoPath}`,
      });
    });

    return Array.from(userMap.values());
  }

  async findVideosByUser(email: string): Promise<any> {
    const user = await this.userModel
      .findOne({ email: email['emailId'] })
      .exec();

    if (!user) {
      throw new NotFoundException(`User with emailId ${email} not found`);
    }
    console.log(user._id);

    const videos = await this.videoModel
      .find({ userId: user._id })
      .sort({ createdAt: -1 })
      .select('videoPath title description')
      .exec();
    console.log(videos);

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    return {
      dp: `${baseUrl}${user.dp.replace('.', '')}`,
      firstName: user.firstName,
      lastName: user.lastName,
      videos: videos.map((video) => ({
        videoUrl: `${baseUrl}${video.videoPath}`,
        title: video.title,
        description: video.description,
      })),
    };
  }
}
