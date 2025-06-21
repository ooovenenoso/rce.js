import type { RustServer } from "../servers/interfaces";
import type RCEManager from "../Manager";
import { RCEEvent } from "../constants";

export default class ServerUtils {
  public static error(
    manager: RCEManager,
    error: string,
    server?: RustServer,
    details?: any
  ) {
    manager.events.emit(RCEEvent.Error, { error, server, details });
  }

  public static formatRpcError(data: any): string {
    if (Array.isArray(data?.errors) && data.errors.length) {
      return data.errors
        .map((e: any) => {
          const dbg = e.extensions?.exception?.debug_error_string;
          return dbg ? `${e.message} (${dbg})` : e.message;
        })
        .join("; ");
    }
    return JSON.stringify(data).slice(0, 200);
  }

  public static async setReady(
    manager: RCEManager,
    server: RustServer,
    ready: boolean
  ) {
    if (ready) {
      server.flags.push("READY");
    } else {
      server.flags = server.flags.filter((flag) => flag !== "READY");
    }

    await this.sleep(3_000);

    manager.servers.update(server);
    await manager.servers.command(server.identifier, "save");
    manager.logger.info(
      `[${server.identifier}] Server ${ready ? "Ready" : "Unready"}`
    );

    manager.events.emit(RCEEvent.ServerReady, { server, ready });
  }

  private static sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
