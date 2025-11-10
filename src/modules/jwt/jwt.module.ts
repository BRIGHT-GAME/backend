import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          secret: configService.get<string>('JWT_ACCESS_SECRET'),
          signOptions: { expiresIn: configService.get<string>('JWT_ACCESS_EXPIRES_IN') },
        }),
    }),
  ],
  exports: [JwtModule],
})
export class JwtProviderModule {}