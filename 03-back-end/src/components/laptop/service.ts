import BaseService from '../../common/BaseService';
import IModelAdapterOptionsInterface from '../../common/IModelAdapterOptions.interface';
import LaptopModel, { LaptopFeatureValue, LaptopPhoto } from './model';
import CategoryModel from '../category/model';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { IAddLaptop, IUploadedPhoto } from './dto/IAddLaptop';
import { IEditLaptop } from './dto/IEditLaptop';

export class LaptopModelAdapterOptions implements IModelAdapterOptionsInterface {
    loadCategories: boolean = false;
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

            if (options.loadCategories) {
                item.categories = await this.getAllCategoriesByLaptopId(item.laptopid);
            }

            if (options.loadFeatures) {
                item.features = await this.getAllFeatureValuesByLaptopId(item.laptopid);
            }

            if (options.loadPhotos) {
                item.photos = await this.getAllPhotosByLaptopId(item.laptopid);
            }

            return item;
    }

    private async getAllCategoriesByLaptopId(laptopId: number): Promise<CategoryModel[]> {
        const sql = `
            SELECT
                laptop_category.category_id,
                category.name
            FROM
                laptop_category
            INNER JOIN category ON category.category_id = laptop_category.category_id
            WHERE
                laptop_category.laptop_id = ?;`;

        const [ rows ] = await this.db.execute(sql, [ laptopId ]);

        if (!Array.isArray(rows) || rows.length === 0) {
            return [];
        }

        const items: CategoryModel[] = [];


        for (const row of rows as any) {
            items.push({
                categoryId: +(row?.category_id),
                name: row?.name,
            });
        }

        return items;
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
            console.log(data);
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
                                loadCategories: true,
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

    private editLaptop(laptopId: number, data: IEditLaptop) {
        return this.db.execute(
            `UPDATE
                laptop
            SET
                title = ?,
                description = ?,
                price = ?
            WHERE
                laptop_id = ?;`,
                [
                    data.title,
                    data.description,
                    data.price,
                    laptopId,
                ]
        )
    }

    private deleteLaptopFeature(laptopId: number, featureId: number) {
        return this.db.execute(
            `DELETE FROM 
                    laptop_feature 
            WHERE 
                    laptop_id = ? AND
                    feature_id = ?;`,
            [
                    laptopId,
                    featureId,
            ]
        )
    }
    private insertOrUpdateFeatureValue(laptopId: number, fv: LaptopFeatureValue) {
        return this.db.execute(
            `INSERT
                laptop_feature
            SET
                laptop_id = ?,
                feature_id = ?,
                value = ?
            ON DUPLICATE KEY
            UPDATE
                value = ?;`,
            [
                laptopId,
                fv.featureId,
                fv.value,
                fv.value,
            ],
        );
    }

    public async edit(laptopId: number, data: IEditLaptop): Promise<LaptopModel|null|IErrorResponse> {
        return new Promise<LaptopModel|null|IErrorResponse>(async resolve => {
            const currentLaptop = await this.getById(laptopId, {
                loadFeatures: true,
            });

            if (currentLaptop === null) {
                return resolve(null);
            }

            const rollbackAndResolve = async (error) => {
                await this.db.rollback();
                resolve(error);
            }

            this.db.beginTransaction()
            .then(() => {
                 this.editLaptop(laptopId, data)
                .catch((error) => {
                    rollbackAndResolve( {
                        errno: error?.errno,
                        sqlMessage: "Part laptop: " + error?.sqlMessage,
                    });
                });                
                })
                .then(async () => {
                    const willhaveFeatures = data.features.map(fv => fv.featureId);
                    const currentFeatures = (currentLaptop as LaptopModel).features.map(f => f.featureId);

                    for (const currentFeature of currentFeatures) {
                        if (!willhaveFeatures.includes(currentFeature)) {
                            this.deleteLaptopFeature(laptopId, currentFeature)
                            .catch((error) => {
                                rollbackAndResolve( {
                                    errno: error?.errno,
                                    sqlMessage: `Part delete feature ID(${currentFeature}): ${error?.sqlMessage}`,
                                });
                            });
                        }
                    }
                })
                .then(async () => {
                    for (const fv of data.features) {
                        this.insertOrUpdateFeatureValue(laptopId, fv)
                        .catch((error) => {
                            rollbackAndResolve( {
                                errno: error?.errno,
                                sqlMessage: `Part add/edit feature ID(${fv.featureId}): ${error?.sqlMessage}`,
                            });
                        });
                    }   
                })
                .then(async () => {
                    this.db.commit()
                    .catch((error) => {
                        rollbackAndResolve( {
                            errno: error?.errno,
                            sqlMessage: `Part save changes: ${error?.sqlMessage}`,
                        });
                    });
                })
                .then(async () => {
                    resolve(await this.getById(laptopId, {
                        loadCategories: true,
                        loadFeatures: true,
                        loadPhotos: true,
                    }));
                })                
            .catch(async error => {
                await this.db.rollback();

                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                });

            });
        });
    }

}


export default LaptopService;
