/* eslint-disable @typescript-eslint/unbound-method */
import { REST, Routes } from "discord.js";
import type { Logger } from "pino";
import { describe, expect, it, type Mock, vi } from "vitest";
import type { Command } from "~/utils/create-command";
import { registerCommands } from "~/utils/register-commands";

vi.mock("discord.js", () => ({
  REST: vi.fn().mockReturnValue({
    setToken: vi.fn().mockReturnThis(),
    put: vi.fn(),
  }),
  Routes: {
    applicationGuildCommands: vi.fn(),
  },
}));

describe("registerCommands", () => {
  const mockLogger = {
    info: vi.fn(),
    error: vi.fn(),
  } as unknown as Logger;

  const mockCommand = {
    data: {
      toJSON: vi.fn().mockReturnValue({}),
    },
    execute: vi.fn(),
  } as unknown as Command;

  const botToken = "test-bot-token";
  const botClientId = "test-client-id";
  const serverId = "test-server-id";

  it("should register commands and log success", async () => {
    const commands = new Map<string, Command>([["testCommand", mockCommand]]);
    const restInstance = new REST();
    // eslint-disable-next-line unicorn/no-useless-undefined
    (restInstance.put as Mock).mockResolvedValue(undefined);
    (Routes.applicationGuildCommands as Mock).mockReturnValue("test-route");

    await registerCommands(mockLogger, commands, botToken, botClientId, serverId);

    expect(restInstance.setToken).toHaveBeenCalledWith(botToken);
    expect(Routes.applicationGuildCommands).toHaveBeenCalledWith(botClientId, serverId);
    expect(restInstance.put).toHaveBeenCalledWith("test-route", {
      body: expect.any(Array),
    });
    expect(mockLogger.info).toHaveBeenCalledWith("Registered commands to server");
  });

  it("should log and throw an error if registration fails", async () => {
    const commands = new Map<string, Command>([["testCommand", mockCommand]]);
    const restInstance = new REST();
    const errorMessage = "Failed to register commands";
    (restInstance.put as Mock).mockRejectedValue(new Error(errorMessage));

    await expect(
      registerCommands(mockLogger, commands, botToken, botClientId, serverId),
    ).rejects.toThrow(errorMessage);

    expect(mockLogger.error).toHaveBeenCalledWith(errorMessage);
  });
});
