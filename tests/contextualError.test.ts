import { ContextualError } from '../src/ContextualError';

type AppErrorDescriptor = {
  code: 'ExampleError';
  context: {
    param: string;
  };
};

class AppError<C extends AppErrorDescriptor['code'] = AppErrorDescriptor['code']> extends ContextualError<AppErrorDescriptor, C> {}

it('creates an instance with expected properties', () => {
  const err = new AppError('ExampleError', { param: 'foo' });
  expect(err).toBeInstanceOf(AppError);
  expect(err).toBeInstanceOf(Error);
  expect(err.cause).toBeUndefined();
  expect(err.code).toBe('ExampleError');
  expect(err.context).toStrictEqual({ param: 'foo' });
  expect(err.message).toBe('ExampleError');
  expect(typeof err.timestamp).toBe('string');
});

it('supports the cause option', () => {
  const cause = new Error();
  const err = new AppError('ExampleError', { param: 'foo' }, { cause });
  expect(err.cause).toStrictEqual(cause);
});

it('supports the message option', () => {
  const message = 'Foo';
  const err = new AppError('ExampleError', { param: 'foo' }, { message });
  expect(err.message).toBe(message);
});

