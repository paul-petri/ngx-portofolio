import { Command } from "./commands"

export type Message<T> = {
    cmd: Command
    data: T,
    prm: any,
    err?: string,
    OK: boolean
}