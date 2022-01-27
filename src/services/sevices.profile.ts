import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper, mapFrom } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import ServiceDto from './dto/service.dto';
import { Service } from './entities/service.entity';

@Injectable()
export class ServiceProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    mapProfile() {
        return (mapper: Mapper): void => {
            mapper
                .createMap(Service, ServiceDto)
                .forMember(
                    (destination: ServiceDto) => destination.desc,
                    mapFrom((source: Service) => source.desc),
                )
                .forMember(
                    (destination: ServiceDto) => destination.id,
                    mapFrom((source: Service) => source.id),
                )
                .forMember(
                    (destination: ServiceDto) => destination.name,
                    mapFrom((source: Service) => source.name),
                )
                .forMember(
                    (destination: ServiceDto) => destination.rate,
                    mapFrom((source: Service) => source.rate),
                );
        };
    }
}
