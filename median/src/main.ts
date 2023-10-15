import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Median')
    .setDescription('The Median API description')
    .setVersion('0.1')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  // The SwaggerModule searches for all @Body(), @Query(), and @Param() decorators on the route handlers to generate API page.
  SwaggerModule.setup('api', app, swaggerDocument);

  await app.listen(3000);
}
bootstrap();
