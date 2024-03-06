// External
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Internal
import { UsersModule } from './users/users.module';
import { AuthModule } from './application/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AzureADStrategy } from './application/auth/guards/azure-ad-strategy';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: '1234',
      database: 'postgres',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  providers: [AzureADStrategy],
})
export class AppModule {}
