declare module 'logger-wolver' {
   interface Logger {
      syslog: (message: string) => void;
      syserr: (message: string) => void;
      success: (message: string) => void;
      info: (message: string) => void;
      debug: (message: string) => void;
      data: (message: string) => void;
      startLog: (identifier: string) => void;
      endLog: (identifier: string) => void;
      timestamp: () => string;
      getExecutionTime: (hrtime: [number, number]) => string;
      printErr: (err: unknown) => void;
   }

   const logger: Logger;
   export default logger;
}
