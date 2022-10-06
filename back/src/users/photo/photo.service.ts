import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Photo } from "src/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class PhotoService
{
    constructor(
        @InjectRepository(Photo)
        private readonly photoRepository: Repository<Photo>,
    ){}

    async addPhoto(imageBuffer: Buffer, filename: string)
    {
        console.log(imageBuffer);
        const newPhoto = await this.photoRepository.create({
            filename,
            data: imageBuffer
        })
        await this.photoRepository.save(newPhoto);
        return newPhoto;
    }

    async getPhotoById(photoId: number)
    {
        const photo = await this.photoRepository.findOneBy({id: photoId});
        if (!photo)
            return null;
        return photo;
    }
}