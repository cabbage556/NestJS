import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // make ValidationPipe available globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // filter any unnecessary fields from client requests
    }),
  );

  // enable ClassSerializerInterceptor globally
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)), //
  );

  // apply the PrismaClientExceptionFilter globally
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new PrismaClientExceptionFilter(httpAdapter), //
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Median')
    .setDescription('The Median API description')
    .setVersion('0.1')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  // The SwaggerModule searches for all @Body(), @Query(), and @Param() decorators on the route handlers to generate API page.
  SwaggerModule.setup('api', app, swaggerDocument);

  await app.listen(3000);
}
bootstrap();
