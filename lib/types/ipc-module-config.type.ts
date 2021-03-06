import { DoveMode } from '../constants/dove-mode.enum';
import { BrokerOptions } from '../interfaces/options/broker-options.interface';
import { CommonConfig } from '../interfaces/options/common-config.interface';
import { ProcessOptions } from '../interfaces/options/process-options.interface';
import { RendererOptions } from '../interfaces/options/renderer-options.interface';

export type ModuleConfig = CommonConfig &
  (
    | {
        mode: DoveMode.PROCESS;
        options: ProcessOptions;
      }
    | {
        mode: DoveMode.BROKER;
        options: BrokerOptions;
      }
    | {
        mode: DoveMode.RENDERER;
        options: RendererOptions;
      }
  );
