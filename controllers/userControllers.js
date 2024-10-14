import Urls from "../models/urls.model.js";
import generateShortId from "../utils/generateShortId.js";

//Generate short url

//ShortCode generator function
const generateShortCode = async (urls) => {
    let isExists, shortCode;
    do {
        isExists = false;
        shortCode = generateShortId();

        //To get unique shortCode - check for code already exists
        isExists = await urls.findOne({ shortUrl: shortCode });
    } while (isExists);
    return shortCode;
}

export const generate = async (req, res) => {
    try {
        const { longUrl } = req.body;

        //Existing long url then return
        const urlexists = await Urls.findOne({ longUrl });
        if (urlexists) {
            return res.status(208).send(`URL already present ${urlexists.longUrl}`);
        }
        //generating url code
        else {
            const shortCode = await generateShortCode(Urls);
            let newData = { longUrl, shortUrl: shortCode };
            await Urls.create(newData);
            return res.status(201).send(`Short url created: ${shortCode}`);
        }
    } catch (error) {
        res.status(500).send(`Internal Server Error: ${error} `);
    }
}

//Getting short Urls
export const shorturls = async (req, res) => {
    try {
        const data = await Urls.find({});
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send(`Internal Server Error: `, error);
    }
}

//Redirect short Url
export const redirectUrl = async (req, res) => {
    try {
        const { shorturl } = req.params;
        const data = await Urls.findOne({ shortUrl: shorturl });
        //Add clicked
        data.clicked += 1;
        data.save();
        if (data) {
            if (/https:/.test(data.longUrl)) {
                res.redirect(data.longUrl);
            }
            else res.redirect(`https://${data.longUrl}`);
        }
    } catch (error) {
        res.status(500).send(`Internal Server Error: `, error);
    }

}

//DASHBOARD
export const dashboard = async (req, res) => {
    //Todays details
    const today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    let date = today.getDate();
    try {
        //From last month created
        let monthlyData = await Urls.find({
            createdAt: { $gte: new Date(new Date().getMonth()) }
        })
        //Today created
        let todayData = await Urls.find({
            createdAt: { $gte: new Date(year, month, date) }
        })

        const data = { todayCount: todayData.length, monthlyCount: monthlyData.length };

        return res.status(200).send(data);
    } catch (error) {
        res.status(500).send(`Internal Server Error: ${error}`);
    }
}
