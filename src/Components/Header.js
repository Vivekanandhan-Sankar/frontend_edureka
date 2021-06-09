import {Component} from 'react';
import {withRouter} from 'react-router-dom';
import '../CSS_folder/header.css'
import Modal from 'react-modal';
import axios from 'axios';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';


const constant = require('../constant');
const API_URL = constant.API_URL;

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: '2px solid tomato',
        width: '350px'
    }
};
const customStylesForOrders = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: '2px solid tomato',
        width: '400px'
    }
};

class Header extends Component{
    constructor(){
        super();
        this.state={
            background:'transparent',
            isLoginModalOpen: false,
            isSignUpModalOpen: false,
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            user: undefined,
            orders:[],
            isLoggedIn: false,
            loginError: undefined,
            signUpError: undefined,
            isOrderModalOpen: false,
        }
    }
    componentDidMount() {
        const initialPath = this.props.history.location.pathname;
        this.setHeaderStyle(initialPath);

        this.props.history.listen((location, action) => {
            this.setHeaderStyle(location.pathname);
        });
    

        const isLoggedIn = localStorage.getItem("isLoggedIn");
        let user = localStorage.getItem("user");
        if (user) {
            user = JSON.parse(user);
        }
        this.setState({
            user: user,
            isLoggedIn: isLoggedIn
        });
    }    

    setHeaderStyle = (path) => {
        let bg = '';
        if (path === '/' || path === '/home' || path ===' ') {
            bg = 'transparent';
        } else {
            bg = '#eb2929';
        }
        this.setState({
            background: bg
        });
    }

    handleChange = (event, field) => {
        this.setState({
            [field]: event.target.value,
            loginError: undefined
        });
      }

    handleLoginButtonClick = () => {
        this.setState({
            isLoginModalOpen: true
        });
    }
    handleSignUpButtonClick = () => {
        this.setState({
            isSignUpModalOpen: true
        });
    }

    handleLogin = () => {
        // call the API to login the user
        const  { username, password } = this.state;
        const obj = {
            email: username,
            password: password
        }
        axios({
            method: 'POST',
            url: `${API_URL}/userLogin`,
            header: { 'Content-Type': 'application/json' },
            data: obj
        }).then(result => {
            localStorage.setItem("user", JSON.stringify(result.data.user[0]));
            localStorage.setItem("isLoggedIn", true);
            this.setState({
                user: result.data.user[0],
                isLoggedIn: true,
                loginError: undefined
            });
            this.resetLoginForm();
        }).catch(error => {
            this.setState({
                loginError: 'Username or password is wrong !!'
            });
            console.log(error);
        });
    }

    handleSignUp = () => {
        const  { username, password, firstName, lastName } = this.state;
        const obj = {
            email: username,
            password: password,
            firstName: firstName,
            lastName: lastName
        }
        axios({
            method: 'POST',
            url: `${API_URL}/userSignUp`,
            header: { 'Content-Type': 'application/json' },
            data: obj
        }).then(result => {
            debugger
            localStorage.setItem("user", JSON.stringify(result.data.user));
            localStorage.setItem("isLoggedIn", true);
            this.setState({
                user: result.data.user,
                isLoggedIn: true,
                loginError: undefined,
                signUpError: undefined
            });
            this.resetSignUpForm();
        }).catch(error => {
            this.setState({
                signUpError: 'Error in SignUp'
            });
            console.log(error);
        });
    }
    logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        this.setState({
            user: undefined,
            isLoggedIn: false
        });
    }

    resetLoginForm = () => {
        this.setState({
            isLoginModalOpen: false,
            username: '',
            password: '',
            loginError: undefined
        });
    }
    resetSignUpForm = () => {
        this.setState({
            isSignUpModalOpen: false,
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            signUpError: undefined
        });
    }
    logoClickHandler = () => {
        this.props.history.push('/');
        this.setState({
            background:'transparent',
        })
    }
    viewOrder=()=>{
        this.setState({
            isOrderModalOpen:true
        })
        this.handleViewOrder();
    }
    closeOrderModal=()=>{
        this.setState({
            isOrderModalOpen:false
        })
    }
    handleViewOrder=()=>{
        const {user} = this.state;
        const userId = user._id;
        axios.get(`${API_URL}/getOrderwithUserId/${userId}`)
        .then(result =>{
            this.setState({
                orders:result.data.orders
            })
        }).catch();
    }
    dishes=(order)=>{
        let dishes = order.dishes;
        let quantity = order.quantity;
        const l=dishes.length;
        let food=[];
        for(let i=0; i<l; i++){
            food.push(<div key={i} className="orderCost">  {dishes[i]} : {quantity[i]}</div>)
        }
        return food;
    }

    render(){
        const {background, isLoginModalOpen, username, password, isLoggedIn, user, loginError, isSignUpModalOpen, firstName, lastName, signUpError,isOrderModalOpen,orders} =this.state;
        return(
            <div className="header" style={ {'background': background}}>
                {
                    background === '#eb2929'
                    ?
                    <div className="header-logo" onClick={this.logoClickHandler}>
                        e!
                    </div>
                    :
                    null
                }
               <div className="float-end">
                    {
                        isLoggedIn 
                        ?
                        <div className="p-1">
                            <button className="btn float-end mx-1 btn-outline-light" onClick={this.viewOrder}><i class="fa fa-shopping-cart"></i> Cart</button>
                            <span className="text-white m-2">{ user.firstName }</span>
                            <button className="btn btn-outline-light" onClick={this.logout}>Logout</button>
                        </div> 
                        :
                        <div className="p-1">
                            <button className="btn text-white" onClick={this.handleLoginButtonClick}>Login</button>
                            <button className="btn btn-outline-light" onClick={this.handleSignUpButtonClick}>Create an account</button>
                        </div>
                    }
                </div>
                <Modal isOpen={isLoginModalOpen} style={customStyles}>
                    <h3>User Login</h3>
                    <form>
                    {
                        loginError ? <div className="alert alert-danger">{loginError}</div> : null
                    }
                    <label className="form-label">Username:</label>
                    <input type="text" value={username} className="form-control" onChange={(event) => this.handleChange(event, 'username')} />
                    <br />
                    <label className="form-label">Password:</label>
                    <input type="password" value={password} className="form-control" onChange={(event) => this.handleChange(event, 'password')} />
                    <br/>
                    <br/>
                    <FacebookLogin 
                            appId="1120641251750699"
                            textButton="Continue with Facebook"
                            fields="name,email,picture"
                            size="metro"
                            callback={this.faceBookLoginHandler}
                            cssClass="fb"
                            icon="bi bi-facebook p-2"
                        />
                        <br/>
                        <br/>
                        <GoogleLogin 
                            clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                            buttonText="Continue with Google"
                            onSuccess={this.responseSuccessGoogle}
                            onFailure={this.responseFailureGoogle}
                            cookiePolicy={'single_host_origin'}
                            icon="true"
                            className="google"
                        />
                        <br/>
                        <br/>
                    <input type="button" className="btn btn-primary" onClick={this.handleLogin} value="Login"/>
                    <input type="button" className="btn" onClick={this.resetLoginForm} value="Cancel"/>
                    </form>
                </Modal>
                <Modal isOpen={isSignUpModalOpen} style={customStyles}>
                    <h3>User Signup</h3>
                    <form>
                        {
                            signUpError ? <div className="alert alert-danger">{signUpError}</div> : null
                        }
                        <label className="form-label">First Name:</label>
                        <input type="text" value={firstName} className="form-control" onChange={(event) => this.handleChange(event, 'firstName')} />
                        <br />
                        <label className="form-label">Last Name:</label>
                        <input type="text" value={lastName} className="form-control" onChange={(event) => this.handleChange(event, 'lastName')} />
                        <br />
                        <label className="form-label">Email:</label>
                        <input type="text" value={username} placeholder="username" className="form-control" onChange={(event) => this.handleChange(event, 'username')} />
                        <br />
                        <label className="form-label">Password:</label>
                        <input type="password" value={password} className="form-control" onChange={(event) => this.handleChange(event, 'password')} />
                        
                        <input type="button" className="btn btn-primary" onClick={this.handleSignUp} value="Sign Up"/>
                        <input type="button" className="btn" onClick={this.resetSignUpForm} value="Cancel"/>
                    </form>
                </Modal>
                <Modal isOpen={isOrderModalOpen} style={customStylesForOrders}>
                    <h4>Your Orders</h4>
                    <button onClick={this.closeOrderModal} className="bi bi-x closeBtn"></button>
                    { orders.length > 0
                    ?
                    
                        orders.map((item,index) => {
                            return (
                                <>
                                <div className="bar mb-3"></div>
                                <div className="orderRestName">Restaurant : <span className="orderRestName2"> {item.restaurantName}</span></div>
                                <div className="orderItems">  ITEMS : </div>
                                {
                                    this.dishes(item)
                                }
                                <div className="orderCost float-end">Total Cost : <span className="orderCost2">&#8377; {item.cost}</span></div>
                                <div className="orderCost mb-4">STATUS : <span className="orderStatus">Order Received</span></div>
                                </>
                            )
                        })
                    :
                    <div className="noOrderMsg my-3">You have not placed an order !!</div>
                    }
                </Modal>
                </div>
        );
    }
}

export default withRouter(Header);