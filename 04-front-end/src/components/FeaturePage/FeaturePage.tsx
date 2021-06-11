import BasePage, { BasePageProperties } from '../BasePage/BasePage';
import { Link } from 'react-router-dom';
import FeatureModel from '../../../../03-back-end/src/components/feature/model';
import LaptopModel from '../../../../03-back-end/src/components/laptop/model';
import CategoryService from '../../services/CategoryService';
import FeatureService from '../../services/FeatureService';
import LaptopService from '../../services/LaptopService';
import { CardDeck } from 'react-bootstrap';
import LaptopItem from '../Laptop/LaptopItem';


class FeaturePageProperties extends BasePageProperties {
    match?: {
        params: {
            fid: string;
        }
    }
}

class FeaturePageState {
    title: string = "";
    showBackButton: boolean = true;
    features: FeatureModel[] = [];
    laptops: LaptopModel[] = [];
}


export default class FeaturePage extends BasePage<FeaturePageProperties> {
    state: FeaturePageState;

    constructor(props: FeaturePageProperties) {
        super(props);

        this.state = {
            title: "Loading...",
            showBackButton: true,
            features: [],
            laptops: [],
        };
    }

    private getFeatureId(): number|null {
        const fid = this.props.match?.params.fid;
        return fid ? +(fid) : null;
    }

    private getCategoryData() {
        const fId = this.getFeatureId();
        this.state.features = [];
        this.state.laptops = [];

        if (fId === null) {
            this.setState({
                features: [],
            });
            this.apiGetTopLevelCategories();
        } else {
            this.apiGetFeature(fId);
            this.apiGetLaptops(fId);
        }
    }

    private apiGetTopLevelCategories() {
        CategoryService.getTopLevelCategories()
        .then(categories => {
            if (categories.length === 0) {
                return this.setState({
                    title: "No categories found",
                    categories: [],
                    showBackButton: true,
                    parentCategoryId: null,
                });
            }

            this.setState({
                title: "All categories",
                categories: categories,
                showBackButton: false,
            });
        })
    }

    private apiGetFeature(fId: number) {
        FeatureService.getFeatureById(fId)
        .then(result => {
            console.log("apiGetFeature: ", result);
            if (result === null) {
                return this.setState({
                    title: "Feature not found",
                    features: [],
                    showBackButton: true,
                });
            }

            this.setState({
                title: result.name,
                showBackButton: true,
            });
        })
    }

    private apiGetLaptops(fId: number) {
        LaptopService.getLaptopsByFeatureId(fId)
        .then(result => {
            this.setState({
                laptops: result,
            });
        });
    }

    componentDidMount() {
        this.getCategoryData();
    }

    componentDidUpdate(prevProps: FeaturePageProperties, prevState: FeaturePageState) {
        if (prevProps.match?.params.fid !== this.props.match?.params.fid) {
            this.getCategoryData();
        }
    }

    renderMain(): JSX.Element {
        return(
            <>
                <h1>
                    {
                        this.state.showBackButton
                        ? (
                            <>
                                <Link to={ "/category/" }>
                                    &lt; Back
                                </Link>
                                |
                            </>
                        )
                        : ""
                    }
                    { this.state.title }
                </h1>
                {
                    this.state.features.length > 0
                    ? (
                        <>
                            <ul>
                                {
                                    this.state.features.map(
                                        feature => (
                                            <li key={ "feature-link-" + feature.featureId }>
                                                <Link to={ "/feature" + feature.featureId + "/laptop" }>
                                                    { feature.name }
                                                </Link>
                                            </li>
                                        )
                                    )
                                }
                            </ul>
                        </>
                    ) : ""
                }

                <CardDeck className="row">
                    {
                        this.state.laptops.map(
                            laptop => (
                                <LaptopItem key={ "laptop-item-" + laptop.laptopid } laptop={ laptop } />
                            )
                        )
                    }
                </CardDeck>
            </>
        );
    }

}