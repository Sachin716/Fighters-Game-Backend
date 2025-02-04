import { Module } from '@nestjs/common';
import { playerselectws } from './playerselectws';

@Module({
  providers: [playerselectws]
})
export class PlayerselectwsModule {}
