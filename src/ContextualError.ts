import { DateTime } from 'luxon';

export interface ContextualErrorJson<T extends ContextualErrorDescriptor> {
  cause?: ContextualErrorJson<T>;
  code?: ContextualError<T>['code'];
  context?: ContextualError<T>['context'];
  message?: Error['message'];
  stack?: Error['stack'];
  timestamp?: string;
}

export interface ContextualErrorDescriptor {
  code: string;
  context: Record<string, unknown>;
}

export type ContextualErrorCode<E extends ContextualError> = E extends ContextualError<infer D> ? D['code'] : never;

export type ContextualErrorContext<E extends ContextualError, C extends ContextualErrorCode<E>> = E extends ContextualError<infer D> ? D extends { code: C } ? D['context'] : never : never;

export type ContextualErrorOptions = {
  cause?: unknown;
  message?: Error['message'];
  timestamp?: DateTime;
};

export abstract class ContextualError<T extends ContextualErrorDescriptor = ContextualErrorDescriptor> extends Error {

  public readonly code: T['code'];
  public readonly context: T['context'];
  public readonly timestamp: NonNullable<ContextualErrorOptions['timestamp']>;

  public constructor(descriptor: T, options: ContextualErrorOptions = {}) {
    super(options.message ?? descriptor.code, options.cause ? { cause: options.cause instanceof Error ? options.cause : new Error(String(options.cause)) } : {});
    this.code = descriptor.code;
    this.context = descriptor.context;
    this.timestamp = options.timestamp ?? DateTime.now();
  }

  public toJSON() {
    const jsonify = (err: Error): ContextualErrorJson<T> => ({
      ...(err.cause ? { cause: jsonify(err.cause) } : {}), // Don't return redundant undefined properties
      ...(err.stack ? { stack: err.stack } : {}), // Don't return redundant undefined properties
      ...(err instanceof ContextualError ? {
        code: err.code,
        context: err.context,
        timestamp: err.timestamp.toUTC().toISO(),
        ...(err.message !== err.code ? { message: err.message } : {}), // Only expose custom messages
      } : {
        message: err.message,
      }),
    });
    return jsonify(this);
  }

}
