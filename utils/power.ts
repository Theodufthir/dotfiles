import { exec } from "ags/process";
const sudo = (cmd: string) => exec(`systemctl ${cmd}`)

const suspend = (hibernate: boolean = true) => sudo("suspend" + (hibernate ? "-then-hibernate" : ""))
const hibernate = (hybrid: boolean = false) => sudo(hybrid ? "hybrid-sleep" : "hibernate")
const reboot = () => sudo("reboot")
const poweroff = () => sudo("poweroff")

export {
    suspend,
    hibernate,
    reboot,
    poweroff
}