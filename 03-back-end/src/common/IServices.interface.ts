import CategoryService from '../components/category/service';
import FeatureService from '../components/feature/service';
import LaptopService from '../components/laptop/service';
export default interface IServices {
    categoryService: CategoryService;
    featureService: FeatureService;
    laptopService: LaptopService;

}