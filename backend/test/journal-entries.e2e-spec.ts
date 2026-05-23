import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { JournalEntry } from '../src/journal-entries/journal-entry.entity';
import { JournalEntriesModule } from '../src/journal-entries/journal-entries.module';
import { WorkType } from '../src/work-types/work-type.entity';
import { WorkTypesModule } from '../src/work-types/work-types.module';

describe('Journal API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [WorkType, JournalEntry],
          synchronize: true,
        }),
        WorkTypesModule,
        JournalEntriesModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /work-types — справочник предзаполнен', async () => {
    const res = await request(app.getHttpServer()).get('/work-types').expect(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      unit: expect.any(String),
    });
  });

  it('POST → GET → PATCH → DELETE — полный CRUD', async () => {
    const today = new Date().toISOString().slice(0, 10);

    const created = await request(app.getHttpServer())
      .post('/journal-entries')
      .send({
        performedAt: today,
        workTypeId: 1,
        volume: 12.5,
        executorName: 'Тестов Т.Т.',
      })
      .expect(201);

    expect(created.body).toMatchObject({
      id: expect.any(Number),
      executorName: 'Тестов Т.Т.',
      workTypeId: 1,
    });

    const id = created.body.id as number;

    await request(app.getHttpServer())
      .get('/journal-entries')
      .expect(200)
      .expect((res) => {
        expect(res.body.some((e: { id: number }) => e.id === id)).toBe(true);
      });

    await request(app.getHttpServer())
      .patch(`/journal-entries/${id}`)
      .send({ volume: 15 })
      .expect(200)
      .expect((res) => {
        expect(parseFloat(res.body.volume)).toBe(15);
      });

    await request(app.getHttpServer())
      .delete(`/journal-entries/${id}`)
      .expect(200);

    await request(app.getHttpServer()).get(`/journal-entries/${id}`).expect(404);
  });

  it('GET /journal-entries — отклоняет некорректный диапазон дат', async () => {
    await request(app.getHttpServer())
      .get('/journal-entries?dateFrom=2026-05-31&dateTo=2026-05-01')
      .expect(400);
  });

  it('POST — отклоняет дату в будущем', async () => {
    await request(app.getHttpServer())
      .post('/journal-entries')
      .send({
        performedAt: '2099-01-01',
        workTypeId: 1,
        volume: 1,
        executorName: 'Будущий',
      })
      .expect(400);
  });
});
