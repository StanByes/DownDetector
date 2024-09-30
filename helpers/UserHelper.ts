import { ObjectId } from "mongodb";
import { users } from "../database/cache";

export default {
    findUser: (id: ObjectId) => {
        return users.find(u => u._id.equals(id));
    }
}