import IModel from '../../common/IModel.interface';
export default class Administrtormodel implements IModel {
    administratorId: number;
    username: string;
    passwordHash: string;
    isActive: boolean;

}