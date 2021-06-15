import LaptopModel from '../../../03-back-end/src/components/laptop/model';
import api, { apiAsForm } from '../api/api';
import EventRegister from '../api/EventRegister';


export interface IAddLaptop {
    title: string;
    description: string;
    categoryId: number;
    price: number;

    features: Map<number, string>;

    images: File[];
}

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

    public static getLaptops(): Promise<LaptopModel[]> {
        return new Promise<LaptopModel[]>(resolve => {
            api("get", "/laptop")
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

    public static addLaptop(data: IAddLaptop): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            const features: {
                featureId: number;
                value: string;
            }[] = [];

            data.features.forEach((value, key) => {
                features.push({
                    featureId: key,
                    value: value,
                });
            });

            const formData = new FormData();
            formData.append("data", JSON.stringify({
                title: data.title,
                description: data.description,
                price: data.price,
                categoryId: data.categoryId,
                features: features,
            }));

            for (let image of data.images) {
                formData.append("image", image);
            }

            apiAsForm("post", "/laptop", "administrator", formData)
            .then(res => {
                if (res?.status !== "ok") {
                    if (res.status === "login") EventRegister.emit("AUTH_EVENT", "force_login");

                    return resolve(false);
                }

                resolve(true);
            });
        });
    }

}