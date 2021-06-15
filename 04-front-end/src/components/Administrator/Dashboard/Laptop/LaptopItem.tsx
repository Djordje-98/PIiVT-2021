import { Link } from "react-router-dom";
import { Col, Card, Row } from 'react-bootstrap';
import * as path from "path";
import LaptopModel from "../../../../../../03-back-end/src/components/laptop/model";
import { AppConfiguration } from "../../../../config/app.config";

interface LaptopItemProperties {
    laptop: LaptopModel;
}

function getThumbPath(url: string): string {
    const directory = path.dirname(url);
    const extension = path.extname(url);
    const filename  = path.basename(url, extension);
    return directory + "/" + filename + "-thumb" + extension;
}

export default function LaptopItem(props: LaptopItemProperties) {
    return (
        <Col xs={ 12 } sm={ 6 } md={ 4 } lg={ 3 } className="mt-3">
            <Card>
                <Link to={ "/laptop/" + props.laptop.laptopid }>
                    <Card.Img variant="top" src={ getThumbPath(AppConfiguration.API_URL + "/" + props.laptop.photos[0]?.imagePath) } />
                </Link>
                <Card.Body>
                    <Row>
                        <Col>
                            <Card.Title>
                                <Link to={ "/laptop/" + props.laptop.laptopid }>
                                    { props.laptop.title }
                                </Link>
                            </Card.Title>
                        </Col>

                        <Col className="text-center">
                            <Card.Text as="div" className="h5">
                                <b>&euro; { props.laptop.price }</b>
                            </Card.Text>
                        </Col>
                    </Row>
                    
                    <Card.Text as="div" className="text-truncate">
                        { props.laptop.description }
                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>
    );
}