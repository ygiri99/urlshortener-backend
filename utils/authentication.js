import jwt from "jsonwebtoken";

export const isAuth = async (req, res, next) => {

    const { authToken } = req.body;
    //Checking token for Authentication
    if (authToken) {
        let user = jwt.verify(authToken, process.env.SECRET_KEY);//Decryption token
        req.id = user._id;


        if (!req.id) {
            return res.status(401).send({ message: `Not Autherized` });
        }
        return next();
    }
    res.status(401).send({ message: `Not Autherized` });
}