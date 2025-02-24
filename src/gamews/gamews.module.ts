import { Module } from '@nestjs/common';
import { WSfunction } from './game';

@Module({
    imports: [WSfunction]
})
export class GamewsModule { }
