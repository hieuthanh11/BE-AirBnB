import { Room } from 'src/room/entities/room.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Imageroom } from './entities/imageroom.entity';

@EntityRepository(Imageroom)
export class ImageRoomRepository extends Repository<Imageroom> {
    async importImageRoom(room: Room, arrfile: string[]): Promise<string> {
        for (const item of arrfile) {
            await this.createQueryBuilder()
                .insert()
                .into(Imageroom)
                .values({
                    images: item,
                    room: room,
                })
                .execute();
        }
        return `Import Images for Room ${room.maPhong} Successfully`;
    }

    async getAllImageRoom(
        sizePage: number,
        numberPage: number,
        maPhong: number,
    ): Promise<[Imageroom[], number]> {
        const [list, count] = await Promise.all([
            maPhong
                ? await this.createQueryBuilder('image_room')
                      .leftJoinAndSelect('image_room.room', 'room')
                      .where('room.maPhong = :maPhong', {
                          maPhong: maPhong,
                      })
                      .skip(sizePage * (numberPage - 1))
                      .take(sizePage)
                      .getMany()
                : await this.createQueryBuilder('image_room')
                      .leftJoinAndSelect('image_room.room', 'room')
                      .skip(sizePage * (numberPage - 1))
                      .take(sizePage)
                      .getMany(),
            maPhong
                ? await this.createQueryBuilder('image_room')
                      .leftJoinAndSelect('image_room.room', 'room')
                      .where('room.maPhong = :maPhong', {
                          maPhong: maPhong,
                      })
                      .skip(sizePage * (numberPage - 1))
                      .take(sizePage)
                      .getCount()
                : await this.createQueryBuilder('image_room')
                      .leftJoinAndSelect('image_room.room', 'room')
                      .skip(sizePage * (numberPage - 1))
                      .take(sizePage)
                      .getCount(),
        ]);

        return [list, count];
    }

    async getImageById(idImage: string): Promise<Imageroom> {
        const hotel = await this.createQueryBuilder('image_room')
            .leftJoinAndSelect('image_room.room', 'room')
            .where('image_room.id = :id', {
                id: idImage,
            })
            .getOne();
        return hotel;
    }

    async deleteImageRoomById(id: string): Promise<string> {
        await this.createQueryBuilder()
            .delete()
            .from(Imageroom)
            .where('id= :id', { id: id })
            .execute();
        return `Delete Successfully ${id}`;
    }

    async updateImageRoomById(file: string, id: string): Promise<string> {
        await this.createQueryBuilder()
            .update(Imageroom)
            .set({
                images: file,
            })
            .where('id = :id', { id: id })
            .execute();
        return `Update Images Successfully ${id}`;
    }

    async getImageRoomByRoomId(roomId: string): Promise<Imageroom[]> {
        return await this.createQueryBuilder('image_room')
            .where('image_room.roomId = :roomId', { roomId: roomId })
            .getMany();
    }

    async deleteAllImagesRoomById(listImageRooms: Imageroom[], roomId: string): Promise<string> {
        for (const item of listImageRooms) {
            await this.createQueryBuilder()
                .delete()
                .from(Imageroom)
                .where('id = :id', { id: item.id })
                .execute();
        }
        return `Delete All ImagesRoom with maPhong ${roomId}`;
    }
}
