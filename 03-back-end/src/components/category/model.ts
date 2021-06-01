import IModel from '../../common/IModel.interface';
import FeatureModel from '../feature/model';
import IErrorResponse from '../../common/IErrorResponse.interface';
class CategoryModel implements IModel {
    categoryId: number;
    name: string;
    features: FeatureModel[]|IErrorResponse = [];
}

export default CategoryModel;