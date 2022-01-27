import { Sort } from 'src/base/orderby.enum';
import { ListServiceID } from 'src/services/dto/create-service.dto';
import { Service } from 'src/services/entities/service.entity';
import { User } from 'src/users/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { BaseHotelDTO } from './dto/base-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { Hotel } from './entities/hotel.entity';

@EntityRepository(Hotel)
export class HotelRepository extends Repository<Hotel> {
    async createNewHotel(data: BaseHotelDTO, user: User, listService: Service[]): Promise<string> {
        const hotel = new Hotel();
        hotel.name = data.name;
        hotel.address = data.address;
        hotel.comment = data.comment;
        hotel.openTime = data.openTime;
        hotel.closeTime = data.closeTime;
        hotel.roomQuantity = data.roomQuantity;
        hotel.rate = data.rate;
        hotel.user = user;
        hotel.services = listService;
        const hotelSave = await this.save(hotel);
        return `Create successfully ${hotelSave.id}`;
    }

    async getAllHotel(): Promise<Hotel[]> {
        const hotelList = await this.createQueryBuilder('hotel')
            .leftJoinAndSelect('hotel.user', 'user')
            .leftJoinAndSelect('hotel.services', 'services')
            .leftJoinAndSelect('hotel.rooms', 'rooms')
            .leftJoinAndSelect('rooms.status', 'status')
            .leftJoinAndSelect('rooms.utils', 'utils')
            .leftJoinAndSelect('rooms.discounts', 'discount')
            .getMany();

        return hotelList;
    }

    async getAllHotelById(idUser: string): Promise<Hotel[]> {
        const hotelList = await this.createQueryBuilder('hotel')
            .leftJoinAndSelect('hotel.user', 'user')
            .leftJoinAndSelect('hotel.services', 'services')
            .leftJoinAndSelect('hotel.rooms', 'rooms')
            .leftJoinAndSelect('rooms.status', 'status')
            .leftJoinAndSelect('rooms.hotels', 'hotels')
            .leftJoinAndSelect('rooms.utils', 'utils')
            .leftJoinAndSelect('rooms.discounts', 'discount')
            .leftJoinAndSelect('rooms.imagesRoom', 'imagesRoom')
            .where('user.id = :id', {
                id: idUser,
            })
            .getMany();

        return hotelList;
    }

    async getHotelById(idHotel: string): Promise<Hotel> {
        const hotel = await this.createQueryBuilder('hotel')
            .leftJoinAndSelect('hotel.user', 'user')
            .leftJoinAndSelect('hotel.services', 'services')
            .leftJoinAndSelect('hotel.rooms', 'rooms')
            .leftJoinAndSelect('rooms.status', 'status')
            .leftJoinAndSelect('rooms.discounts', 'discount')
            .leftJoinAndSelect('hotel.imagesHotel', 'imagesHotel')
            .leftJoinAndSelect('rooms.imagesRoom', 'imagesRoom')
            .where('hotel.id = :id', {
                id: idHotel,
            })
            .getOne();
        return hotel;
    }

    async updateHotel(id: string, data: UpdateHotelDto): Promise<string> {
        await this.createQueryBuilder()
            .update(Hotel)
            .set({
                name: data.name,
                address: data.address,
                comment: data.comment,
                openTime: data.openTime,
                closeTime: data.closeTime,
                roomQuantity: data.roomQuantity,
                rate: data.rate,
            })
            .where('id = :id', { id: id })
            .execute();
        return `update successfully ${id}`;
    }

    async addService(hotelId: string, listServiceID: ListServiceID): Promise<string> {
        await this.createQueryBuilder()
            .relation(Hotel, 'services')
            .of(hotelId)
            .add(
                listServiceID.services.map((item) => {
                    return item.idService;
                }),
            );
        return `Add service for hotel successfully ${hotelId}`;
    }
    async removeService(idHotel: string, listServiceID: ListServiceID): Promise<string> {
        await this.createQueryBuilder()
            .relation(Hotel, 'services')
            .of(idHotel)
            .remove(
                listServiceID.services.map((item) => {
                    return item.idService;
                }),
            );
        return `remove service for hotel successfully ${idHotel}`;
    }

    public async deleteHotelById(id: string): Promise<string> {
        const hotel: Hotel = await this.findOne({ relations: ['services'], where: { id: id } });
        hotel.services = [];
        await this.save(hotel);
        await this.createQueryBuilder()
            .delete()
            .from(Hotel)
            .where('id = :id', { id: id })
            .execute();
        return `Delete Successfully ${id}`;
    }

    public async getAllHotelPagination(
        sizePage: number,
        numberPage: number,
        name: string,
        address: string,
        sortBy: string,
    ): Promise<[Hotel[], number]> {
        const [list, count] = await Promise.all([
            await this.createQueryBuilder('hotel')
                .leftJoinAndSelect('hotel.user', 'user')
                .leftJoinAndSelect('hotel.services', 'services')
                .leftJoinAndSelect('hotel.rooms', 'rooms')
                .leftJoinAndSelect('hotel.imagesHotel', 'imagesHotel')
                .leftJoinAndSelect('rooms.status', 'status')
                .leftJoinAndSelect('rooms.utils', 'utils')
                .leftJoinAndSelect('rooms.discounts', 'discount')
                .leftJoinAndSelect('rooms.imagesRoom', 'imagesRoom')
                .where('hotel.name LIKE :name', {
                    name: name === undefined ? '%%' : `%${name}%`,
                })
                .andWhere('hotel.address LIKE :address', {
                    address: address === undefined ? '%%' : `%${address}%`,
                })
                .skip(sizePage * (numberPage - 1))
                .take(sizePage)
                .orderBy('hotel.name', sortBy as Sort)
                .getMany(),
            await this.createQueryBuilder('hotel')
                .leftJoinAndSelect('hotel.user', 'user')
                .leftJoinAndSelect('hotel.services', 'services')
                .leftJoinAndSelect('hotel.rooms', 'rooms')
                .leftJoinAndSelect('rooms.status', 'status')
                .leftJoinAndSelect('rooms.utils', 'utils')
                .leftJoinAndSelect('rooms.discounts', 'discount')
                .where('hotel.name LIKE :name', {
                    name: name === undefined ? '%%' : `%${name}%`,
                })
                .andWhere('hotel.address LIKE :address', {
                    address: address === undefined ? '%%' : `%${address}%`,
                })
                .skip(sizePage * (numberPage - 1))
                .take(sizePage)
                .getCount(),
        ]);
        return [list, count];
    }
}
