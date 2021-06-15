import IRouter from '../../common/IRouter.interface';
import IApplicationResources from '../../common/IApplicationResources.interface';
import { Application } from 'express';
import LaptopController from './controller';
import AuthMiddleware from '../../middleware/auth.middleware';

export default class LaptopRouter implements IRouter {
    public setupRoutes(application: Application, resources: IApplicationResources) {

        const laptopController = new LaptopController(resources);

        application.get('/laptop/:id', laptopController.getById.bind(laptopController));

        application.post(
            '/laptop',
            AuthMiddleware.getVerifier("administrator"), 
            laptopController.add.bind(laptopController));

        application.put(
            '/laptop/:id',
            AuthMiddleware.getVerifier("administrator"), 
            laptopController.edit.bind(laptopController));

        application.delete(
            '/laptop/:id',
            AuthMiddleware.getVerifier("administrator"), 
            laptopController.delete.bind(laptopController));

        application.delete(
            '/laptop/:aid/photo/:pid',
            AuthMiddleware.getVerifier("administrator"), 
            laptopController.deleteLaptopPhoto.bind(laptopController));

        application.post(
            '/laptop/:id/photo',
            AuthMiddleware.getVerifier("administrator"), 
            laptopController.addLaptopPhotos.bind(laptopController));

        application.get("/feature/:id/laptop", laptopController.getAllByFeatureId.bind(laptopController));
        application.get("/laptop", laptopController.getAllLaptops.bind(laptopController));
    }
}