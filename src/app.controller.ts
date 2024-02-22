// External
import { Controller } from '@nestjs/common';

// Internal
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
