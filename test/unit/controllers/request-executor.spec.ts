import { ExecutionContext } from '../../../lib/controllers/execution-context';
import { HandlerParamsMapper } from '../../../lib/controllers/handler-params-mapper';
import { RequestExecutor } from '../../../lib/controllers/request-executor';
import { ControllerHandlerMetadata } from '../../../lib/interfaces/controller-handler-metadata.interface';
import Middleware from '../../../lib/interfaces/middleware.interface';
import { ControllerMetadataReader } from '../../../lib/metadata-readers/controller-metadata.reader';
import { MiddlewareExecutor } from '../../../lib/middleware/middleware-executor';
import { getMockBrokerEventData } from '../__mocks__/get-mock-broker-event-data';
import { getMockTestControllerMetadata, MOCK_TEST_CONTROLLER_PATTERN } from '../__mocks__/mock-test-controller';

describe('RequestExecutor', () => {
  let handlerMetadata: ControllerHandlerMetadata;
  let requestExecutor: RequestExecutor;
  let executionContext: ExecutionContext;
  let middleware: Middleware;

  beforeEach(() => {
    const controllerMetadata = getMockTestControllerMetadata();

    handlerMetadata = controllerMetadata.messageHandlers[MOCK_TEST_CONTROLLER_PATTERN];

    middleware = {
      onRequest: jest.fn(),
      onResponse: jest.fn(),
    };

    executionContext = new ExecutionContext(handlerMetadata, getMockBrokerEventData());

    requestExecutor = new RequestExecutor(
      [<any>middleware],
      [<any>middleware],
      () => new MiddlewareExecutor(() => middleware, [middleware]),
      new HandlerParamsMapper(),
    );
  });

  describe('executeRequest', () => {
    it('Should execute middleware onRequest method', async () => {
      await requestExecutor.executeRequest(executionContext, handlerMetadata);

      expect(middleware.onRequest).toBeCalled();
    });

    it('Should execute handler', async () => {
      const mockHandler = jest.fn();
      handlerMetadata.handler.apply = mockHandler;

      await requestExecutor.executeRequest(executionContext, handlerMetadata);

      expect(mockHandler).toBeCalled();
    });

    it('Should execute middleware onResponse method', async () => {
      await requestExecutor.executeRequest(executionContext, handlerMetadata);

      expect(middleware.onResponse).toBeCalled();
    });
  });
});
