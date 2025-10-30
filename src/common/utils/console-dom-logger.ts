/**
 * Console DOM Logger - Overrides console.log to display messages in the DOM
 */
export class ConsoleDomLogger {
    private static instance: ConsoleDomLogger | null = null;
    private originalConsole: {
        log: typeof console.log;
        warn: typeof console.warn;
        error: typeof console.error;
        info: typeof console.info;
    };
    private logContainer: HTMLDivElement | null = null;
    private maxLogs: number = 100; // limit to prevent memory issues

    private constructor() {
        // store original console methods
        this.originalConsole = {
            log: console.log.bind(console),
            warn: console.warn.bind(console),
            error: console.error.bind(console),
            info: console.info.bind(console),
        };
    }

    static getInstance(): ConsoleDomLogger {
        if (!ConsoleDomLogger.instance) {
            ConsoleDomLogger.instance = new ConsoleDomLogger();
        }

        return ConsoleDomLogger.instance;
    }

    initialize(): void {
        this.createLogContainer();
        this.overrideConsoleMethods();
        this.setupKeyboardShortcut();
    }

    restore(): void {
        // restore original console methods
        console.log = this.originalConsole.log;
        console.warn = this.originalConsole.warn;
        console.error = this.originalConsole.error;
        console.info = this.originalConsole.info;

        // remove DOM elements
        const container = document.getElementById("console-dom-logger");
        const button = document.querySelector('button[onclick*="toggleVisibility"]') as HTMLButtonElement;

        if (container) {
            container.remove();
        }
        if (button) {
            button.remove();
        }

        this.logContainer = null;
    }

    private createLogContainer(): void {
        // create the log container div
        this.logContainer = document.createElement("div");
        this.logContainer.id = "console-dom-logger";
        this.logContainer.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            max-height: 300px;
            background: rgba(0, 0, 0, 0.9);
            color: #00ff00;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            padding: 10px;
            overflow-y: auto;
            z-index: 10000;
            border-top: 1px solid #333;
            display: none;
        `;

        // add toggle button
        const toggleButton = document.createElement("button");
        toggleButton.textContent = "Toggle Console";
        toggleButton.className = "console-toggle-button";
        toggleButton.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: #1976d2;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            z-index: 10001;
            font-size: 12px;
        `;
        toggleButton.onclick = (): void => this.toggleVisibility();

        document.body.appendChild(this.logContainer);
        document.body.appendChild(toggleButton);
    }

    private toggleVisibility(): void {
        if (this.logContainer) {
            const isVisible = this.logContainer.style.display !== "none";
            this.logContainer.style.display = isVisible ? "none" : "block";
        }
    }

    private overrideConsoleMethods(): void {
        console.log = (...args: Array<unknown>): void => {
            this.originalConsole.log(...args);
            this.addLogToDOM("LOG", args, "#00ff00");
        };

        console.warn = (...args: Array<unknown>): void => {
            this.originalConsole.warn(...args);
            this.addLogToDOM("WARN", args, "#ffaa00");
        };

        console.error = (...args: Array<unknown>): void => {
            this.originalConsole.error(...args);
            this.addLogToDOM("ERROR", args, "#ff0000");
        };

        console.info = (...args: Array<unknown>): void => {
            this.originalConsole.info(...args);
            this.addLogToDOM("INFO", args, "#00aaff");
        };
    }

    private addLogToDOM(level: string, args: Array<unknown>, color: string): void {
        if (!this.logContainer) return;

        const logEntry = document.createElement("div");
        logEntry.style.cssText = `
            margin-bottom: 4px;
            padding: 2px 0;
            border-bottom: 1px solid #333;
            word-wrap: break-word;
        `;

        const timestamp = new Date().toLocaleTimeString();
        const levelSpan = document.createElement("span");
        levelSpan.style.color = color;
        levelSpan.style.fontWeight = "bold";
        levelSpan.textContent = `[${timestamp}] ${level}: `;

        const messageSpan = document.createElement("span");
        messageSpan.textContent = args
            .map((arg: unknown): string => {
                if (typeof arg === "object" && arg !== null) {
                    try {
                        return JSON.stringify(arg, null, 2);
                    } catch {
                        return `[Object: ${Object.prototype.toString.call(arg)}]`;
                    }
                }

                return String(arg);
            })
            .join(" ");

        logEntry.appendChild(levelSpan);
        logEntry.appendChild(messageSpan);

        this.logContainer.appendChild(logEntry);

        // remove old logs if we exceed the limit
        const logEntries = this.logContainer.children;
        if (logEntries.length > this.maxLogs) {
            this.logContainer.removeChild(logEntries[0]);
        }

        // auto-scroll to bottom
        this.logContainer.scrollTop = this.logContainer.scrollHeight;
    }

    private setupKeyboardShortcut(): void {
        document.addEventListener("keydown", (event: KeyboardEvent): void => {
            // ctrl+Shift+C to toggle console
            if (event.ctrlKey && event.shiftKey && event.key === "C") {
                event.preventDefault();
                this.toggleVisibility();
            }
        });
    }
}
