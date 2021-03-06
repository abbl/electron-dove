import 'reflect-metadata';
import { MessagePattern, UseMiddleware } from '../../../lib';
import Data from '../../../lib/decorators/data.decorator';
import { isHandlerParamMetadata } from '../../../lib/interfaces/handler-param-metadata.interface';
import { ControllerHandlersMetadataReader } from '../../../lib/metadata-readers/controller-handlers-metadata.reader';
import { MockMiddleware } from '../__mocks__/mock-middleware';

describe('ControllersHandlersMetadataReader', () => {
  let metadataReader: ControllerHandlersMetadataReader;

  beforeEach(() => {
    metadataReader = new ControllerHandlersMetadataReader();
  });

  describe('read', () => {
    it('Should ignore constructor and read only functions', () => {
      class Test {
        constructor(private a: string) {}
      }

      const handlersMetadata = metadataReader.read(new Test('test'));

      expect(handlersMetadata).toEqual({});
    });

    it('Should ignore function if its not a valid message handler', () => {
      class Test {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        public plainFunction(): void {}
      }
      const handlersMetadata = metadataReader.read(new Test());

      expect(handlersMetadata).toEqual({});
    });

    describe('Should read handler metadata', () => {
      const pattern = 'message-pattern';

      @UseMiddleware(MockMiddleware)
      class Test {
        @MessagePattern(pattern)
        @UseMiddleware(MockMiddleware)
        public coolHandler(@Data() data: string): string {
          return 'text';
        }
      }

      it('Should read and save reference to handler function', () => {
        const testClassObject = new Test();

        const handlersMetadata = metadataReader.read(testClassObject);

        expect(handlersMetadata[pattern].handler('')).toStrictEqual(testClassObject.coolHandler(''));
      });

      it('Should read and save param metadata', () => {
        const paramsHandlersMetadata = metadataReader.read(new Test())[pattern].paramsMetadata;

        expect(isHandlerParamMetadata(paramsHandlersMetadata[0])).toBe(true);
      });

      it('Should read and save type of the controller the handler belongs to', () => {
        const testClassObject = new Test();

        const handlersMetadata = metadataReader.read(testClassObject);

        expect(handlersMetadata[pattern].controller).toBe(testClassObject);
      });

      it('Should read and save middleware', () => {
        const testClassObject = new Test();

        const handlersMetadata = metadataReader.read(testClassObject);

        expect(handlersMetadata[pattern].middleware).toStrictEqual([MockMiddleware, MockMiddleware]);
      });
    });
  });
});
