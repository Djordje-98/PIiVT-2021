import BasePage from '../../../BasePage/BasePage';
import { Redirect } from 'react-router-dom';
import CategoryService from '../../../../services/CategoryService';
import { isRoleLoggedIn } from '../../../../api/api';
import EventRegister from '../../../../api/EventRegister';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Fragment } from 'react';
import PhoneService, { IAddLaptop } from '../../../../services/LaptopService';
import CategoryModel from '../../../../../../03-back-end/src/components/category/model';
import FeatureModel from '../../../../../../03-back-end/src/components/feature/model';

interface LaptopDashboardAddState {
    categories: CategoryModel[];

    title: string;
    description: string;
    price: string;
    selectedParent: string;

    uploadFile: FileList | null;

    featureValues: Map<number, string>;

    message: string;

    redirectBackToPhones: boolean;
}

export default class LaptopDashboardAdd extends BasePage<{}> {
    state: LaptopDashboardAddState;

    constructor(props: any) {
        super(props);

        this.state = {
            categories: [],

            title: "",
            description: "",
            price: "1",
            selectedParent: "1",

            uploadFile: null,

            featureValues: new Map(),

            message: "",

            redirectBackToPhones: false,
        }
    }

    componentDidMount() {
        isRoleLoggedIn("administrator")
        .then(loggedIn => {
            if (!loggedIn) return EventRegister.emit("AUTH_EVENT", "force_login");
            this.loadCategories();
        });
    }

    loadCategories() {
        CategoryService.getTopLevelCategories()
        .then(categories => {
            this.setState({
                categories: categories,
            });
        });
    }

    private getSelectedCategory(): CategoryModel|null {
        const selectedCategoryId = Number(this.state.selectedParent);
        return this.findCategoryInCategories(this.state.categories, selectedCategoryId);
    }

    private findCategoryInCategories(categories: CategoryModel[], categoryId: number): CategoryModel|null {
        for (let category of categories) {
            if (category.categoryId === categoryId) {
                return category;
            }
        }

        return null;
    }

    renderMain(): JSX.Element {
        if (this.state.redirectBackToPhones) {
            return ( <Redirect to="/dashboard/laptop" /> );
        }

        const selectedCategory = this.getSelectedCategory();

        if (selectedCategory?.features === undefined) {
            return <><p>fail</p></>;
        }

        return (
            <Row>
                <Col sm={12}>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <b>Add new laptop</b>
                            </Card.Title>
                            <Card.Text as="div">
                                <Row>
                                    <Col xs={12} md={6}>
                                        <p className="mt-3 h4">Laptop information:</p>

                                        <Form.Group>
                                            <Form.Label>Title:</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter the title of the new laptop"
                                                value={ this.state.title }
                                                onChange={ this.onChangeInput("title") }
                                            />
                                        </Form.Group>

                                        <Form.Group>
                                            <Form.Label>Description:</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                type="text"
                                                placeholder="Enter the description of the new laptop"
                                                value={ this.state.description }
                                                onChange={ this.onChangeInput("description") }
                                            />
                                        </Form.Group>

                                        <Form.Group>
                                            <Form.Label>Price:</Form.Label>
                                            <Form.Control
                                                type="number"
                                                min={1} step={1} max={1000000}
                                                placeholder="Enter the price of the new laptop"
                                                value={ this.state.price }
                                                onChange={ this.onChangeInput("price") }
                                            />
                                        </Form.Group>

                                        <p className="mt-3 h4">Multimedia:</p>

                                        <Form.Group>
                                            <Form.Label>Phone image:</Form.Label>
                                            <Form.File
                                                custom
                                                data-browse="Select file"
                                                accept=".png,.jpeg"
                                                onChange={ this.onChangeFile("uploadFile") }/>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <p className="mt-3 h4">Laptop information:</p>

                                        <Form.Group>
                                            <Form.Label>Category:</Form.Label>
                                            <Form.Control as="select"
                                                value={ this.state.selectedParent }
                                                onChange={ this.onChangeSelect("selectedParent") }>
                                                { this.state.categories.map(category => this.createSelectOptionGroup(category)) }
                                            </Form.Control>
                                        </Form.Group>

                                        <p className="mt-3 h4">Features:</p>
                                        { selectedCategory.features.map(f => this.renderFeatureInput(f)) }

                                        <Form.Group>
                                            <Button variant="primary" className="mt-3"
                                                onClick= { () => this.handleAddButtonClick() } >
                                                Add new laptop
                                            </Button>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {
                                    this.state.message
                                    ? (<p className="mt-3 alert alert-danger">{ this.state.message }</p>)
                                    : ""
                                }
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    }

    private renderFeatureInput(feature: FeatureModel): JSX.Element {
        return (
            <Form.Group key={ "feature-value-input-" + feature.featureId }>
                <Form.Label>{ feature.name }:</Form.Label>
                <Form.Control
                    value={ this.state.featureValues.get(feature.featureId) ?? "" }
                    onChange={ this.onChangeFeatureValue(feature.featureId) }/>
            </Form.Group>
        );
    }

    private createSelectOptionGroup(category: CategoryModel, level: number = 0): JSX.Element {
        const levelPrefix = "» ".repeat(level);
        return (
            <Fragment key={ "category-and-subcategory-fragment-" + category.categoryId }>
                <option key={ "parent-category-option-" + category.categoryId } value={ category.categoryId }>
                    { levelPrefix }{ category.name }
                </option>
                {/* { category.subcategories.map(subcategory => this.createSelectOptionGroup(subcategory, level + 1)) } */}
            </Fragment>
        );
    }

    private handleAddButtonClick() {
        if (this.state.uploadFile === null) {
            return this.setState({
                message: "There is no file selected for upload.",
            });
        }

        const selectedCategory = this.getSelectedCategory();

        if (!selectedCategory) {
            return this.setState({
                message: "You must select a category.",
            });
        }

        const featureValues: Map<number, string> = new Map();

        if (selectedCategory.features === undefined) {
            return;
        }

        // For students:
        // We map only the required ones, in case that the selected category was changed,
        // and its featre values remained in state
        for (let feature of selectedCategory.features) {
            const value = this.state.featureValues.get(feature.featureId);

            if (!value) {
                continue;
            }

            featureValues.set(feature.featureId, value);
        }

        const data: IAddLaptop = {
            title: this.state.title,
            description: this.state.description,
            categoryId: Number(this.state.selectedParent),
            price: Number(this.state.price),
            images: [
                this.state.uploadFile.item(0) as File
            ],
            features: featureValues,
        };

        PhoneService.addPhone(data)
        .then(res => {
            if (res) return this.setState({ redirectBackToPhones: true });
            else return this.setState({
                message: "Could not save this phone, due to an error.",
            });
        });
    }

    private onChangeInput(field: "title" | "description" | "price"): (event: React.ChangeEvent<HTMLInputElement>) => void {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({
                [field]: event.target.value,
            });
        }
    }

    private onChangeFeatureValue(featureId: number): (event: React.ChangeEvent<HTMLInputElement>) => void {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            this.setState((state: LaptopDashboardAddState) => {
                state.featureValues.set(featureId, event.target.value + "");
                return state;
            });
        }
    }

    private onChangeSelect(field: "selectedParent"): (event: React.ChangeEvent<HTMLSelectElement>) => void {
        return (event: React.ChangeEvent<HTMLSelectElement>) => {
            this.setState({
                [field]: event.target?.value + "",
            });
        }
    }

    private onChangeFile(field: "uploadFile"): (event: React.ChangeEvent<HTMLInputElement>) => void {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({
                [field]: event.target.files
            });
        }
    }
}