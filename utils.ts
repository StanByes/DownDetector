import moment from "moment";
import User, { Role } from "./class/User";
import { Status } from "./class/Website";

export function isNullOrEmpty(value: string) {
    return value == null || value == "" || value == " ";
}

export function hasPermission(user: User, minimum: Role) {
    if (user.role == Role.OWNER)
        return true;

    return user.role <= minimum;
}