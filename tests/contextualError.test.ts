import { DateTime } from 'luxon';
import { ContextualError } from '../src/ContextualError';

type AppErrorDescriptor = {
  code: 'ExampleError';
  context: {
    param: string;
  };
};

class AppError extends ContextualError<AppErrorDescriptor> {}

it('creates an instance with expected properties', () => {
  const err = new AppError({ code: 'ExampleError', context: { param: 'foo' } });
  expect(err).toBeInstanceOf(AppError);
  expect(err).toBeInstanceOf(Error);
  expect(err.cause).toBeUndefined();
  expect(err.context).toBeDefined();
  expect(err.code).toBe('ExampleError');
  expect(err.message).toBe('ExampleError');
  expect(err.timestamp).toBeInstanceOf(DateTime);
  expect(err.timestamp.valueOf()).toBeLessThan(DateTime.now().valueOf());
});

it('supports the cause option', () => {
  const cause = new Error();
  const err = new AppError({ code: 'ExampleError', context: { param: 'foo' } }, { cause });
  expect(err.cause).toStrictEqual(cause);
});

it('supports the message option', () => {
  const message = 'Foo';
  const err = new AppError({ code: 'ExampleError', context: { param: 'foo' } }, { message });
  expect(err.message).toBe(message);

});

it('produces the expected JSON string', () => {
  const err = new AppError({ code: 'ExampleError', context: { param: 'foo' } }, { timestamp: DateTime.fromISO('2000-01-01T00:00:00Z') });
  const obj = err.toJSON();
  expect(obj).toBeDefined();
  expect(typeof obj).toBe('object');
  expect(typeof obj.stack).toBe('string');
  expect(obj.stack?.length).toBeGreaterThan(0);
  delete obj.stack; // Stack will never be reproducible across platforms
  expect(JSON.stringify(obj)).toBe('{"code":"ExampleError","context":{"param":"foo"},"timestamp":"2000-01-01T00:00:00.000Z"}');

});
