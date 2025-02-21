import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { VideoService } from 'src/video/video.service';
const { Jimp } = require('jimp');

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private videoService: VideoService
  ) {}
  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    const { email, password } = body;
    const user = await this.authService.validateUser(email, password);

    const { access_token } = await this.authService.login(user);

    res.cookie('access_token', access_token, {
      maxAge: 60 * 60 * 1000,
      secure: true,
      sameSite: 'none',
    });
    return res.json({ message: 'Login successful' });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getUserProfile(@Req() req) {
    console.log('Authorization Header:', req.headers.authorization);
    const userId = req.user.userId;
    console.log(req.user.userId);

    const user = await this.userService.findById(userId);
    const videos = await this.videoService.findByUserId(userId);

    const baseUrl = 'http://localhost:3000';

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      number: user.phoneNumber,
      bio: user.bio || undefined,
      dp: user.dp ? `${baseUrl}${user.dp.replace('.', '')}` : undefined,
      videos: videos.map((video) => ({
        title: video.title,
        description: video.description,
        videoUrl: `${baseUrl}${video.videoPath}`,
      })),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('update-profile')
  @UseInterceptors(
    FileInterceptor('dp', {
      storage: multer.diskStorage({
        destination: './uploads/dp',
        filename: (req, file, callback) => {
          const ext = file.originalname.split('.').pop();
          const filename = `${Date.now()}.${ext}`;
          callback(null, filename);
        },
      }),
      limits: { fileSize: 1 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async updateUserProfile(
    @Req() req,
    @Body() body: { bio: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req.user.userId;
    console.log('userId', userId);
    console.log('sd', body);

    let dpPath = null;

    if (file) {
      const dpFullPath = `./uploads/dp/${file.filename}`;
      const image = await Jimp.read(dpFullPath);
      image.resize({ w: 500, h: 500 });
      image.write(dpFullPath);

      dpPath = dpFullPath;
    }

    await this.userService.updateUserProfile(userId, body.bio, dpPath);
    return { message: 'Profile updated successfully' };
  }
}
