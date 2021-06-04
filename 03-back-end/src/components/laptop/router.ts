import IRouter from '../../common/IRouter.interface';
import IApplicationResources from '../../common/IApplicationResources.interface';
import { Application } from 'express';
import LaptopController from './controller';

export default class LaptopRouter implements IRouter {
    public setupRoutes(application: Application, resources: IApplicationResources) {

        const laptopController = new LaptopController(resources);

        application.get('/laptop/:id', laptopController.getById.bind(laptopController));
        application.post('/laptop', laptopController.add.bind(laptopController));
        application.put('/laptop/:id', laptopController.edit.bind(laptopController));
        application.delete('/laptop/:id', laptopController.delete.bind(laptopController));
        application.delete('/laptop/:aid/photo/:pid', laptopController.deleteLaptopPhoto.bind(laptopController));
        application.post('/laptop/:id/photo', laptopController.addLaptopPhotos.bind(laptopController));
    }
}