import BaseService from '../../common/BaseService';
import IModelAdapterOptionsInterface from '../../common/IModelAdapterOptions.interface';
import LaptopModel, { LaptopFeatureValue, LaptopPhoto } from './model';
import CategoryModel from '../category/model';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { IAddLaptop, IUploadedPhoto } from './dto/IAddLaptop';

export class LaptopModelAdapterOptions implements IModelAdapterOptionsInterface {
    loadCategory: boolean = false;
    loadFeatures: boolean = false;
    loadPhotos: boolean = false;
}

class LaptopService extends BaseService<LaptopModel> {
    protected async adaptModel(
        data: any, 
        options: Partial<LaptopModelAdapterOptions>
        ): Promise<LaptopModel> {
            const item: LaptopModel = new LaptopModel();

            item.laptopid = +(data?.laptop_id);
            item.title = data?.title;
            item.description = data?.description;
            item.createdAt = new Date(data?.created_at);
            item.price = +(data?.price);
            item.categoryId = +(data?.category_id);

            if (options.loadCategory) {
                item.category = await this.services.categoryService.getById(item.categoryId) as CategoryModel;
            }

            if (options.loadFeatures) {
                item.features = await this.getAllFeatureValuesByLaptopId(item.laptopid);
            }

            if (options.loadPhotos) {
                item.photos = await this.getAllPhotosByLaptopId(item.laptopid);
            }

            return item;
    }

    private async getAllFeatureValuesByLaptopId(laptopId: number): Promise<LaptopFeatureValue[]> {
        const sql = `
        SELECT 
            laptop_feature.feature_id, 
            laptop_feature.value,
            feature.name 
        FROM 
            laptop_feature 
            INNER JOIN feature ON feature.feature_id = laptop_feature.feature_id
        WHERE 
            laptop_feature.laptop_id =  ?;`;
        const [ rows ] = await this.db.execute(sql, [ laptopId ]);

        if (!Array.isArray(rows) || rows.length === 0) {
            return [];
        }

        const items: LaptopFeatureValue[] = [];

        for (const row of rows as any) {
            items.push({
                featureId: +(row?.feature_id),
                name: row?.name,
                value: row?.value,
            });
        }

           return items;     
    }

    private async getAllPhotosByLaptopId(laptopId: number): Promise<LaptopPhoto[]> {
        const sql = `SELECT photo_id, image_path FROM photo WHERE laptop_id =  ?;`;
        const [ rows ] = await this.db.execute(sql, [ laptopId ]);

        if (!Array.isArray(rows) || rows.length === 0) {
            return [];
        }

        return rows.map(row => {
            return {
                photoId: +(row?.photo_id),
                imagePath: row?.image_path,
            }
        });

    }

    public async getById(
        laptopId: number,
        options: Partial<LaptopModelAdapterOptions> = {},
    ): Promise<LaptopModel|IErrorResponse|null> {
        return this.getByIdFromTable(
            "laptop",
            laptopId,
            options,
        );
    }

    public async add(
        data: IAddLaptop,
        uploadedPhotos: IUploadedPhoto[],
    ): Promise<LaptopModel|IErrorResponse> {
        return new Promise<LaptopModel|IErrorResponse>(resolve => {
            this.db.beginTransaction()
            .then(() => {
                this.db.execute(
                    `INSERT laptop
                    SET
                        title = ?,
                        description = ?,
                        price = ?;
                        `
                ,
                [
                  data.title,
                  data.description,
                  data.price,
                ]
                ).then(async (res: any) => {
                    const newLaptopId: number = +(res[0]?.insertId);

                    const promises = [];

                    for ( const featureValue of data.features) {
                        promises.push(this.db.execute(
                            `INSERT laptop_feature SET laptop_id = ?, feature_id = ?, value = ?;`,
                            [ newLaptopId, featureValue.featureId, featureValue.value ]
                        ),
                        );
                    }

                    for (const uploadedPhoto of uploadedPhotos) {
                        promises.push(
                            this.db.execute(
                                `INSERT photo SET laptop_id = ?, image_path = ?;`,
                                [ newLaptopId, uploadedPhoto.imagePath, ]
                            ),
                        );
                    }

                    Promise.all(promises)
                    .then(async () => {
                        await this.db.commit();

                        resolve(await this.services.laptopService.getById(
                            newLaptopId,
                            {
                                loadCategory: true,
                                loadFeatures: true,
                                loadPhotos: true,
                            }
                        ));
                    })
                    .catch(async error => {
                        await this.db.rollback();
    
                        resolve({
                            errorCode: error?.errno,
                            errorMessage: error?.sqlMessage
                        });
                    });
                })
                .catch(async error => {
                    await this.db.rollback();

                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });

                })
            });
        });
    }

}


export default LaptopService;
