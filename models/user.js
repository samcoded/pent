const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        bio: {
            type: String,
        },
        image: {
            type: String,
        },
        role: {
            type: String,
            required: true,
            default: 0,
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async () => {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async (password) => {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
};

module.exports = mongoose.model("User", userSchema);
