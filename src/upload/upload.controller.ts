import {
  Controller,
  Post,
  UseInterceptors,
  HttpStatus,
  UploadedFile,
  HttpException,
  ParseFilePipeBuilder,
  HttpCode,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express, Request } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { WebResponse } from 'src/model/web.dto';
import { v4 as uuid } from 'uuid';
import { UploadImageDtoResponse } from './dto/upload-image.dto';

@Controller('/api/upload')
export class UploadController {
  @Post('image')
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('file', {
      // configure Multer storage options
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, callback) => {
          const fileExtName = extname(file.originalname);
          const randomName = uuid();
          callback(null, `${randomName}${fileExtName}`);
        },
      }),
    }),
  )
  uploadImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 2 * 1024 * 1024, // 2MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: true, // reject if no file
        }),
    )
    file: Express.Multer.File,
    @Req() req: Request,
  ): WebResponse<UploadImageDtoResponse> {
    if (!file) {
      throw new HttpException('File not uploaded.', HttpStatus.BAD_REQUEST);
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`; // e.g. http://localhost:3000
    return {
      data: {
        id: file.filename,
        url: `${baseUrl}/uploads/images/${file.filename}`,
      },
      message: 'Image uploaded successfully.',
    };
  }
}
