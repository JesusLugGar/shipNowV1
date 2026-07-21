import mongoose from 'mongoose';

import { USER_ROLES } from '../utils/constants.js';

const userSchema = new mongoose.Schema ({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: Object.values(USER_ROLES), default: USER_ROLES.USER },
    password: { type: String, required: true, select: false },
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;