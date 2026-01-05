import FeatureModel from "../models/FeaturesModel.js";

export async function FeaturesListService() {
    try {
        let data = await FeatureModel.find()
        return {status: "success", data: data}
    }
    catch (error) {
        return {status: "error", data: error.message}
    }
}