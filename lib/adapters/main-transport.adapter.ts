import { ipcMain } from 'electron';
import { inject, injectable } from 'inversify';
import { EventDistributor } from '../event-distributor/event-distributor';
import { BrokerEventData } from '../interfaces/broker-event-data.interface';
import { IpcTransport } from '../interfaces/ipc-transport.interface';

@injectable()
export class MainTransportAdapter implements IpcTransport {
  constructor(@inject(EventDistributor) private eventDistributor: EventDistributor) {}

  send(pattern: string, data: BrokerEventData): void {
    this.eventDistributor.broadcast(data);
  }

  register(pattern: string, handler: any): void | Promise<void> {
    ipcMain.on(pattern, (data) => {
      handler(data);
    });
  }
}