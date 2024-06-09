import { Controller, Get } from '@nestjs/common';

@Controller('healthcheck')
export class HealthCheckController {
  constructor() {}

  @Get()
  healthcheck() {
    return 'UNIVERSITY-NOTIFICATION-WORKER SERVICE IS HEALTHY ✅ 🚀.';
  }
}
