import FeatureModel from '../../../03-back-end/src/components/feature/model';
import api from '../api/api';

export default class FeatureService {
    public static getFeatureById(featureId: number): Promise<FeatureModel|null> {
        return new Promise<FeatureModel|null>(resolve => {
            api("get", "/feature/" + featureId)
            .then(res => {
                if (res?.status !== "ok") {
                    return resolve(null);
                }

                resolve(res.data as FeatureModel);
            })
        })
    }
}