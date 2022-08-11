import axios from "axios";

class Plugins{
    static PAYSTACK_API = axios.create({
        baseURL: "https://api.paystack.co/",
        headers: {
            // TODO: UPDATE TO PRODUCTION KEY
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
        },
    });

    static SMS_API = axios.create({
        baseURL: `https://sms.api.sinch.com/xms/v1/${process.env.SINCH_SMS_SERVICE_PLAN_ID}`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.SINCH_SMS_API_TOKEN}`
        },
    });
}

export default Plugins;