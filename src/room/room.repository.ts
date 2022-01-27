import { Sort } from 'src/base/orderby.enum';
import { Discount } from 'src/discount/entities/discount.entity';
import { Hotel } from 'src/hotel/entities/hotel.entity';
import { Status } from 'src/status/entities/status.entity';
import { ListUtilID } from 'src/utils/dto/create-util.dto';
import { Util } from 'src/utils/entities/util.entity';
import { Repository, EntityRepository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';

@EntityRepository(Room)
export class RoomRepository extends Repository<Room> {
    async createRoom(
        data: CreateRoomDto,
        statusId: Status,
        hotelId: Hotel,
        utils: Util[],
        discount: Discount,
    ): Promise<Room> {
        const room = new Room();
        room.maPhong = data.maPhong;
        room.type = data.type;
        room.price = data.price;
        room.status = statusId;
        room.hotels = hotelId;
        room.utils = utils;
        room.discounts = discount;
        return await this.save(room);
    }

    async getAllRoom(): Promise<Room[]> {
        const roomList = await this.createQueryBuilder('room')
            .leftJoinAndSelect('room.status', 'status')
            .leftJoinAndSelect('room.hotels', 'hotel')
            .leftJoinAndSelect('room.utils', 'utils')
            .leftJoinAndSelect('room.imagesRoom', 'imagesRoom')
            .leftJoinAndSelect('room.discounts', 'discount')
            .getMany();
        return roomList;
    }

    async getAllRoomById(idHotel: string): Promise<Room[]> {
        const roomList = await this.createQueryBuilder('room')
            .leftJoinAndSelect('room.status', 'status')
            .leftJoinAndSelect('room.hotels', 'hotel')
            .leftJoinAndSelect('room.utils', 'utils')
            .leftJoinAndSelect('room.imagesRoom', 'imagesRoom')
            .leftJoinAndSelect('room.discounts', 'discount')
            .where('hotel.id = :id', {
                id: idHotel,
            })
            .getMany();
        return roomList;
    }

    async getRoomById(idRoom: string): Promise<Room> {
        const room = await this.createQueryBuilder('room')
            .leftJoinAndSelect('room.status', 'status')
            .leftJoinAndSelect('room.hotels', 'hotel')
            .leftJoinAndSelect('room.utils', 'utils')
            .leftJoinAndSelect('room.imagesRoom', 'imagesRoom')
            .leftJoinAndSelect('room.discounts', 'discount')
            .where('room.id = :id', {
                id: idRoom,
            })
            .getOne();
        return room;
    }

    async updateRoom(
        id: string,
        data: UpdateRoomDto,
        statusId: Status,
        hotelId: Hotel,
        discount: Discount,
    ): Promise<string> {
        await this.createQueryBuilder()
            .update(Room)
            .set({
                maPhong: data.maPhong,
                type: data.type,
                price: data.price,
                status: statusId,
                hotels: hotelId,
                discounts: discount,
            })
            .where('id = :id', { id: id })
            .execute();
        return `update successfully ${id}`;
    }

    async updateStatus(status: Status, idRoom: string): Promise<string> {
        await this.createQueryBuilder()
            .update(Room)
            .set({
                status: status,
            })
            .where('id = :id', { id: idRoom })
            .execute();
        return `update successfully ${idRoom}`;
    }

    async updateDiscount(idRoom: string, discount: Discount): Promise<string> {
        await this.createQueryBuilder()
            .update(Room)
            .set({
                discounts: discount,
            })
            .where('id = :id', { id: idRoom })
            .execute();
        return `update successfully discount ${idRoom}`;
    }

    async removeDiscount(idRoom: string, discount: Discount): Promise<string> {
        await this.createQueryBuilder()
            .update(Room)
            .set({
                discounts: discount,
            })
            .where('id = :id', { id: idRoom })
            .execute();
        return `remove successfully discount ${idRoom}`;
    }

    async addUtil(roomId: string, listUtilID: ListUtilID): Promise<string> {
        await this.createQueryBuilder()
            .relation(Room, 'utils')
            .of(roomId)
            .add(
                listUtilID.utils.map((item) => {
                    return item.idUtil;
                }),
            );
        return `Add util for room successfully ${roomId}`;
    }

    async removeUtil(idRoom: string, listUtilID: ListUtilID): Promise<string> {
        await this.createQueryBuilder()
            .relation(Room, 'utils')
            .of(idRoom)
            .remove(
                listUtilID.utils.map((item) => {
                    return item.idUtil;
                }),
            );
        return `remove util for room successfully ${idRoom}`;
    }

    public async deleteRoomById(id: string): Promise<string> {
        await this.createQueryBuilder().delete().from(Room).where('id = :id', { id: id }).execute();
        return `Delete Successfully ${id}`;
    }

    public async getAllRoomPagination(
        sizePage: number,
        numberPage: number,
        maPhong: number,
        sortBy: string,
    ): Promise<[Room[], number]> {
        const [list, count] = await Promise.all([
            await this.createQueryBuilder('room')
                .leftJoinAndSelect('room.status', 'status')
                .leftJoinAndSelect('room.hotels', 'hotel')
                .leftJoinAndSelect('room.utils', 'utils')
                .leftJoinAndSelect('room.imagesRoom', 'imagesRoom')
                .leftJoinAndSelect('room.discounts', 'discount')
                .where('room.maPhong LIKE :maPhong', {
                    maPhong: maPhong === undefined ? '%%' : `%${maPhong}%`,
                })
                .skip(sizePage * (numberPage - 1))
                .take(sizePage)
                .orderBy('room.maPhong', sortBy as Sort)
                .getMany(),
            await this.createQueryBuilder('room')
                .leftJoinAndSelect('room.status', 'status')
                .leftJoinAndSelect('room.hotels', 'hotel')
                .leftJoinAndSelect('room.utils', 'utils')
                .leftJoinAndSelect('room.discounts', 'discount')
                .where('room.maPhong LIKE :maPhong', {
                    maPhong: maPhong === undefined ? '%%' : `%${maPhong}%`,
                })
                .skip(sizePage * (numberPage - 1))
                .take(sizePage)
                .getCount(),
        ]);
        return [list, count];
    }
}
