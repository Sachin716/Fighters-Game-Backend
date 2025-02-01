import { Module } from '@nestjs/common';
import { Playerselectws } from './playerselectws';

@Module({
  providers: [Playerselectws]
})
export class PlayerselectwsModule {}
