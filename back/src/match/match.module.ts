import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from 'src/typeorm';
import { UsersModule } from 'src/users/users.module';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Match])
  ],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [MatchService]
})
export class MatchModule {}
