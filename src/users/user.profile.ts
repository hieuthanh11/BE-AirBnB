import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper, mapFrom } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import UserDto from './dto/user.dto';

@Injectable()
export class UserProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    mapProfile() {
        return (mapper: Mapper): void => {
            mapper
                .createMap(User, UserDto)
                .forMember(
                    (destination) => destination.role,
                    mapFrom((source) => source.role.role),
                )
                .forMember(
                    (destination) => destination.status,
                    mapFrom((source) => source.status.status),
                )
                .forMember(
                    (destination) => destination.fullName,
                    mapFrom((source) => source.firstName + ' ' + source.lastName),
                );
        };
    }
}
