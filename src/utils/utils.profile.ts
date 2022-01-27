import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import UtilDto from './dto/util.dto';
import { Util } from './entities/util.entity';

@Injectable()
export class UtilProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    mapProfile() {
        return (mapper: Mapper): void => {
            mapper.createMap(Util, UtilDto);
        };
    }
}
