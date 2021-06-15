import BasePage from '../../../BasePage/BasePage';
import { Redirect } from 'react-router-dom';
import CategoryService from '../../../../services/CategoryService';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import CategoryModel from '../../../../../../03-back-end/src/components/category/model';
import { isRoleLoggedIn } from '../../../../api/api';
import EventRegister from '../../../../api/EventRegister';

interface CategoryDashboardAddState {
    categories: CategoryModel[];

    name: string;
    selectedParent: string;

    message: string;

    redirectBackToCategories: boolean;
}

export default class CategoryDashboardAdd extends BasePage<{}> {
    state: CategoryDashboardAddState;

    constructor(props: any) {
        super(props);

        this.state = {
            categories: [],
            name: "",
            selectedParent: "",
            message: "",
            redirectBackToCategories: false,
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

    renderMain(): JSX.Element {
        if (this.state.redirectBackToCategories) {
            return (
                <Redirect to="/dashboard/category" />
            );
        }

        return (
            <Row>
                <Col sm={12} md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <b>Add new category</b>
                            </Card.Title>
                            <Card.Text as="div">
                                <Form>
                                    <Form.Group>
                                        <Form.Label>Name:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter the name of the new cateogry"
                                            value={ this.state.name }
                                            onChange={ this.onChangeInput("name") }
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Button variant="primary" className="mt-3"
                                            onClick= { () => this.handleAddButtonClick() } >
                                            Add new category
                                        </Button>
                                    </Form.Group>

                                    {
                                        this.state.message
                                        ? (<p className="mt-3">{ this.state.message }</p>)
                                        : ""
                                    }
                                </Form>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    }

    private handleAddButtonClick() {
        CategoryService.addNewCategory({name: this.state.name})
        .then(res => {
            if (res.success === false) {
                return this.setState({
                    message: res.message,
                });
            }
        
            this.setState({
                redirectBackToCategories: true,
            });
        });
    }

    private onChangeInput(field: "name"): (event: React.ChangeEvent<HTMLInputElement>) => void {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({
                [field]: event.target.value,
            });
        }
    }
}