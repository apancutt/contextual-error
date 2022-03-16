import { ContextualError } from '../src/ContextualError';

interface AppErrorContext {
  code: 'ExampleError';
  param: string;
};

class AppError extends ContextualError<AppErrorContext> {}

it('creates an instance with expected properties', () => {
  const err = new AppError({ code: 'ExampleError', param: 'foo' });
  expect(err).toBeInstanceOf(AppError);
  expect(err).toBeInstanceOf(Error);
  expect(err.cause).toBeUndefined();
  expect(err.context).toStrictEqual({ code: 'ExampleError', param: 'foo' });
  expect(err.message).toBe('ExampleError');
  expect(typeof err.timestamp).toBe('string');
});

it('supports the cause option', () => {
  const cause = new Error();
  const err = new AppError({ code: 'ExampleError', param: 'foo' }, { cause });
  expect(err.cause).toStrictEqual(cause);
});

it('supports the message option', () => {
  const message = 'Foo';
  const err = new AppError({ code: 'ExampleError', param: 'foo' }, { message });
  expect(err.message).toBe(message);
});

