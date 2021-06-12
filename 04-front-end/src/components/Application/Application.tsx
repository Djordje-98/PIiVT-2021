import React from 'react';
import { Container } from 'react-bootstrap';
import TopMenu from '../TopMenu/TopMenu';
import './Application.sass';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import HomePage from '../HomePage/HomePage';
import CategoryPage from '../CategoryPage/CategoryPage';
import ContactPage from '../ContactPage/ContactPage';
import AdministratorLogin from '../Administrator/AdministratorLogin';
import EventRegister from '../../api/EventRegister';
import api from '../../api/api';
import AdministratorLogout from '../Administrator/AdministratorLogout';
import FeaturePage from '../FeaturePage/FeaturePage';
import LaptopPage from '../Laptop/LaptopPage';


class ApplicationState {
  authorizedRole: "administrator" | "visitor" = "visitor";
}
export default class Application extends React.Component {
  state: ApplicationState;

  constructor(props: any) {
    super(props);

    this.state = {
      authorizedRole: "visitor",
    };
  }

  componentDidMount() {
    EventRegister.on("AUTH_EVENT", this.authEvenntHandler.bind(this));

    this.checkRole("administrator");
}

componentWillUnmount() {
    EventRegister.off("AUTH_EVENT", this.authEvenntHandler.bind(this));
}

private authEvenntHandler(message: string) {
  if (message === "force_login" || message === "administrator_logout") {
      return this.setState({
        authorizedRole: "visitor",
      });
  }
  if (message === "administrator_login") {
      return this.setState({
        authorizedRole: "administrator",
      });
  }
}

private checkRole(role: "administrator") {
  api("get", "/auth/" + role + "/ok", role)
  .then(res => {
    if(res?.data === "OK") {
      this.setState({
        authorizedRole: role,
      });

      EventRegister.emit("AUTH_EVENT", role + "_login");
    }
  })
  .catch(() =>{});
}

  render() {
    return (
      <BrowserRouter>
      <Container className="Application">
        <div className="Application-header">
        Front-end aplikacije
        </div>

      <TopMenu currentMenuType ={ this.state.authorizedRole } />

        <div className="Application-body">
          <Switch>
            <Route exact path="/" component={ HomePage } />
  
            <Route path="/category/:cid?"
                  render={
                    (props: any) => {
                      return(
                        <CategoryPage {...props} /> );
                    }
                  } />

            <Route path="/feature/:fid?/laptop"
            render={
              (props: any) => {
                return (
                        <FeaturePage {...props} /> );
              }
            } />
            <Route path="/laptop/:lid" component={ LaptopPage } />
  
            <Route path="/contact">
              <ContactPage 
              title="Our location in Belgrade"
              address="Djordja Pavlovica 1, 11000 Beograd, Srbija"
              phone="+381 65 6564589"/>
            </Route>
            <Route path="/administrator/login" component={AdministratorLogin} />
            <Route path="/administrator/logout" component={AdministratorLogout} />
          </Switch>
        </div>
        <div>
        &copy; 2021...
      </div>
      </Container>
      </BrowserRouter>
    );
  }
}

