import mongoose from 'mongoose';

const userSchema = new mongoose.Schema ({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'user' },
    password: { type: String, required: true, select: false },
    //cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart", default: null }
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;