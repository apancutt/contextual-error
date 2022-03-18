export interface ContextualErrorContext {
  code: string;
  metadata: Record<string, unknown>;
}

export type ContextualErrorOptions = {
  cause?: unknown;
  message?: Error['message'];
  timestamp?: string;
};

export type ContextualErrorDump<E> = (
  E extends Error
    ? {
      message: E['message'];
      stack: E['stack'];
      cause: ContextualErrorDump<unknown>;
    } & (
      E extends ContextualError<infer Context>
        ? {
          code: Context['code'];
          metadata: Context['metadata'];
          timestamp: string;
        }
        : {}
    )
    : {
      message: string;
    }
);

export type ContextCode<C extends ContextualErrorContext> = C['code'];

export type ContextMetadata<C extends ContextualErrorContext, C2 extends ContextCode<C>> = C extends { code: C2 } ? C['metadata'] : never;

export type ContextualErrorCode<E extends ContextualError> = E extends ContextualError<infer C> ? ContextCode<C> : never;

export type ContextualErrorMetadata<E extends ContextualError, C extends ContextualErrorCode<E>> = E extends ContextualError<infer C2> ? ContextMetadata<C2, C> : never;

export abstract class ContextualError<C extends ContextualErrorContext = ContextualErrorContext> extends Error {

  public readonly context: C;
  public readonly timestamp: NonNullable<ContextualErrorOptions['timestamp']>;

  public constructor(context: ContextualError<C>['context'], options: ContextualErrorOptions = {}) {
    super(options.message ?? context.code, options.cause ? { cause: options.cause instanceof Error ? options.cause : new Error(String(options.cause)) } : {});
    this.context = context;
    this.timestamp = options.timestamp ?? new Date().toISOString();
  }

  public static dump<E extends unknown>(err: E) {
    const dumpFn = (err: unknown): Record<string, unknown> => {
      const result: Record<string, unknown> = {};
      if (err instanceof Error) {
        result.message = err.message;
        if (err.stack) {
          result.stack = err.stack;
        }
        if (err.cause) {
          result.cause = err.cause && dumpFn(err.cause);
        }
        if (err instanceof ContextualError) {
          result.code = err.context.code;
          result.metadata = err.context.metadata;
          result.timestamp = err.timestamp;
        }
      } else {
        result.message = String(err);
      }
      return result;
    };
    return dumpFn(err) as ContextualErrorDump<E>;
  }

  public dump() {
    return ContextualError.dump(this);
  }

  public toJSON() {
    return this.dump();
  }

}
