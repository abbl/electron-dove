import { ipcMain } from 'electron';
import { inject, injectable } from 'inversify';
import { EventDistributor } from '../../event-distributor/event-distributor';
import { BrokerEvent } from '../../interfaces/broker-event.interface';
import { IpcTransport } from '../../interfaces/ipc-transport.interface';
import { MessageHandler } from '../../types/message-handler.type';

@injectable()
export class MainTransportAdapter implements IpcTransport {
  constructor(@inject(EventDistributor) private eventDistributor: EventDistributor) {}

  send(pattern: string, data: BrokerEvent): void {
    this.eventDistributor.broadcast(data);
  }

  register(pattern: string, handler: MessageHandler): void {
    ipcMain.on(pattern, (event, data) => {
      handler(data);
    });
  }
}
