import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class JsonLogger extends ConsoleLogger {
    log(message: any, context?: string) {
        this.printJson('INFO', message, context || this.context);
    }

    error(message: any, stack?: string, context?: string) {
        this.printJson('ERROR', message, context || this.context, stack);
    }

    warn(message: any, context?: string) {
        this.printJson('WARNING', message, context || this.context);
    }

    debug(message: any, context?: string) {
        this.printJson('DEBUG', message, context || this.context);
    }

    verbose(message: any, context?: string) {
        this.printJson('INFO', message, context || this.context);
    }

    private printJson(severity: string, message: any, context?: string, stack?: string) {
        const logEntry = {
            severity,
            message: typeof message === 'object' ? JSON.stringify(message) : message,
            timestamp: new Date().toISOString(),
            context: context || 'Application',
            stack,
        };

        console.log(JSON.stringify(logEntry));
    }
}
