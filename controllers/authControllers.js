import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "../models/user.model.js";
import Tokens from "../models/token.model.js";
import { sendMail } from "../utils/sendEmail.js";

//Regisration
export const register = async (req, res) => {
    try {
        const payload = req.body;

        if (!payload.userId) {
            return res.status(400).send(`email is mandatory!`);
        }

        if (!payload.password) {
            return res.status(400).send(`password is mandatory!`);
        }
        //Hashing the password
        const hashedValue = await bcrypt.hash(payload.password, 12);
        payload.hashedPassword = hashedValue;
        //Deleting password
        delete payload.password;

        //validating the data
        const newUser = new Users(payload);

        //Saving the user
        const user = await newUser.save();

        //Generating token with id and secret key
        const newToken = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
        //Hashing the token
        const hashedToken = await bcrypt.hash(newToken, 10);

        //storing token to DB
        const tokenPayload = new Tokens({ userId: user._id, token: hashedToken, createdAt: Date.now() });
        await tokenPayload.save();

        //Creating link
        const link = `https://urlshortener-frontapp.netlify.app/activate?token=${newToken}&id=${user._id}`;


        //Sending link to the Email
        await sendMail(newUser.userId, "Activation link", { name: newUser.firstName, link: link });
        res.status(200).send({ message: `Email sent successfully . Link: ${link}` });

    } catch (error) {
        res.status(500).send(`Internal server error: ${error}`);
    }
}

//Activating user
export const activate = async (req, res) => {
    try {
        const { id, token } = req.body;

        //Checking userId present in Token data
        const isToken = await Tokens.findOne({ userId: id });

        if (!isToken) {
            return res.status(400).send({ message: "Invalid or expired token." });
        }
        //Validating Token
        const isValid = await bcrypt.compare(token, isToken.token);


        if (!isValid) {
            return res.status(400).send({ message: 'Invalid token.' });
        }

        //Activating user
        await Users.findOneAndUpdate({ _id: id }, { active: true });

        //Deleting TOKEN data after reset
        await isToken.deleteOne();
        return res.status(200).send(`Activated. Now login`);

    } catch (error) {
        res.status(500).send(`Internal server error: ${error}`);
    }
}

//Signin
export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        //Email present or not
        if (email !== '') {
            //user exists or not
            const existingUser = await Users.findOne({ userId: email });
            if (existingUser) {
                //if exists validate password
                const isValideUser = await bcrypt.compare(password, existingUser.hashedPassword);
                if (isValideUser) {
                    //if true login -> using jwt 
                    const token = jwt.sign({ _id: existingUser._id }, process.env.SECRET_KEY);
                    return res.status(201).send({ message: `User signed-in successful`, "accessToken": token });
                }
                //else false error
                return res.status(400).send({ message: `Invalid credentials.` })
            }
            return res.status(404).send({ message: `user doesn't exist.  SignUp now` })
        }
        return res.status(400).send({ message: `Enter the required details` })
    } catch (error) {
        res.status(500).send({ message: `Internal server error: ${error}` });
    }
}

//Signout
export const signout = async (req, res) => {
    try {
        res.status(200).send({ message: `signed-out successfully` });
    } catch (error) {
        res.status(500).send(`Internal server error: ${error}`);
    }
}

//ForgotPassword
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        //Requesting email
        if (!email) {
            return res.status(400).send({ message: `Email is mandatory` });
        }

        const user = await Users.findOne({ userId: email });
        //Checking email present or not
        if (!user) {
            return res.status(400).send({ message: `user doesn't exist. You can register` });
        }

        //If token already exists delete it
        const token = await Tokens.findOne({ userId: user._id });
        if (token) {
            await Tokens.deleteOne();
        }

        //Generating token
        const newToken = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
        //Hashing the token
        const hashedToken = await bcrypt.hash(newToken, 10);

        //storing token to DB
        const tokenPayload = new Tokens({ userId: user._id, token: hashedToken, createdAt: Date.now() });
        await tokenPayload.save();

        //Creating link
        const link = `https://urlshortener-frontapp.netlify.app/resetPassword?token=${newToken}&id=${user._id}`;

        //Sending link to the Email
        await sendMail(user.userId, "Reset password link", { name: user.firstName, link: link });
        return res.status(200).send({ message: `Email sent successfully . Link: ${link}` });

    } catch (error) {
        res.status(500).send(`Internal server error: ${error}`);
    }
}
//Reseting Password
export const resetPassword = async (req, res) => {
    try {
        const { userId, token, newPassword } = req.body;

        //Checking userId present in Token data
        const resetToken = await Tokens.findOne({ userId });
        if (!resetToken) {
            return res.status(400).send({ message: "Invalid or expired token." });
        }
        //Validating Token
        const isValid = bcrypt.compare(token, resetToken.token);

        if (!isValid) {
            return res.status(400).send({ message: 'Invalid token.' });
        }
        //Hashing new Password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        //Upadating new password
        Users.findByIdAndUpdate({ _id: userId }, { $set: { hashedPassword } }).catch(error => {
            res.status(400).send({ message: 'Error while updating user password.', Error: error });
        })
        //Deleting TOKEN data after reset
        await resetToken.deleteOne();
        return res.status(200).send({ message: 'Reset Password is successful.' });

    } catch (error) {
        res.status(500).send(`Internal server error: ${error}`);
    }
}