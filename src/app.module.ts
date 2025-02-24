import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerselectwsModule } from './playerselectws/playerselectws.module';
import { LoginModule } from './login/login.module';
import { GamewsModule } from './gamews/gamews.module';

@Module({
  imports: [PlayerselectwsModule, LoginModule, GamewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
