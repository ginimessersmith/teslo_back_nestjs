import { Test, TestingModule } from '@nestjs/testing';
import { MessagesWebSocketService } from './messages-web-socket.service';

describe('MessagesWebSocketService', () => {
  let service: MessagesWebSocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessagesWebSocketService],
    }).compile();

    service = module.get<MessagesWebSocketService>(MessagesWebSocketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
