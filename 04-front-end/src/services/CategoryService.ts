import CategoryModel from '../../../03-back-end/src/components/category/model';
import api from '../api/api';

interface IAddCategory {
    name: string;
}

interface IEditCategory {
    name: string;
}

interface IResult {
    success: boolean;
    message?: string;
}

export default class CategoryService {
    public static getTopLevelCategories(): Promise<CategoryModel[]> {
        return new Promise<CategoryModel[]>(resolve => {
            api("get", "/category")
            .then(res => {
                if (res?.status !== "ok") {
                    return resolve([]);
                }
                resolve(res.data as CategoryModel[]);
            });
            
        });
    }

    public static getCategoryById(categoryId: number): Promise<CategoryModel|null> {
        return new Promise<CategoryModel|null>(resolve => {
            api("get", "/category/" + categoryId)
            .then(res => {
                if (res?.status !== "ok") {
                    return resolve(null);
                }
                resolve(res.data as CategoryModel);
            });
            
        });
    }

    public static addNewCategory(data: IAddCategory): Promise<IResult> {
        return new Promise<IResult>(resolve => {
            api("post", "/category", "administrator", data)
            .then(res => {
                if (res?.status === "error") {
                    if (Array.isArray(res?.data?.data)) {
                        const field = res?.data?.data[0]?.instancePath.replace('/', '');
                        const msg   = res?.data?.data[0]?.message;
                        const error = field + " " + msg;
                        return resolve({
                            success: false,
                            message: error,
                        });
                    }
                }
                
                
            })
        });
    }

    public static editCategory(categoryId: number, data: IEditCategory): Promise<IResult> {
        return new Promise<IResult>(resolve => {
            api("put", "/category/" + categoryId, "administrator", data)
            .then(res => {
                if (res?.status === "error") {
                    if (Array.isArray(res?.data?.data)) {
                        const field = res?.data?.data[0]?.instancePath.replace('/', '');
                        const msg   = res?.data?.data[0]?.message;
                        const error = field + " " + msg;
                        return resolve({
                            success: false,
                            message: error,
                        });
                    }
                }

                if (res?.data?.errorCode === 1062) {
                    return resolve({
                        success: false,
                        message: "A category with this name already exists.",
                    });
                }

                return resolve({
                    success: true,
                });
            })
        });
    }
}