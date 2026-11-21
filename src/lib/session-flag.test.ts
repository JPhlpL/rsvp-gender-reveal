import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type SessionFlagModule = typeof import("./session-flag");

async function load(): Promise<SessionFlagModule> {
  vi.resetModules();
  return import("./session-flag");
}

function storage(overrides: Partial<Storage> = {}): Storage {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
    clear: () => data.clear(),
    key: () => null,
    length: 0,
    ...overrides,
  } as Storage;
}

beforeEach(() => {
  vi.unstubAllGlobals();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("session flags", () => {
  it("reads a flag saved earlier in the browser session", async () => {
    const store = storage();
    store.setItem("opened", "true");
    vi.stubGlobal("window", { sessionStorage: store });
    const { readSessionFlag } = await load();
    expect(readSessionFlag("opened")).toBe(true);
  });

  it("saves the flag to sessionStorage when it works", async () => {
    const store = storage();
    vi.stubGlobal("window", { sessionStorage: store });
    const { writeSessionFlag } = await load();
    writeSessionFlag("opened");
    expect(store.getItem("opened")).toBe("true");
  });

  it("returns false instead of throwing when storage is blocked", async () => {
    vi.stubGlobal("window", {
      get sessionStorage(): Storage {
        throw new Error("SecurityError: The operation is insecure.");
      },
    });
    const { readSessionFlag } = await load();
    expect(() => readSessionFlag("opened")).not.toThrow();
    expect(readSessionFlag("opened")).toBe(false);
  });

  it("remembers the flag in memory when storage is blocked", async () => {
    vi.stubGlobal("window", {
      get sessionStorage(): Storage {
        throw new Error("SecurityError: The operation is insecure.");
      },
    });
    const { readSessionFlag, writeSessionFlag } = await load();
    expect(() => writeSessionFlag("opened")).not.toThrow();
    expect(readSessionFlag("opened")).toBe(true);
  });

  it("remembers the flag when reading works but saving throws (quota / private mode)", async () => {
    vi.stubGlobal("window", {
      sessionStorage: storage({
        setItem: () => {
          throw new Error("QuotaExceededError");
        },
      }),
    });
    const { readSessionFlag, writeSessionFlag } = await load();
    writeSessionFlag("opened");
    expect(readSessionFlag("opened")).toBe(true);
  });
});
