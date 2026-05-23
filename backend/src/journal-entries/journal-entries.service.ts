import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkTypesService } from '../work-types/work-types.service';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { QueryJournalEntriesDto } from './dto/query-journal-entries.dto';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto';
import { JournalEntry } from './journal-entry.entity';

@Injectable()
export class JournalEntriesService {
  constructor(
    @InjectRepository(JournalEntry)
    private readonly entriesRepo: Repository<JournalEntry>,
    private readonly workTypesService: WorkTypesService,
  ) {}

  async findAll(query: QueryJournalEntriesDto): Promise<JournalEntry[]> {
    const qb = this.entriesRepo
      .createQueryBuilder('entry')
      .leftJoinAndSelect('entry.workType', 'workType');

    if (query.dateFrom) {
      qb.andWhere('entry.performedAt >= :dateFrom', {
        dateFrom: query.dateFrom,
      });
    }
    if (query.dateTo) {
      qb.andWhere('entry.performedAt <= :dateTo', { dateTo: query.dateTo });
    }

    qb.orderBy('entry.performedAt', (query.sort ?? 'desc').toUpperCase() as 'ASC' | 'DESC');
    qb.addOrderBy('entry.id', 'DESC');

    return qb.getMany();
  }

  async findOne(id: number): Promise<JournalEntry> {
    const entry = await this.entriesRepo.findOne({
      where: { id },
      relations: ['workType'],
    });
    if (!entry) {
      throw new NotFoundException(`Запись #${id} не найдена`);
    }
    return entry;
  }

  async create(dto: CreateJournalEntryDto): Promise<JournalEntry> {
    await this.ensureWorkTypeExists(dto.workTypeId);
    const entry = this.entriesRepo.create({
      performedAt: dto.performedAt,
      workTypeId: dto.workTypeId,
      volume: dto.volume.toString(),
      executorName: dto.executorName.trim(),
    });
    return this.entriesRepo.save(entry);
  }

  async update(id: number, dto: UpdateJournalEntryDto): Promise<JournalEntry> {
    const entry = await this.findOne(id);

    if (dto.workTypeId !== undefined) {
      await this.ensureWorkTypeExists(dto.workTypeId);
      entry.workTypeId = dto.workTypeId;
    }
    if (dto.performedAt !== undefined) {
      entry.performedAt = dto.performedAt;
    }
    if (dto.volume !== undefined) {
      entry.volume = dto.volume.toString();
    }
    if (dto.executorName !== undefined) {
      entry.executorName = dto.executorName.trim();
    }

    return this.entriesRepo.save(entry);
  }

  async remove(id: number): Promise<void> {
    const entry = await this.findOne(id);
    await this.entriesRepo.remove(entry);
  }

  private async ensureWorkTypeExists(workTypeId: number): Promise<void> {
    const workType = await this.workTypesService.findOne(workTypeId);
    if (!workType) {
      throw new BadRequestException(`Вид работ #${workTypeId} не найден`);
    }
  }
}
