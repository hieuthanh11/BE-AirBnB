import { Sort } from 'src/base/orderby.enum';
import { Hotel } from 'src/hotel/entities/hotel.entity';

import { EntityRepository, Repository } from 'typeorm';
import { ImageHotel } from './entities/image-hotel.entity';

@EntityRepository(ImageHotel)
export class ImageHotelRepository extends Repository<ImageHotel> {
    async createImageForHotel(hotel: Hotel, arrfile: string[]): Promise<string> {
        for (const item of arrfile) {
            await this.createQueryBuilder()
                .insert()
                .into(ImageHotel)
                .values({
                    images: item,
                    hotel: hotel,
                })
                .execute();
        }
        return `Import Images for Hotel ${hotel.id} Successfully`;
    }

    async getAllImage(): Promise<ImageHotel[]> {
        const imageList = await this.createQueryBuilder('image_hotel')
            .leftJoinAndSelect('image_hotel.hotel', 'hotel')
            .getMany();
        return imageList;
    }

    async getImageById(idImage: string): Promise<ImageHotel> {
        const hotel = await this.createQueryBuilder('image_hotel')
            .leftJoinAndSelect('image_hotel.hotel', 'hotel')
            .where('image_hotel.id = :id', {
                id: idImage,
            })
            .getOne();
        return hotel;
    }

    async getAllImageHotelPagination(
        sizePage: number,
        numberPage: number,
        name: string,
        sortBy: string,
    ): Promise<[ImageHotel[], number]> {
        const [list, count] = await Promise.all([
            await this.createQueryBuilder('image_hotel')
                .leftJoinAndSelect('image_hotel.hotel', 'hotel')
                .where('hotel.name LIKE :name', {
                    name: name === undefined ? '%%' : `%${name}%`,
                })
                .skip(sizePage * (numberPage - 1))
                .take(sizePage)
                .orderBy('hotel.name', sortBy as Sort)
                .getMany(),
            await this.createQueryBuilder('image_hotel')
                .leftJoinAndSelect('image_hotel.hotel', 'hotel')
                .where('hotel.name LIKE :name', {
                    name: name === undefined ? '%%' : `%${name}%`,
                })
                .skip(sizePage * (numberPage - 1))
                .take(sizePage)
                .getCount(),
        ]);

        return [list, count];
    }

    async deleteImageHotelById(id: string): Promise<string> {
        await this.createQueryBuilder()
            .delete()
            .from(ImageHotel)
            .where('id= :id', { id: id })
            .execute();
        return `Delete Successfully ${id}`;
    }

    async updateImageHotelById(file: string, id: string): Promise<string> {
        await this.createQueryBuilder()
            .update(ImageHotel)
            .set({
                images: file,
            })
            .where('id = :id', { id: id })
            .execute();
        return `Update Images Successfully ${id}`;
    }

    async removeAllImageOfHotelID(idHotel: string): Promise<string> {
        await this.createQueryBuilder()
            .delete()
            .from(ImageHotel)
            .where('hotelId= :hotelId', { hotelId: idHotel })
            .execute();
        return `Delete Successfully All Image Of ${idHotel}`;
    }
}
