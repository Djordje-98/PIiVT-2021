import BasePage, { BasePageProperties } from "../BasePage/BasePage";
import LaptopModel from '../../../../03-back-end/src/components/laptop/model';
import LaptopService from '../../services/LaptopService';
import { Link } from 'react-router-dom';
import { Card, Col, Row } from "react-bootstrap";
import * as path from 'path';
import { AppConfiguration } from '../../config/app.config';
import "./LaptopPage.sass";

class LaptopPageProperties extends BasePageProperties {
    match?: {
        params: {
            lid: string;
        }
    }
}

class LaptopPageState {
    data: LaptopModel|null = null;
}

export default class LaptopPage extends BasePage<LaptopPageProperties> {
    state: LaptopPageState;

    constructor(props: LaptopPageProperties) {
        super(props);

        this.state = {
            data: null,
        }
    }

    private getLaptopId(): number {
        return Number(this.props.match?.params.lid);
    }

    private getLaptopData(){
        LaptopService.getLaptopById(this.getLaptopId())
        .then(res => {
            this.setState({
                data: res
            });
        })
    }

    componentDidMount() {
        this.getLaptopData();
    }

    componentDidUpdate(oldProps: LaptopPageProperties) {
        if (oldProps.match?.params.lid !== this.props.match?.params.lid) {
            this.getLaptopData();
        }
    }

    getThumbPath(url: string): string {
        const directory = path.dirname(url);
        const extension = path.extname(url);
        const filename  = path.basename(url, extension);
        return directory + "/" + filename + "-thumb" + extension;
    }

    renderMain(): JSX.Element {
        if( this.state.data === null) {
            return(
                <>
                    <h1>Laptop not found</h1>
                    <p>The laptop you are looking for does not exist.</p>
                </>
            );
        }

        const laptop = this.state.data as LaptopModel;

       return (
           <>
            <h1>
                <Link to={ "/feature/" + laptop.features[0].featureId + "/laptop" }>
                    &lt; Back
                </Link> | { laptop.title }
            </h1>

            <Row>
                <Col xs={ 12 } md={ 8 }>
                    <Card className="mb-3">
                        <Row>
                            {
                               laptop.photos.map(photo => (
                                   <Col key={ "laptop-photo-" + photo.photoId }
                                   xs={ 12 } sm={ 6 } md={ 4 } lg={ 3 } className="mt-3">
                                       <Card.Img variant="top" src={ this.getThumbPath(
                                           AppConfiguration.API_URL + "/" + photo.imagePath) } />
                                   </Col>
                               )) 
                            }
                        </Row>
                        <Card.Body>
                            <Card.Text as="div">
                                <Row>
                                <strong className="h2">
                                    <Col xs={ 12 } md={ 4 }>
                                        &euro; { laptop.price.toFixed(2) }
                                    </Col>
                                    </strong>
                                    <Col xs={ 12 } md={ 8 } className="laptop-page-description">
                                        { laptop.description }
                                    </Col>
                                </Row>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={ 12 } md={ 4 }>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <b>Features</b>
                            </Card.Title>
                            <Card.Text as="div">
                                <ul>
                                    {
                                        laptop.features.map(lf => (
                                            <li key={ "laptop-feature-value-" + lf.featureId }>
                                                <b>{ lf.name }</b>: { lf.value }
                                            </li>
                                        ))
                                    }
                                </ul>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                
                </Col>
            </Row>

           </>
       ); 
    }
}