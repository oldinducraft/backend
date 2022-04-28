export interface LogFormat {
  [key: string]: any;
  data?: {
    [key: string]: any;
  };
  message: string;
}

export interface CustomLogger {
  debug: (data: LogFormat) => void;
  info: (data: LogFormat) => void;
  error: (data: LogFormat & { stack: string }) => void;
}

export interface LogArgs {
  message: string;
  stack?: string;
  details?: Record<string, unknown> | string;
}
