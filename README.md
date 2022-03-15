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

class AppError extends ContextualError<AppErrorDescriptor> {}

try {

  const request = {
    age: 'abc',
  };

  if ('number' !== typeof request.age) {
    throw new AppError({
      code: 'ValidationError',
      context: {
        name: 'age',
        reason: 'Age must be a number',
        value: request.age,
      },
    });
  }

} catch (err) {

  console.log(err);

  // {
  //   code: 'ValidationError',
  //   context: {
  //     name: 'age',
  //     reason: 'Age must be a number',
  //     value: 'abc',
  //   },
  //   stack: <string>,
  //   timestamp: <DateTime>,
  // }

}

```
