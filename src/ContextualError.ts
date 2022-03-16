export interface ContextualErrorDump<D extends ContextualErrorDescriptor> {
  cause?: ContextualErrorDump<D>;
  code?: ContextualErrorDescriptorCode<D>;
  context?: ContextualErrorDescriptorContext<D>;
  message: Error['message'];
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
  timestamp?: string;
};

export abstract class ContextualError<D extends ContextualErrorDescriptor = ContextualErrorDescriptor, C extends D['code'] = D['code']> extends Error {

  public readonly code: C;
  public readonly context: ContextualErrorDescriptorContext<D, C>;
  public readonly timestamp: NonNullable<ContextualErrorOptions['timestamp']>;

  public constructor(code: ContextualError<D, C>['code'], context: ContextualError<D, C>['context'], options: ContextualErrorOptions = {}) {
    super(options.message ?? code, options.cause ? { cause: options.cause instanceof Error ? options.cause : new Error(String(options.cause)) } : {});
    this.code = code;
    this.context = context;
    this.timestamp = options.timestamp ?? new Date().toISOString();
  }

}
