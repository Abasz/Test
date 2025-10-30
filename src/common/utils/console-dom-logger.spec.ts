import { ConsoleDomLogger } from "./console-dom-logger";

describe("ConsoleDomLogger", (): void => {
    let logger: ConsoleDomLogger;
    let originalConsole: {
        log: typeof console.log;
        warn: typeof console.warn;
        error: typeof console.error;
        info: typeof console.info;
    };

    beforeEach((): void => {
        // store original console methods
        originalConsole = {
            log: console.log,
            warn: console.warn,
            error: console.error,
            info: console.info,
        };

        // create a fresh instance for each test
        logger = ConsoleDomLogger.getInstance();

        // clean up any existing DOM elements
        const existingContainer = document.getElementById("console-dom-logger");
        const existingButton = document.querySelector('button[onclick*="toggleVisibility"]');
        if (existingContainer) existingContainer.remove();
        if (existingButton) existingButton.remove();
    });

    afterEach((): void => {
        // restore original console methods
        console.log = originalConsole.log;
        console.warn = originalConsole.warn;
        console.error = originalConsole.error;
        console.info = originalConsole.info;

        // clean up DOM elements
        logger.restore();
    });

    describe("initialization", (): void => {
        it("should create a singleton instance", (): void => {
            const instance1 = ConsoleDomLogger.getInstance();
            const instance2 = ConsoleDomLogger.getInstance();

            expect(instance1).toBe(instance2);
        });

        it("should create log container and toggle button in DOM", (): void => {
            logger.initialize();

            const logContainer = document.getElementById("console-dom-logger");
            const toggleButton = document.querySelector("button");

            expect(logContainer).toBeTruthy();
            expect(logContainer?.style.display).toBe("none");
            expect(toggleButton).toBeTruthy();
            expect(toggleButton?.textContent).toBe("Toggle Console");
        });

        it("should override console methods", (): void => {
            logger.initialize();

            expect(console.log).not.toBe(originalConsole.log);
            expect(console.warn).not.toBe(originalConsole.warn);
            expect(console.error).not.toBe(originalConsole.error);
            expect(console.info).not.toBe(originalConsole.info);
        });
    });

    describe("console overrides", (): void => {
        beforeEach((): void => {
            logger.initialize();
        });

        it("should add log entry to DOM when console.log is called", (): void => {
            console.log("Test message");

            const logContainer = document.getElementById("console-dom-logger");
            const logEntries = logContainer?.children;

            expect(logEntries?.length).toBe(1);
            expect(logEntries?.[0].textContent).toContain("LOG: Test message");
        });

        it("should add warn entry to DOM when console.warn is called", (): void => {
            console.warn("Test warning");

            const logContainer = document.getElementById("console-dom-logger");
            const logEntries = logContainer?.children;

            expect(logEntries?.length).toBe(1);
            expect(logEntries?.[0].textContent).toContain("WARN: Test warning");
        });

        it("should add error entry to DOM when console.error is called", (): void => {
            console.error("Test error");

            const logContainer = document.getElementById("console-dom-logger");
            const logEntries = logContainer?.children;

            expect(logEntries?.length).toBe(1);
            expect(logEntries?.[0].textContent).toContain("ERROR: Test error");
        });

        it("should add info entry to DOM when console.info is called", (): void => {
            console.info("Test info");

            const logContainer = document.getElementById("console-dom-logger");
            const logEntries = logContainer?.children;

            expect(logEntries?.length).toBe(1);
            expect(logEntries?.[0].textContent).toContain("INFO: Test info");
        });

        it("should handle multiple arguments", (): void => {
            console.log("Message", { key: "value" }, 123);

            const logContainer = document.getElementById("console-dom-logger");
            const logEntries = logContainer?.children;

            expect(logEntries?.length).toBe(1);
            expect(logEntries?.[0].textContent).toContain("Message");
            expect(logEntries?.[0].textContent).toContain("key");
            expect(logEntries?.[0].textContent).toContain("123");
        });

        it("should handle object serialization", (): void => {
            const testObject = { name: "test", value: 42 };
            console.log(testObject);

            const logContainer = document.getElementById("console-dom-logger");
            const logEntry = logContainer?.children[0];

            expect(logEntry?.textContent).toContain('"name": "test"');
            expect(logEntry?.textContent).toContain('"value": 42');
        });

        it("should include timestamp in log entries", (): void => {
            console.log("Test message");

            const logContainer = document.getElementById("console-dom-logger");
            const logEntry = logContainer?.children[0];
            const timestampRegex = /\[\d{1,2}:\d{2}:\d{2}\]/;

            expect(logEntry?.textContent).toMatch(timestampRegex);
        });
    });

    describe("DOM interaction", (): void => {
        beforeEach((): void => {
            logger.initialize();
        });

        it("should toggle visibility when button is clicked", (): void => {
            const logContainer = document.getElementById("console-dom-logger");
            const toggleButton = document.querySelector("button") as HTMLButtonElement;

            expect(logContainer?.style.display).toBe("none");

            toggleButton.click();
            expect(logContainer?.style.display).toBe("block");

            toggleButton.click();
            expect(logContainer?.style.display).toBe("none");
        });

        it("should limit number of log entries", (): void => {
            // add more than maxLogs (100) entries
            for (let i = 0; i < 105; i++) {
                console.log(`Message ${i}`);
            }

            const logContainer = document.getElementById("console-dom-logger");
            const logEntries = logContainer?.children;

            expect(logEntries?.length).toBeLessThanOrEqual(100);
            // should keep the most recent entries
            expect(logEntries?.[logEntries.length - 1].textContent).toContain("Message 104");
        });
    });

    describe("cleanup", (): void => {
        beforeEach((): void => {
            logger.initialize();
        });

        it("should restore original console methods", (): void => {
            logger.restore();

            expect(console.log).toBe(originalConsole.log);
            expect(console.warn).toBe(originalConsole.warn);
            expect(console.error).toBe(originalConsole.error);
            expect(console.info).toBe(originalConsole.info);
        });

        it("should remove DOM elements", (): void => {
            logger.restore();

            const logContainer = document.getElementById("console-dom-logger");
            const toggleButton = document.querySelector("button");

            expect(logContainer).toBeNull();
            expect(toggleButton).toBeNull();
        });
    });
});
