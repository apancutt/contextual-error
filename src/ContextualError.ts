export interface ContextualErrorContext {
  code: string;
  metadata: Record<string, unknown>;
}

export type ContextualErrorOptions = {
  cause?: unknown;
  message?: Error['message'];
  timestamp?: string;
};

export type ContextCode<Context extends ContextualErrorContext> = Context['code'];

export type ContextMetadata<Context extends ContextualErrorContext, Code extends ContextCode<Context>> = Context extends { code: Code } ? Context['metadata'] : never;

export type ContextualErrorCode<Error extends ContextualError> = Error extends ContextualError<infer Context> ? ContextCode<Context> : never;

export type ContextualErrorMetadata<Error extends ContextualError, Code extends ContextualErrorCode<Error>> = Error extends ContextualError<infer Context> ? ContextMetadata<Context, Code> : never;

export abstract class ContextualError<C extends ContextualErrorContext = ContextualErrorContext> extends Error {

  public readonly context: C;
  public readonly timestamp: NonNullable<ContextualErrorOptions['timestamp']>;

  public constructor(context: ContextualError<C>['context'], options: ContextualErrorOptions = {}) {
    super(options.message ?? context.code, options.cause ? { cause: options.cause instanceof Error ? options.cause : new Error(String(options.cause)) } : {});
    this.context = context;
    this.timestamp = options.timestamp ?? new Date().toISOString();
  }

}
