import { IsString, IsIP, IsUrl } from 'class-validator';

export class CreateServerDto {
  @IsString()
  name: string;

  // @IsIP('4')
  // internalIp: string;
  @IsUrl()
  baseUri: string;
}
