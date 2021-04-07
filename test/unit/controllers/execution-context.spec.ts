import 'reflect-metadata';
import { ExecutionContext } from '../../../lib/middleware/execution-context';

describe('ExecutionContext', () => {
  let executionContext: ExecutionContext;
  const mockHandler = () => '123';

  class Test {}

  beforeAll(() => {
    executionContext = new ExecutionContext({ controller: Test, handler: mockHandler, paramsMetadata: [] }, <any>{});
  });

  describe('getClass', () => {
    it('Should return type of the controller class', () => {
      expect(executionContext.getClass()).toBe(Test);
    });
  });

  describe('getHandler', () => {
    it('Should return reference to the handler function', () => {
      const handler = executionContext.getHandler();
      expect(handler()).toBe(mockHandler());
    });
  });
});