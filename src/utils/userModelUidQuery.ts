import { UserModel } from "../models/User";



export const userModelUidQuery = async (uid: string) => {
    const user = await UserModel.findOne({ uid })
    if (!user) throw new Error('User does not exist');
    return user
}