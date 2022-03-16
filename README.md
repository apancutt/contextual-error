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

type AppErrorContext = (
  {
    code: 'ServerError';
  }
  | {
    code: 'ValidationError';
    name: string;
    reason: string;
    value?: unknown;
   }
);

class AppError extends ContextualError<AppErrorContext> {}

try {

  const request = {
    age: 'abc',
  };

  if ('number' !== typeof request.age) {
    throw new AppError({
      code: 'ValidationError',
      name: 'age',
      reason: 'Value must be a number',
      value: request.age,
    });
  }

} catch (err) {

  console.log(err);
  // AppError: ValidationError
  //   ...stack...
  //   context: {
  //     code: 'ValidationError',
  //     name: 'age',
  //     reason: 'Value must be a number',
  //     value: 'abc',
  //   },
  //   timestamp: '2000-01-01T00:00:00Z'

  if (err instanceof AppError) {
    switch (err.context.code) {
      case 'ValidationError':
        alert(`Invalid value provided for "${err.context.name}". ${err.context.reason} but you provided "${String(err.context.value ?? '')}".`);
        // Invalid value provided for "age". Value must be a number but you provided "abc".
        break;
      case 'ServerError':
        alert('Please try again later.');
        break;
    }
  }

}
```
