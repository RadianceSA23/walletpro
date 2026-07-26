import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  const mockConnection = {
    readyState: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: getConnectionToken(),
          useValue: mockConnection,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return ok health status when DB is connected', () => {
    const result = controller.checkHealth();
    expect(result.status).toBe('ok');
    expect(result.services.database.status).toBe('connected');
  });
});
