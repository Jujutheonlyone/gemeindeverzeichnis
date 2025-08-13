import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  if ((process.env.ENABLE_SWAGGER ?? 'true') === 'true') {
    const config = new DocumentBuilder()
        .setTitle('Gemeindeverzeichnis API')
        .setDescription('REST API für Gemeindeverzeichnis-Daten (GV100AD & mehr)')
        .setVersion('0.1.0')
        .addBearerAuth() // Platzhalter für spätere Authentifizierung
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      jsonDocumentUrl: 'docs/json',
      swaggerOptions: { persistAuthorization: true },
    });
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Gemeindeverzeichnis API listening on :${port}`);
  console.log(`Swagger Docs: http://localhost:${port}/docs`);
}
bootstrap();
