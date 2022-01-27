import { ApiProperty } from '@nestjs/swagger';
export class DiscountID {
    @ApiProperty({ type: String, description: 'id discount' })
    idDiscount: string;
}
