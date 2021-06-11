import LaptopModel from '../../../03-back-end/src/components/laptop/model';
import api from '../api/api';
import EventRegister from '../api/EventRegister';


export default class LaptopService {
    public static getLaptopById(laptopId: number): Promise<LaptopModel|null> {
        return new Promise<LaptopModel|null>(resolve => {
            api("get", "/laptop/" + laptopId)
            .then(res => {
                if (res?.status !== "ok") {
                    if (res.status === "login") {
                        EventRegister.emit("AUTH_EVENT", "force_login");
                    }
                    return resolve(null);
                }
                resolve(res.data as LaptopModel);
            });
        });
    }

    public static getLaptopsByFeatureId(featureId: number): Promise<LaptopModel[]> {
        return new Promise<LaptopModel[]>(resolve => {
            api("get", "/feature/" + featureId + "/laptop")
            .then(res => {
                if (res?.status !== "ok") {
                    if (res.status === "login") {
                        EventRegister.emit("AUTH_EVENT", "force_login");
                    }
                    return resolve([]);
                }
                resolve(res.data as LaptopModel[]);
            });
        });
    }
}