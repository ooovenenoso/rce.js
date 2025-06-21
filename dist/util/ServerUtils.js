"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
class ServerUtils {
    static error(manager, error, server, details) {
        manager.events.emit(constants_1.RCEEvent.Error, { error, server, details });
    }
    static formatRpcError(data) {
        if (Array.isArray(data?.errors) && data.errors.length) {
            return data.errors
                .map((e) => {
                const dbg = e.extensions?.exception?.debug_error_string;
                return dbg ? `${e.message} (${dbg})` : e.message;
            })
                .join("; ");
        }
        return JSON.stringify(data).slice(0, 200);
    }
    static async setReady(manager, server, ready) {
        if (ready) {
            server.flags.push("READY");
        }
        else {
            server.flags = server.flags.filter((flag) => flag !== "READY");
        }
        await this.sleep(3_000);
        manager.servers.update(server);
        await manager.servers.command(server.identifier, "save");
        manager.logger.info(`[${server.identifier}] Server ${ready ? "Ready" : "Unready"}`);
        manager.events.emit(constants_1.RCEEvent.ServerReady, { server, ready });
    }
    static sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
exports.default = ServerUtils;
//# sourceMappingURL=ServerUtils.js.map