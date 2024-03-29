import { ThrottlerModuleOptions, ThrottlerOptionsFactory } from "@nestjs/throttler";

export class ThrottlerConfig implements ThrottlerOptionsFactory {
	createThrottlerOptions():
		| ThrottlerModuleOptions
		| Promise<ThrottlerModuleOptions> {
		return [{ ttl: 60000, limit: 100 }];
	}
}