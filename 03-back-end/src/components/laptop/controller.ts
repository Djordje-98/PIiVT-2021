import BaseController from '../../common/BaseController';
import { Request, Response } from 'express';

class LaptopController extends BaseController {
    public async getById(req: Request, res: Response) {
        const id: number = +(req.params?.id);

        if (id <= 0) {
            res.sendStatus(400);
            return;
        }

        const item = await this.services.laptopService.getById(
            id,
            {
                loadCategory: true,
                loadFeatures: true,
                loadPhotos: true,

            }
            );

        if (item === null) {
            res.sendStatus(404);
            return;
        }

        res.send(item);
    }
}

export default LaptopController;