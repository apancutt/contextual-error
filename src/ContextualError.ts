export interface ContextualErrorContext {
  code: string;
  metadata: Record<string, unknown>;
}

export type ContextualErrorOptions = {
  cause?: unknown;
  message?: Error['message'];
  timestamp?: string;
};

export abstract class ContextualError<C extends ContextualErrorContext = ContextualErrorContext> extends Error {

  public readonly context: C;
  public readonly timestamp: NonNullable<ContextualErrorOptions['timestamp']>;

  public constructor(context: ContextualError<C>['context'], options: ContextualErrorOptions = {}) {
    super(options.message ?? context.code, options.cause ? { cause: options.cause instanceof Error ? options.cause : new Error(String(options.cause)) } : {});
    this.context = context;
    this.timestamp = options.timestamp ?? new Date().toISOString();
  }

}
