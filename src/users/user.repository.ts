import { Sort } from 'src/base/orderby.enum';
import { Role } from 'src/roles/entities/role.entity';
import { Status } from 'src/status/entities/status.entity';
import { Repository, EntityRepository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { SignUpUserDto } from './dto/signup-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
    async signUp(data: SignUpUserDto, role: Role, statusId: Status): Promise<User> {
        const user = new User();
        user.avatar = 'https://ibb.co/SRfFhF3';
        user.dob = data.dob;
        user.email = data.email;
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.password = data.password;
        user.phone = data.phone;
        user.role = role;
        user.userName = data.userName;
        user.status = statusId;
        return await this.save(user);
    }

    async createUser(data: CreateUserDto, roleId: Role, statusId: Status): Promise<User> {
        const user = new User();
        user.avatar = 'https://ibb.co/SRfFhF3';
        user.dob = data.dob;
        user.email = data.email;
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.password = data.password;
        user.phone = data.phone;
        user.userName = data.userName;
        user.role = roleId;
        user.status = statusId;

        return await this.save(user);
    }

    async updateUser(
        id: string,
        data: UpdateUserDto,
        role: Role,
        statusId: Status,
    ): Promise<string> {
        await this.createQueryBuilder()
            .update(User)
            .set({
                dob: data.dob,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                password: data.password,
                phone: data.phone,
                userName: data.userName,
                role: role,
                status: statusId,
            })
            .where('id = :id', { id: id })
            .execute();
        return `update successfully ${id}`;
    }

    async updateUserProfile(id: string, data: UpdateUserProfileDto): Promise<string> {
        await this.createQueryBuilder()
            .update(User)
            .set({
                avatar: data.avatar,
                dob: data.dob,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                password: data.password,
                phone: data.phone,
            })
            .where('id = :id', { id: id })
            .execute();
        return `update successfully ${id}`;
    }

    async getUserById(idUser: string): Promise<User> {
        const user = await this.createQueryBuilder('user')
            .leftJoinAndSelect('user.status', 'status')
            .leftJoinAndSelect('user.role', 'roles')
            .where('user.id = :id', {
                id: idUser,
            })
            .getOne();
        return user;
    }

    async getUserByEmail(emailUser: string): Promise<User> {
        const user = await this.createQueryBuilder('user')
            .leftJoinAndSelect('user.role', 'roles')
            .where('user.email = :email', {
                email: emailUser,
            })
            .getOne();
        return user;
    }

    async getUserByUsername(username: string): Promise<User> {
        const user = await this.createQueryBuilder('user')
            .leftJoinAndSelect('user.role', 'roles')
            .where('user.username = :username', {
                username: username,
            })
            .getOne();
        return user;
    }
    async getAllUser(): Promise<User[]> {
        const userList = await this.createQueryBuilder('user')
            .leftJoinAndSelect('user.status', 'status')
            .leftJoinAndSelect('user.role', 'roles')
            .getMany();
        return userList;
    }

    public async getAllUserPagination(
        sizePage: number,
        numberPage: number,
        email: string,
        userName: string,
        roleName: string,
        sortBy: string,
    ): Promise<[User[], number]> {
        const [list, count] = await Promise.all([
            await this.createQueryBuilder('user')
                .leftJoinAndSelect('user.status', 'status')
                .leftJoinAndSelect('user.role', 'roles')
                .where('roles.role LIKE :roleName', {
                    roleName: roleName === 'NO' ? '%%' : `${roleName}%`,
                })
                .andWhere('user.userName LIKE :userName', {
                    userName: userName === undefined ? '%%' : `${userName}%`,
                })
                .andWhere('user.email LIKE :email', {
                    email: email === undefined ? '%%' : `${email}%`,
                })
                .skip(sizePage * (numberPage - 1))
                .take(sizePage)
                .orderBy('user.userName', sortBy as Sort)
                .getMany(),
            await this.createQueryBuilder('user')
                .leftJoinAndSelect('user.status', 'status')
                .leftJoinAndSelect('user.role', 'roles')
                .where('roles.role LIKE :roleName', {
                    roleName: roleName === 'NO' ? '%%' : `${roleName}%`,
                })
                .andWhere('user.userName LIKE :userName', {
                    userName: userName === undefined ? '%%' : `${userName}%`,
                })
                .andWhere('user.email LIKE :email', {
                    email: email === undefined ? '%%' : `${email}%`,
                })
                .skip(sizePage * (numberPage - 1))
                .take(sizePage)
                .getCount(),
        ]);
        return [list, count];
    }

    async deleteUserById(id: string): Promise<string> {
        await this.createQueryBuilder().delete().from(User).where('id = :id', { id: id }).execute();
        return `Delete Successfully ${id}`;
    }

    public async uploadAvatar(file: string, userId: string): Promise<string> {
        await this.createQueryBuilder()
            .update(User)
            .set({
                avatar: file,
            })
            .where('id = :id', { id: userId })
            .execute();
        return `update avatar successfully ${userId}`;
    }

    public async resetPassword(id: string, resetPassword: string): Promise<string> {
        await this.createQueryBuilder()
            .update(User)
            .set({
                password: resetPassword,
            })
            .where('id = :id', { id: id })
            .execute();
        return `ResetPassword Successfully ${id}`;
    }

    public async updatePassword(id: string, newPassword: string): Promise<string> {
        await this.createQueryBuilder()
            .update(User)
            .set({
                password: newPassword,
            })
            .where('id = :id', { id: id })
            .execute();
        return `updatePassword Successfully ${id}`;
    }
}
