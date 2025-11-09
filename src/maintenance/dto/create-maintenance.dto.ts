import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateMaintenanceDto {
    @ApiProperty({
        example: 2,
        description: "Texnik xizmatni amalga oshiruvchi evakuator (tow_truck) ID raqami",
    })
    @IsInt({ message: "tow_truck_id butun son (integer) bo'lishi kerak" })
    @IsNotEmpty({ message: "tow_truck_id kiritilishi shart" })
    tow_truck_id: number;

    @ApiProperty({
        example: "Dvigatel moyi va filtrlari almashtirildi",
        description: "Texnik xizmat haqida to'liq tavsif",
    })
    @IsString({ message: "description matn (string) bo'lishi kerak" })
    @IsNotEmpty({ message: "description kiritilishi shart" })
    description: string;

    @ApiProperty({
        example: 2,
        description: "Texnik xizmatni bajargan xodim (staff) ID raqami",
    })
    @IsInt({ message: "performed_by butun son (integer) bo'lishi kerak" })
    @IsNotEmpty({ message: "performed_by kiritilishi shart" })
    performed_by: number;
}
