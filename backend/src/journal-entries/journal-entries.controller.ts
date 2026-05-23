import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { QueryJournalEntriesDto } from './dto/query-journal-entries.dto';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto';
import { JournalEntry } from './journal-entry.entity';
import { JournalEntriesService } from './journal-entries.service';

@ApiTags('journal-entries')
@Controller('journal-entries')
export class JournalEntriesController {
  constructor(private readonly journalEntriesService: JournalEntriesService) {}

  @Get()
  @ApiOperation({ summary: 'Список записей журнала с фильтрацией и сортировкой' })
  @ApiOkResponse({ type: [JournalEntry] })
  findAll(@Query() query: QueryJournalEntriesDto) {
    return this.journalEntriesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить запись по ID' })
  @ApiOkResponse({ type: JournalEntry })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.journalEntriesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать запись' })
  @ApiCreatedResponse({ type: JournalEntry })
  create(@Body() dto: CreateJournalEntryDto) {
    return this.journalEntriesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить запись' })
  @ApiOkResponse({ type: JournalEntry })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateJournalEntryDto,
  ) {
    return this.journalEntriesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить запись' })
  @ApiOkResponse({ schema: { example: { success: true } } })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.journalEntriesService.remove(id);
    return { success: true };
  }
}
