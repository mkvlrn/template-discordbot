import type { Dirent } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import type { Logger } from "pino";
import { describe, expect, it, vi } from "vitest";
import { createCommand } from "~/utils/create-command";
import { loadCommands } from "~/utils/load-commands";

vi.mock("node:fs/promises");
vi.mock("node:path");
vi.mock("~/utils/create-command");
vi.mock("/mock-directory-path/command1", () => ({
  name: "command1",
  description: "Description for command1",
  execute: vi.fn(),
}));
vi.mock("/mock-directory-path/command2", () => ({
  name: "command2",
  description: "Description for command2",
  execute: vi.fn(),
}));

describe("loadCommands", () => {
  const mockLogger = {
    info: vi.fn(),
  } as unknown as Logger;

  it("should load commands and log the appropriate message", async () => {
    vi.spyOn(path, "join")
      .mockReturnValueOnce("/mock-directory-path/command1")
      .mockReturnValueOnce("/mock-directory-path/command2");
    vi.spyOn(fs, "readdir").mockResolvedValue([
      "command1.ts",
      "command2.ts",
    ] as unknown as Dirent[]);

    const commands = await loadCommands(mockLogger);

    expect(commands.has("command1")).toBe(true);
    expect(commands.has("command2")).toBe(true);
    expect(createCommand).toHaveBeenCalledWith(
      "command1",
      "Description for command1",
      expect.any(Function),
    );
    expect(createCommand).toHaveBeenCalledWith(
      "command2",
      "Description for command2",
      expect.any(Function),
    );
    expect(mockLogger.info).toHaveBeenCalledWith("Loaded commands: command1, command2");
  });
});
