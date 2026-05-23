import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkType } from './work-type.entity';

const SEED_WORK_TYPES: Pick<WorkType, 'name' | 'unit'>[] = [
  { name: 'Кладка перегородок', unit: 'м²' },
  { name: 'Монтаж опалубки', unit: 'м²' },
  { name: 'Бетонирование фундамента', unit: 'м³' },
  { name: 'Армирование плиты', unit: 'т' },
  { name: 'Монтаж металлоконструкций', unit: 'т' },
  { name: 'Гидроизоляция', unit: 'м²' },
  { name: 'Штукатурные работы', unit: 'м²' },
  { name: 'Электромонтаж', unit: 'м' },
];

@Injectable()
export class WorkTypesService implements OnModuleInit {
  constructor(
    @InjectRepository(WorkType)
    private readonly workTypesRepo: Repository<WorkType>,
  ) {}

  async onModuleInit() {
    const count = await this.workTypesRepo.count();
    if (count === 0) {
      await this.workTypesRepo.save(SEED_WORK_TYPES);
    }
  }

  findAll(): Promise<WorkType[]> {
    return this.workTypesRepo.find({ order: { name: 'ASC' } });
  }

  findOne(id: number): Promise<WorkType | null> {
    return this.workTypesRepo.findOne({ where: { id } });
  }
}
