import IModel from '../../common/IModel.interface';
import CategoryModel from '../category/model';

class Photo implements IModel {
    photoId: number;
    imagePath: string;
}

class FeatureValue implements IModel {
    featureId: number;
    name?: string;
    value: string;
}

class LaptopModel implements IModel {
    laptopid: number;
    createdAt: Date;
    title: string;
    description: string;
    price: number;
    categories?: CategoryModel[] = [];
    photos: Photo[] = [];
    features: FeatureValue[] = [];
}

export default LaptopModel;
export { Photo as LaptopPhoto };
export { FeatureValue as LaptopFeatureValue };