import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/users/user.module';
import { EnergyModule } from './modules/energy/energy.module';
import { ItemsModule } from './modules/items/items.module';
import { LeaderBoardModule } from './modules/leaderboard/leaderboard.module';
import { AuthModule } from './modules/authentication/auth.module';
import { NonceModule } from './modules/nonce/nonce.module';
import { ProfileModule } from './modules/profile/profile.module';
import { TaskModule } from './modules/task/task.module';
import { JupiterProxyMiddleware } from './modules/middlewares/jupiter.middleware';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('POSTGRES_HOST'),
          port: configService.get('POSTGRES_PORT'),
          username: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DB'),
          schema: configService.get('POSTGRES_SCHEMA'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    LeaderBoardModule,
    UserModule,
    EnergyModule,
    ProfileModule,
    ItemsModule,
    NonceModule,
    AuthModule,
    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JupiterProxyMiddleware)
      .forRoutes('jupiter-api/*');
  }
}
