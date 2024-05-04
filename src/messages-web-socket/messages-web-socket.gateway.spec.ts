import { Test, TestingModule } from '@nestjs/testing';
import { MessagesWebSocketGateway } from './messages-web-socket.gateway';
import { MessagesWebSocketService } from './messages-web-socket.service';

describe('MessagesWebSocketGateway', () => {
  let gateway: MessagesWebSocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessagesWebSocketGateway, MessagesWebSocketService],
    }).compile();

    gateway = module.get<MessagesWebSocketGateway>(MessagesWebSocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
