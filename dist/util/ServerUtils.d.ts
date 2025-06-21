import type { RustServer } from "../servers/interfaces";
import type RCEManager from "../Manager";
export default class ServerUtils {
    static error(manager: RCEManager, error: string, server?: RustServer, details?: any): void;
    static formatRpcError(data: any): string;
    static setReady(manager: RCEManager, server: RustServer, ready: boolean): Promise<void>;
    private static sleep;
}
