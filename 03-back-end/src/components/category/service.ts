import CategoryModel from "./model";
import * as mysql2 from 'mysql2/promise';

class CategoryService {
    private db: mysql2.Connection;

    constructor(db: mysql2.Connection){
        this.db = db;
    }

    protected async adaptModel(row: any): Promise<CategoryModel> {
        const item: CategoryModel = new CategoryModel();

        item.categoryId = +(row?.category_id);
        item.name = row?.name;
        item.imagePath = row?.image_path;
        item.parentCategoryId = row?.parent__category_id;

        if (item.parentCategoryId !== null) {
            item.parentCategory = await this.getById(item.parentCategoryId);
        }

        item.subcategories = [];

        return item;
    }

    public async getAll(): Promise<CategoryModel[]> {
        const lista: CategoryModel[] = [];

        const sql: string = "SELECT * FROM category;";
        const [ rows, columns ] = await this.db.execute(sql);

        if (Array.isArray(rows)) {
            for (const row of rows) {
                
            }
        }

        return lista;

    }

    public async getById(categoryId: number): Promise<CategoryModel|null>{
        if (categoryId === 1 || categoryId === 2){
            if (categoryId === 1) {
                return {
                    categoryId: 1,
                    name: "Category A",
                    imagePath: "static/categories/1.png",
                    parentCategoryId: null,
                    parentCategory: null,
                    subcategories: [],
                };
            }
            if (categoryId === 2){
                return{
                    categoryId: 2,
                    name: "Category B",
                    imagePath: "static/categories/2.png",
                    parentCategoryId: null,
                    parentCategory: null,
                    subcategories: [],
                };
            }
        } else {
            return null;
        }
    }
}

export default CategoryService;