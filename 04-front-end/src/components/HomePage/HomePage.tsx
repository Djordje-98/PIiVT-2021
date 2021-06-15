import LaptopModel from "../../../../03-back-end/src/components/laptop/model";
import BasePage from "../BasePage/BasePage";
import LaptopItem from "../Laptop/LaptopItem";
import { CardDeck } from "react-bootstrap";
import LaptopService from "../../services/LaptopService";

class HomePageState {
    laptops: LaptopModel[] = [];
}
export default class HomePage extends BasePage<{}> {
    state: HomePageState = {
        laptops: [],
    };

    private getLaptops() {
        LaptopService.getLaptops()
        .then(res => {
            this.setState({
                laptops: res,
            })
        })
    }

    componentDidMount() {
        this.getLaptops();
    }
    renderMain(): JSX.Element {
       return (
          <CardDeck className="row">
              {
                  this.state.laptops.map(laptop => (
                      <LaptopItem key={ "laptop-item-" + laptop.laptopid } laptop={ laptop } />
                  ))
              }
          </CardDeck>
       ); 
    }
}