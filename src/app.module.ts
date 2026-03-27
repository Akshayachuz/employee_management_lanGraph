import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeModule } from './employee/employee.module';
import { KnowledgeModule } from './RAGDEMO/knowledge/knowledge.module';
import { RagModule } from './RAGDEMO/rag/rag.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'nanonino',  
      // database: 'myprojectdb',
      database:"rag_db",
      autoLoadEntities: true,
      synchronize: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    // EmployeeModule
    KnowledgeModule,
    RagModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
