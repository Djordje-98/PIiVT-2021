import BasePage, { BasePageProperties } from '../BasePage/BasePage';
import { Link } from 'react-router-dom';
class CategoryPageProperties extends BasePageProperties {
    match?: {
        params: {
            cid: string;
        }
    }
}

class CategoryPageState {
    title: string = "";
    subcategories: number[] = [];
}
export default class CategoryPage extends BasePage<CategoryPageProperties> {
    state: CategoryPageState;

    constructor (props: CategoryPageProperties) {
        super(props);

        this.state = {
            title: "",
            subcategories: [],
        };
    }
    private getCategoryId(): number|null {
        const cid = this.props.match?.params.cid;
        return cid ? +(cid) : null;
    }

    private getCategoryData() {
        const cId = this.getCategoryId();

        if (cId === null) {
            this.setState({
                title: "All categories",
                subcategories: [
                    1, 4, 7, 13, 18,
                ],
            });
        } else {
            this.setState({
                title: "Category" + cId,
                subcategories: [
                    cId + 10,
                    cId + 11,
                    cId + 12,
                    cId + 13,
                    cId + 14,
                    cId + 15,
                ],
            });
        }
    }

    componentDidMount() {
        this.getCategoryData();
    }

    componentDidUpdate(prevProps: CategoryPageProperties, prevState: CategoryPageState) {
        if (prevProps.match?.params.cid !== this.props.match?.params.cid) {
            this.getCategoryData();
        }
    }

    renderMain(): JSX.Element {
       return (
           <>
           <h1>{ this.state.title }</h1>
           <ul>
               { this.state.subcategories.map(
                   cat => (
                    <li key={ "subcategory-link-" + cat }>
                        <Link to={ "/category/" + cat }>
                            Podkategorija {cat}
                        </Link>
                    </li>
                   )
                   ) 
                }
           </ul>
           </>
       ); 
    }
}