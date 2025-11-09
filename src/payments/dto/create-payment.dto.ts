import { IsNumber, IsString, IsPositive, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
    @ApiProperty({
        description: 'Impound record ID for which the payment is made',
        example: 1,
        required: true,
    })
    @IsNumber()
    @IsPositive({ message: 'Record ID must be a positive number' }) // Qo'shilgan: positive bo'lishini ta'minlaydi
    recordId: number;

    @ApiProperty({
        description: 'User ID who is making the payment',
        example: 2,
        required: true,
    })
    @IsNumber()
    @IsPositive({ message: 'User ID must be a positive number' }) // Qo'shilgan: positive bo'lishini ta'minlaydi
    userId: number;

    @ApiProperty({
        description: 'Payment method (cash, card, online, etc.)',
        example: 'card',
        enum: ['cash', 'card', 'online', 'bank_transfer'], // Qo'shilgan: mumkin bo'lgan qiymatlar
        required: true,
    })
    @IsString()
    @IsEnum(['cash', 'card', 'online', 'bank_transfer'], { message: 'Invalid payment method' }) // Qo'shilgan: enum validation
    paymentMethod: string;
}