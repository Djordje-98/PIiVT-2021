import BaseController from '../../common/BaseController';
import { Request, Response } from 'express';
import { IAddLaptop, IAddLaptopValidator, IUploadedPhoto } from './dto/IAddLaptop';
import Config from '../../config/dev';
import { v4 } from "uuid";
import { UploadedFile } from 'express-fileupload';
import sizeOf from "image-size";
import * as path from "path";
import * as sharp from "sharp";

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
                loadCategories: true,
                loadFeatures: true,
                loadPhotos: true,

            }
            );
         //   console.log(item);
        if (item === null) {
            res.sendStatus(404);
            return;
        }

        res.send(item);
    }


    private isPhotoValid(file: UploadedFile): { isOk: boolean; message?: string } {
        try {

        const size = sizeOf(file.tempFilePath);

        const limits = Config.fileUpload.photos.limits;

        if (size.width < limits.minWidth) {
            return {
                isOk: false,
                message: `The image must have a width of at least ${limits.minWidth}px.`,              
            }
        }
        if (size.height < limits.minHeight) {
            return {
                isOk: false,
                message: `The image must have a height of at least ${limits.minHeight}px.`,               
            }
        }
        if (size.width > limits.maxWidth) {
            return {
                isOk: false,
                message: `The image must have a width of at least ${limits.maxWidth}px.`,               
            }
        }
        if (size.height > limits.maxHeight) {
            return {
                isOk: false,
                message: `The image must have a height of at least ${limits.maxHeight}px.`,               
            }
        }

        return {
            isOk: true,
        };
    } catch (e) {
        return {
            isOk: false,
            message: 'Bad file format.',
        };
    }
}

    private async resizeUploadedPhoto(imagePath: string) {

        const pathParts = path.parse(imagePath);
        
        const directory = pathParts.dir;
        const filename = pathParts.name;
        const extension = pathParts.ext;

        for ( const resizeSpecification of Config.fileUpload.photos.resizes) {
            const resizedImagePath = directory + "/" + 
                                     filename + 
                                     resizeSpecification.sufix + 
                                     extension;

            await sharp(imagePath)
                .resize({
                    width: resizeSpecification.width,
                    height: resizeSpecification.height,
                    fit: resizeSpecification.fit,
                    background: { r: 255, g: 255, b: 255, alpha: 1.0, },
                    withoutEnlargement: true,
                })
                .toFile(resizedImagePath);

        }
    }

    private async uploadFiles(req: Request, res: Response): Promise<IUploadedPhoto[]> {
        if (!req.files || Object.keys(req.files).length === 0) {
            res.status(400).send("You must upload al least one and a maximum of " + Config.fileUpload.maxFiles + "photos.");
            return [];
        }

        const fileKeys: string[] = Object.keys(req.files);

        const uploadedPhotos: IUploadedPhoto[] = [];

        for (const fileKey of fileKeys) {
            const file = req.files[fileKey] as any;

            const result = this.isPhotoValid(file);
            
            if (result.isOk === false) {
                res.status(400).send(`Error with image ${fileKey}: "${result.message}".`);
                return [];
            }

            const randomString = v4();
            const originalName = file?.name;
            const now = new Date();

            const imagePath = Config.fileUpload.uploadDestinationDirectory + 
                              (Config.fileUpload.uploadDestinationDirectory.endsWith("/") ? "" : "/") +
                              now.getFullYear() + "/" + 
                              ((now.getMonth() + 1) + "").padStart(2, "0") + "/" +
                              randomString + "-" + originalName;

            await file.mv(imagePath);
            await this.resizeUploadedPhoto(imagePath);

            uploadedPhotos.push({
                imagePath: imagePath,
            });
        
        }

        return uploadedPhotos;
    }

    public async add(req: Request, res: Response) {
        console.log(req);
        const uploadedPhotos = await this.uploadFiles(req, res);

        if (uploadedPhotos.length === 0) {
            return;
        }
       console.log(req.body?.data);
        try {
        const data = JSON.parse(req.body?.data);
        console.log(data);
        if (!IAddLaptopValidator(data)) {
            res.status(400).send(IAddLaptopValidator.errors);
            return;
        }
        
        const result = await this.services.laptopService.add(data as IAddLaptop, uploadedPhotos);
//console.log(result);
        res.send(result);
    } catch (e) {
        res.status(400).send(e?.message);
    }
    }
}

export default LaptopController;