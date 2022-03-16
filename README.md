# `contextual-error`

Emit errors described by a code and context.

## Installation

```bash
yarn add contextual-error
# Or if you are using NPM:
# npm install --save contextual-error
```

## Example

```typescript
import { ContextualError } from 'contextual-error';

type AppErrorDescriptor = (
  {
    code: 'ServerError';
    context: Record<string, never>;
  }
  | {
    code: 'ValidationError';
    context: {
      name: string;
      reason: string;
      value?: unknown;
    };
  }
);

class AppError<C extends AppErrorDescriptor['code'] = AppErrorDescriptor['code']> extends ContextualError<AppErrorDescriptor, C> {}

try {

  const request = {
    age: 'abc',
  };

  if ('number' !== typeof request.age) {
    throw new AppError('ValidationError', {
      name: 'age',
      reason: 'Value must be a number',
      value: request.age,
    });
  }

} catch (err) {

  console.log(err);
  // AppError: ValidationError
  //   ...stack...
  //   code: 'ValidationError',
  //   context: {
  //     name: 'age',
  //     reason: 'Value must be a number',
  //     value: 'abc',
  //   },
  //   timestamp: '2000-01-01T00:00:00Z'

  if (err instanceof AppError) {
    switch (err.code) {
      case 'ValidationError':
        alert(`Invalid value provided for "${err.context.name}". ${err.context.reason} but you provided "${String(err.context.value ?? '')}".`);
        // Invalid value provided for "age". Value must be a number but you provided "abc".
        break;
    }
  }

}

```
