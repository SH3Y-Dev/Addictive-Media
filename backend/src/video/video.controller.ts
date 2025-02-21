import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Req,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';
import { VideoService } from './video.service';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { CreateVideoDto } from './dto/video.dto';
import { Video } from 'src/schema/video.schema';

@UseGuards(AuthGuard('jwt'))
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: './uploads/videos',
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const filename = `${uuidv4()}${ext}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'video/mp4') {
          return cb(new Error('Only MP4 format is allowed'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 6 * 1024 * 1024,
      },
    }),
  )
  async uploadVideo(
    @UploadedFile() video: Express.Multer.File,
    @Body() createVideoDto: CreateVideoDto,
    @Req() req,
  ) {
    const userId = req.user.userId;
    const videoPath = `/uploads/videos/${video.filename}`;
    return this.videoService.uploadVideo(createVideoDto, videoPath, userId);
  }

  @Get('latest')
  async getLatestVideos(@Req() req) {
    return this.videoService.findLatestVideos(req.user.userId);
  }

  @Post('user')
  async getUserVideos(@Body() emailId: string): Promise<Video[]> {
    return this.videoService.findVideosByUser(emailId);
  }
}
