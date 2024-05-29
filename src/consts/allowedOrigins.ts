import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

export const allowedOrigins: CorsOptions['origin'] = ['http://localhost:3000'];
