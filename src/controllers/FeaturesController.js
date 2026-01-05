import {FeaturesListService} from "../services/FeaturesServices.js"

export async function FeaturesList(req, res) {
    let result = await FeaturesListService()
    return res.status(200).json(result)
}