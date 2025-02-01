import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerselectwsModule } from './playerselectws/playerselectws.module';

@Module({
  imports: [PlayerselectwsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
