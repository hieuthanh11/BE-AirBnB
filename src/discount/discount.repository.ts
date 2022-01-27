import { Status } from 'src/status/entities/status.entity';
import { User } from 'src/users/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { Discount } from './entities/discount.entity';

@EntityRepository(Discount)
export class DiscountRepository extends Repository<Discount> {
    public async createDiscount(
        data: CreateDiscountDto,
        status: Status,
        user: User,
    ): Promise<string> {
        const discount = new Discount();
        discount.price = data.price;
        discount.description = data.desc;
        discount.exp = data.exp;
        discount.status = status;
        discount.create_person = user.userName;
        discount.user = user;
        const discountSave = await this.save(discount);
        return `Create successfully with ${discountSave.id}`;
    }

    public async getAllDiscount(
        sizePage: number,
        numberPage: number,
        statusName: string,
    ): Promise<[Discount[], number]> {
        const [list, count] = await Promise.all([
            await this.createQueryBuilder('discount')
                .leftJoinAndSelect('discount.status', 'status')
                .leftJoinAndSelect('discount.user', 'user')
                .leftJoinAndSelect('discount.rooms', 'room')
                .leftJoinAndSelect('room.hotels', 'hotel')
                .leftJoinAndSelect('hotel.user', 'hotelUser')
                .leftJoinAndSelect('user.role', 'roles')
                .where('status.status LIKE :statusName', {
                    statusName: statusName === 'NO' ? '%%' : `${statusName}%`,
                })
                .skip(sizePage * (numberPage - 1))
                .take(sizePage)
                .getMany(),
            await this.createQueryBuilder('discount')
                .leftJoinAndSelect('discount.status', 'status')
                .leftJoinAndSelect('discount.user', 'user')
                .leftJoinAndSelect('discount.rooms', 'room')
                .leftJoinAndSelect('room.hotels', 'hotel')
                .leftJoinAndSelect('hotel.user', 'hotelUser')
                .leftJoinAndSelect('user.role', 'roles')
                .where('status.status LIKE :statusName', {
                    statusName: statusName === 'NO' ? '%%' : `${statusName}%`,
                })
                .skip(sizePage * (numberPage - 1))
                .take(sizePage)
                .getCount(),
        ]);
        return [list, count];
    }

    public async findDiscountById(id: string): Promise<Discount> {
        return await this.createQueryBuilder('discount')
            .leftJoinAndSelect('discount.status', 'status')
            .leftJoinAndSelect('discount.user', 'user')
            .leftJoinAndSelect('discount.rooms', 'room')
            .leftJoinAndSelect('room.hotels', 'hotel')
            .leftJoinAndSelect('hotel.user', 'hotelUser')
            .leftJoinAndSelect('user.role', 'roles')
            .where('discount.id = :id', {
                id: id,
            })
            .getOne();
    }

    public async findDiscountByPrice(price: number): Promise<Discount> {
        return await this.createQueryBuilder('discount')
            .where('discount.price = :pri', {
                pri: price,
            })
            .getOne();
    }

    public async findDiscountByDesc(desc: string): Promise<Discount> {
        return await this.createQueryBuilder('discount')
            .where('discount.description = :desc', { desc: desc })
            .getOne();
    }

    public async findDiscountByExp(exp: string): Promise<Discount> {
        return await this.createQueryBuilder('discount')
            .where('discount.exp = :exp', { exp: exp })
            .getOne();
    }

    public async deleteDiscountById(id: string): Promise<string> {
        await this.createQueryBuilder()
            .delete()
            .from(Discount)
            .where('id = :id', { id: id })
            .execute();
        return `Delete Successfully ${id}`;
    }

    public async updateDiscountById(id: string, data: UpdateDiscountDto): Promise<string> {
        await this.createQueryBuilder()
            .update(Discount)
            .set({
                price: data.price,
                description: data.desc,
                exp: data.exp,
            })
            .where('id = :id', { id: id })
            .execute();
        return `Update Successfully ${id}`;
    }

    public async updateStatusOfDiscountById(id: string, data: Status): Promise<string> {
        await this.createQueryBuilder()
            .update(Discount)
            .set({
                status: data,
            })
            .where('id = :id', { id: id })
            .execute();
        return `Update Status Of Discount ${id} Successfully `;
    }
}
