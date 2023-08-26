import { ConfigService } from '@nestjs/config';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';

export class CloudinaryService {
  constructor(private configService: ConfigService) {}

  cloudinaryClient() {
    return cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(dataURI: string): Promise<UploadApiResponse> {
    const cloudinaryClient = this.cloudinaryClient();

    return await cloudinaryClient.uploader.upload(dataURI, {
      resource_type: 'auto',
      transformation: [{ width: 300, height: 300, crop: 'limit' }],
    });
  }
}
