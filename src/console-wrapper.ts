export class ConsoleWrapper {
  private logs: string[];
  private static originalConsole: { [key: string]: (...args: any[]) => void } = {};
  private static isOverridden: boolean = false;

  constructor() {
    this.logs = [];
  }

  /**
   * Starts capturing console logs.
   */
  capture(): void {
    if (!ConsoleWrapper.isOverridden) {
      console.info('ConsoleWrapper: Capturing console logs');
      this.setupConsoleOverrides();
      ConsoleWrapper.isOverridden = true;
    }
    this.clear(); // Clear logs for a fresh capture session
  }

  /**
   * Clears the captured logs.
   */
  clear(): void {
    this.logs = [];
  }

  /**
   * Retrieves the captured logs as a single string.
   */
  getLogs(): string {
    return this.logs.join('\n');
  }

  /**
   * Sets up console method overrides to capture logs.
   */
  private setupConsoleOverrides(): void {
    const methods: Array<keyof Console> = ['log', 'info', 'warn', 'error'];

    methods.forEach((method) => {
      // Save the original console method only once
      if (!ConsoleWrapper.originalConsole[method]) {
        ConsoleWrapper.originalConsole[method] = console[method].bind(console);
      }

      // Override the console method
      console[method] = (...args: any[]) => {
        // Format and store the log
        const formattedArgs = args.map((arg) => {
          if (typeof arg === 'object') {
            return JSON.stringify(arg, null, 2);
          }
          return String(arg);
        });

        this.logs.push(formattedArgs.join(' '));

        // Optionally, call the original console method if needed
        // Uncomment the next line if you want logs in the browser console as well
        // ConsoleWrapper.originalConsole[method].apply(console, args);
      };
    });
  }

  /**
   * Restores the original console methods.
   */
  restore(): void {
    const methods: Array<keyof Console> = ['log', 'info', 'warn', 'error'];
    methods.forEach((method) => {
      if (ConsoleWrapper.originalConsole[method]) {
        console[method] = ConsoleWrapper.originalConsole[method];
      }
    });
    ConsoleWrapper.isOverridden = false;
  }
}
