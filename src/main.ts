import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/error/error.handing';
import { winstonConfig } from './common/logging/winston.loggin';
import { WinstonModule } from 'nest-winston';

async function bootstrap() {
  try {
    const PORT = process.env.PORT ?? 3000;
    const app = await NestFactory.create(AppModule, {
      // logger: ["error", "warn"],
      logger: WinstonModule.createLogger(winstonConfig)
    });
    app.useGlobalFilters(new AllExceptionsFilter());

    app.use(cookieParser());
    app.setGlobalPrefix("api"); 
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, 
    }));

    const config = new DocumentBuilder()
      .setTitle("Jarima Maydoni Project")
      .setDescription("The Prisma API description")
      .setVersion("1.0") 
      .addTag("Nest, access and refresh tokens, cookies, Prisma, passport, decorator")
      .addBearerAuth({
        type: 'http',
        scheme: 'Bearer',
        in: 'Header',
      })
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document);

    await app.listen(PORT, () => {
      console.log(`Server start at: http://localhost:${PORT}/api`);
      console.log(`Server start at: http://localhost:${PORT}/api/docs`);
    });
  } catch (error) {
    console.log(error);
  }
}
bootstrap();
