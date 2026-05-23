import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WorkType } from './work-type.entity';
import { WorkTypesService } from './work-types.service';

@ApiTags('work-types')
@Controller('work-types')
export class WorkTypesController {
  constructor(private readonly workTypesService: WorkTypesService) {}

  @Get()
  @ApiOperation({ summary: 'Справочник видов работ' })
  @ApiOkResponse({ type: [WorkType] })
  findAll() {
    return this.workTypesService.findAll();
  }
}
