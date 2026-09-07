import {DecodeToken} from "../utility/TokenHelper.js";
export default function (req, res, next){
    try {
        let token = req.headers.token;
        if(!token && req.cookies){
            token = req.cookies.token;
        }
        if(!token){
            return res.status(401).json({
                validation: false,
                status: "fail",
                message:"Unauthorized"
            })
        }
        let decoded = DecodeToken(token);
        if(decoded === null){
            return res.status(401).json({
                validation: false,
                status: "fail",
                message:"Unauthorized"
            })
        }
        else{
            req.headers.email = decoded.email;
            req.headers.user_id = decoded.user_id;
            next()
        }
    }
    catch (e) {
        return (
            res.status(401).json({
            validation: false,
            status: "fail",
            message:e.message
        })
        )
    }
}
