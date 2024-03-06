// External
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'AzureAD' })],
  exports: [],
})
export class AuthModule {
  constructor() {}
}
