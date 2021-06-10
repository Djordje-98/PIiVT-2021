import BasePage, { BasePageProperties } from '../BasePage/BasePage';
import { Link, Redirect } from 'react-router-dom';
import CategoryModel from '../../../../03-back-end/dist/components/category/model';
import CategoryService from '../../services/CategoryService';
import EventRegister from '../../api/EventRegister';
import LaptopModel from '../../../../03-back-end/src/components/laptop/model';
class CategoryPageProperties extends BasePageProperties {
    match?: {
        params: {
            cid: string;
        }
    }
}

class CategoryPageState {
    title: string = "";
    subcategories: CategoryModel[] = [];
    showBackButton: boolean = false;
}
export default class CategoryPage extends BasePage<CategoryPageProperties> {
    state: CategoryPageState;

    constructor (props: CategoryPageProperties) {
        super(props);

        this.state = {
            title: "Loading...",
            subcategories: [],
            showBackButton: false,
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
                subcategories: [],
            });
            
            this.apiGetTopLevelCategories();
        } else {
            this.apiGetCategory(cId);
    }
    }

    private apiGetTopLevelCategories() {

        CategoryService.getTopLevelCategories()
        .then(categories => {
            if (categories.length === 0) {
                return this.setState({
                    title: "No categories found",
                    subcategories: [],                    
                    showBackButton: true,
                    parentCategoryId: null,
                });
            }

            this.setState({
                title: "All categories",
                subcategories: categories,
                showBackButton: false,
            });
        })
       
    }

    private apiGetCategory(cId: number){
        CategoryService.getCategoryById(cId)
        .then(result => {
            if (result === null) {
                return this.setState({
                    title: "Category not found",
                    subcategories: [],                    
                    showBackButton: true,
                });
            }

            this.setState({
                title: result.name,
                subcategories: result.features,
                showBackButton: true,
            });
        })
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
           <h1>
               {
                   this.state.showBackButton
                   ? (
                       <>
                       <Link to={"/category/"}>
                           &lt; Back
                       </Link>
                       </>
                   )
                   : ""
               }
               { this.state.title }
            </h1>

            {
                this.state.subcategories.length > 0
                ? (
                <>
                <ul>
                    { this.state.subcategories.map(
                        category => (
                            <li key={ "subcategory-link-" + category.categoryId }>
                            <Link to={ "/category/" + category.categoryId }>
                                {category.name}
                            </Link>
                            </li>
                        )
                   ) 
                }
           </ul>
           </>
                )
                : ""

            }
           </>
       ); 
    }
}