import Users from "../models/user.model.js";

export const isAdmin = async (req, res, next) => {
    const { id } = req;

    //finding the user of the id
    const user = await Users.findOne({ _id: id });

    if (user.role === 1) {
        next();
    }
    return res.status(401).send(`Admin resource. Access denied`);

}

export const isUser = async (req, res, next) => {
    const { id } = req;

    //finding the user of the id
    const user = await Users.findOne({ _id: id });

    if (!user) {
        return res.status(401).send(`Access denied`);
    }

    next();
}