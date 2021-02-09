import { Container } from 'inversify';
import { Symbols } from '../../constants/symbols';
import { IpcModuleConfig } from '../../types/ipc-module-config.type';
import { AbstractContainerComposer } from '../abstract/abstract-container-composer';

export class ConfigComposer extends AbstractContainerComposer {
  constructor(container: Container, private config: IpcModuleConfig) {
    super(container);
  }

  public compose(): void {
    this.container.bind(Symbols.IpcModuleConfig).toConstantValue(this.config);
  }
}