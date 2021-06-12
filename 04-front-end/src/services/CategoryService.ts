import CategoryModel from '../../../03-back-end/src/components/category/model';
import api, { ApiRole } from '../api/api';


export default class CategoryService {
    public static getTopLevelCategories(role: ApiRole = "administrator"): Promise<CategoryModel[]> {
        return new Promise<CategoryModel[]>(resolve => {
            api(
                "get",
                "/category",
                role
            )
            .then(res => {
                if (res?.status !== "ok") {
                    return resolve([]);
                }
                resolve(res.data as CategoryModel[]);
            });
            
        });
    }

    public static getCategoryById(categoryId: number, role: ApiRole = "administrator"): Promise<CategoryModel|null> {
        return new Promise<CategoryModel|null>(resolve => {
            api(
                "get",
                "/category/" + categoryId,
                role,
            )
            .then(res => {
                if (res?.status !== "ok") {
                    return resolve(null);
                }
                resolve(res.data as CategoryModel);
            });
            
        });
    }
}