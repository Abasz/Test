import { Dexie, Transaction } from "dexie";
import { afterEach, describe, expect, it } from "vitest";

import { IHandleForcesEntity } from "../database.interfaces";

describe("AppDB", (): void => {
    const testDbName = "ESPRowingMonitorDB_MigrationTest";
    let db: Dexie;

    afterEach(async (): Promise<void> => {
        if (db?.isOpen()) {
            db.close();
        }
        await Dexie.delete(testDbName);
    });

    describe("version 3 migration", (): void => {
        it("should add driveLength of 0 to handleForces records that lack it", async (): Promise<void> => {
            db = new Dexie(testDbName);
            db.version(2).stores({
                deltaTimes: "&timeStamp, sessionId",
                handleForces: "&timeStamp, sessionId, [sessionId+strokeId]",
                sessionData: "&timeStamp, sessionId",
                connectedDevice: "&sessionId",
            });

            await db.open();
            await db.table("handleForces").bulkPut([
                {
                    timeStamp: 1000,
                    sessionId: 1,
                    strokeId: 1,
                    peakForce: 300,
                    handleForces: [100, 200, 300],
                },
                {
                    timeStamp: 2000,
                    sessionId: 1,
                    strokeId: 2,
                    peakForce: 350,
                    handleForces: [110, 210, 310],
                },
            ]);
            db.close();

            db = new Dexie(testDbName);
            db.version(2).stores({
                deltaTimes: "&timeStamp, sessionId",
                handleForces: "&timeStamp, sessionId, [sessionId+strokeId]",
                sessionData: "&timeStamp, sessionId",
                connectedDevice: "&sessionId",
            });
            db.version(3)
                .stores({
                    deltaTimes: "&timeStamp, sessionId",
                    handleForces: "&timeStamp, sessionId, [sessionId+strokeId]",
                    sessionData: "&timeStamp, sessionId",
                    connectedDevice: "&sessionId",
                })
                .upgrade(async (tx: Transaction): Promise<void> => {
                    const handleForces = tx.table<IHandleForcesEntity>("handleForces");
                    await handleForces
                        .filter((record: IHandleForcesEntity): boolean => record.driveLength === undefined)
                        .modify({ driveLength: 0 });
                });

            await db.open();

            const records = await db.table<IHandleForcesEntity>("handleForces").toArray();
            expect(records).toHaveLength(2);
            expect(records[0].driveLength).toBe(0);
            expect(records[1].driveLength).toBe(0);
        });

        it("should not overwrite existing driveLength values", async (): Promise<void> => {
            db = new Dexie(testDbName);
            db.version(2).stores({
                deltaTimes: "&timeStamp, sessionId",
                handleForces: "&timeStamp, sessionId, [sessionId+strokeId]",
                sessionData: "&timeStamp, sessionId",
                connectedDevice: "&sessionId",
            });

            await db.open();
            await db.table("handleForces").bulkPut([
                {
                    timeStamp: 1000,
                    sessionId: 1,
                    strokeId: 1,
                    peakForce: 300,
                    handleForces: [100, 200, 300],
                    driveLength: 1.5,
                },
                {
                    timeStamp: 2000,
                    sessionId: 1,
                    strokeId: 2,
                    peakForce: 350,
                    handleForces: [110, 210, 310],
                },
            ]);
            db.close();

            db = new Dexie(testDbName);
            db.version(2).stores({
                deltaTimes: "&timeStamp, sessionId",
                handleForces: "&timeStamp, sessionId, [sessionId+strokeId]",
                sessionData: "&timeStamp, sessionId",
                connectedDevice: "&sessionId",
            });
            db.version(3)
                .stores({
                    deltaTimes: "&timeStamp, sessionId",
                    handleForces: "&timeStamp, sessionId, [sessionId+strokeId]",
                    sessionData: "&timeStamp, sessionId",
                    connectedDevice: "&sessionId",
                })
                .upgrade(async (tx: Transaction): Promise<void> => {
                    const handleForces = tx.table<IHandleForcesEntity>("handleForces");
                    await handleForces
                        .filter((record: IHandleForcesEntity): boolean => record.driveLength === undefined)
                        .modify({ driveLength: 0 });
                });

            await db.open();

            const records = await db.table<IHandleForcesEntity>("handleForces").toArray();
            expect(records).toHaveLength(2);

            const recordWithExisting = records.find(
                (record: IHandleForcesEntity): boolean => record.timeStamp === 1000,
            );
            const recordWithout = records.find(
                (record: IHandleForcesEntity): boolean => record.timeStamp === 2000,
            );

            expect(recordWithExisting?.driveLength).toBe(1.5);
            expect(recordWithout?.driveLength).toBe(0);
        });
    });
});
