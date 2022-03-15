import { DateTime } from 'luxon';

export interface ContextualErrorJson<D extends ContextualErrorDescriptor> {
  cause?: ContextualErrorJson<D>;
  code?: ContextualErrorDescriptorCode<D>;
  context?: ContextualErrorDescriptorContext<D>;
  message?: Error['message'];
  stack?: Error['stack'];
  timestamp?: string;
}

export interface ContextualErrorDescriptor {
  code: string;
  context: Record<string, unknown>;
}

export type ContextualErrorCode<E extends ContextualError = ContextualError> = E extends ContextualError<infer D> ? ContextualErrorDescriptorCode<D> : never;

export type ContextualErrorContext<E extends ContextualError = ContextualError, C extends ContextualErrorCode<E> = ContextualErrorCode<E>> = E extends ContextualError<infer D> ? ContextualErrorDescriptorContext<D, C> : never;

export type ContextualErrorDescriptorCode<D extends ContextualErrorDescriptor = ContextualErrorDescriptor> = D['code'];

export type ContextualErrorDescriptorContext<D extends ContextualErrorDescriptor = ContextualErrorDescriptor, C extends ContextualErrorDescriptor['code'] = ContextualErrorDescriptor['code']> = D extends { code: C } ? D['context'] : never;

export type ContextualErrorOptions = {
  cause?: unknown;
  message?: Error['message'];
  timestamp?: DateTime;
};

export abstract class ContextualError<T extends ContextualErrorDescriptor = ContextualErrorDescriptor> extends Error {

  public readonly descriptor: T;
  public readonly timestamp: NonNullable<ContextualErrorOptions['timestamp']>;

  public constructor(descriptor: ContextualError<T>['descriptor'], options: ContextualErrorOptions = {}) {
    super(options.message ?? descriptor.code, options.cause ? { cause: options.cause instanceof Error ? options.cause : new Error(String(options.cause)) } : {});
    this.descriptor = descriptor;
    this.timestamp = options.timestamp ?? DateTime.now();
  }

  public toJSON() {
    const jsonify = (err: Error): ContextualErrorJson<T> => ({
      ...(err.cause ? { cause: jsonify(err.cause) } : {}), // Don't return redundant undefined properties
      ...(err.stack ? { stack: err.stack } : {}), // Don't return redundant undefined properties
      ...(err instanceof ContextualError ? {
        code: err.descriptor.code,
        context: err.descriptor.context,
        timestamp: err.timestamp.toUTC().toISO(),
        ...(err.message !== err.descriptor.code ? { message: err.message } : {}), // Only expose custom messages
      } : {
        message: err.message,
      }),
    });
    return jsonify(this);
  }

}
