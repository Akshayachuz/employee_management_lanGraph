// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}


import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeModule } from './employee/employee.module';
import { KnowledgeModule } from './RAGDEMO/knowledge/knowledge.module';
import { RagModule } from './RAGDEMO/rag/rag.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin123',  
      // database: 'myprojectdb',
      database:"rag_db",
      autoLoadEntities: true,
      synchronize: true,
    }),
    // EmployeeModule
    KnowledgeModule,
    RagModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
