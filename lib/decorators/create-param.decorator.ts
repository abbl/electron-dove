import 'reflect-metadata';
import { HANDLER_ARGS_METADATA } from '../constants/decorators';
import { BrokerEventData } from '../interfaces/broker-event-data.interface';

export function createParamDecorator<T>(method: (options: T, eventData: BrokerEventData) => any) {
  return (options?: T): ParameterDecorator => {
    return (target, propertyKey, index) => {
      const args: any[] = Reflect.getMetadata(HANDLER_ARGS_METADATA, target, propertyKey) || [];
      const type = Reflect.getMetadata('design:paramtypes', target, propertyKey);

      args.push({ index: index, method: method, options: options, type: type[index] });

      Reflect.defineMetadata(HANDLER_ARGS_METADATA, args, target, propertyKey);
    };
  };
}
