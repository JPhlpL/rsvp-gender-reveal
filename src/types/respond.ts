import type { Database } from "./database";

export type Respond = Database["public"]["Tables"]["responds"]["Row"];
export type RespondInsert = Database["public"]["Tables"]["responds"]["Insert"];
export type RespondUpdate = Database["public"]["Tables"]["responds"]["Update"];
