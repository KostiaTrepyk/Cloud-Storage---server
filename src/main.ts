import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({ origin: ['http://localhost:3000'] });

	app.use('/uploads', express.static('uploads'));

	const config = new DocumentBuilder()
		.setTitle('Cloud Storage')
		.setVersion('1.0')
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document, {
		swaggerOptions: {
			persistAuthorization: true,
		},
	});

	await app.listen(5000);
}
bootstrap();
