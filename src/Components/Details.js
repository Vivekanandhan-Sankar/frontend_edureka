import {Component} from 'react';
import axios from 'axios';
import queryString from 'query-string';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../CSS_folder/details.css"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {withRouter} from 'react-router-dom';
import Modal from 'react-modal';

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
        width: '370px',
        padding: '20px',
        background: 'white',
        overflow: 'auto',
        position: 'absolute'
    }
};

class Details extends Component{
    constructor(){
        super();
        this.state={
            restaurants : [],
            restaurantName:'',
            id:'',
            cuisine:[],
            cost:0,
            ph_no:0,
            address:'',
            isMenuModalOpen: false,
            menu: [],
            userId:'',
            totalPrice: 0,
            no_of_items: [0,0,0,0,0,0,0,0,0,0,0,0],
            restaurantId:0,
            dishesArr:[],
            quantity:[],
            total:0,
            order:[],
            paymentStatus:"Payment Not Done"
        };
    }
    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const  { id } = qs;
        this.setState({
            id:id,
        });
        axios.get(`${API_URL}/getRestaurantById/${id}`)
            .then(result => {
                const restaurants=result.data.restaurants
                this.setState({
                    restaurants: result.data.restaurants,
                    restaurantName:restaurants[0].name,
                    cuisine:restaurants[0].Cuisine,
                    cost:restaurants[0].cost,
                    ph_no:restaurants[0].contact_number,
                    address:restaurants[0].address,
                });
            })
            .catch(error => {
                console.log(error);
            });
        axios.get(`${API_URL}/getMenuByRestaurant/${id}`)
            .then(result => {
                this.setState({
                    menu: result.data.menu
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
    openMenuHandler = () => {
        this.setState({
            isMenuModalOpen: true
        });
    }

    closeMenuHandler = () => {
        this.setState({
            isMenuModalOpen: false
        });
    }

    addItemHnadler = (item,index) => {
        const { totalPrice,no_of_items,dishesArr,quantity} = this.state; 
        no_of_items[index] = no_of_items[index]+1;
        const i = dishesArr.indexOf(item.dish);
        if(i < 0){
            dishesArr.push(item.dish);
            quantity.push(1);
        }else{
            quantity[i] = quantity[i]+1;
        }
        this.setState({
            dishesArr:dishesArr,
            quantity:quantity,
            totalPrice: totalPrice + item.cost,
            no_of_items:no_of_items
        });
    }
    minusItemHnadler = (item,index) => {
        const { totalPrice,no_of_items,dishesArr,quantity} = this.state;
        
        if(no_of_items[index] > 0){
            no_of_items[index] = no_of_items[index]-1;
            const i = dishesArr.indexOf(item.dish);
            if(i >= 0){
                quantity[i] = quantity[i]-1;
                if(quantity[i]==0){
                    dishesArr[i]='Extras';
                }
            }
            this.setState({
               totalPrice: totalPrice - item.cost,
               no_of_items:no_of_items,
               quantity:quantity,
               dishesArr:dishesArr
            });
        }else{
            this.setState({
                totalPrice: totalPrice,
                no_of_items:no_of_items
             });
        }
    }
    

    getCheckSum = (data) => {
        return fetch(`${API_URL}/payment`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(data)
        }).then(result => {
            return result.json();
        }).catch(error => {
            console.log(error);
        });
    }

    isObj = (val) => {
        return typeof val === 'object';
    }

    isDate = (val) => {
        return Object.prototype.toString.call(val) === '[object Date]';
    }

    stringifyValue = (value) => {
        if (this.isObj(value) && !this.isDate(value)) {
            return JSON.stringify(value);
        } else {
            return value;
        }
    }

    builfForm = (details) => {
        const { action, params } = details;

        const form = document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('action', action);

        Object.keys(params).forEach(key => {
            const input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', key);
            input.setAttribute('value', this.stringifyValue(params[key]));
            form.appendChild(input);
        });
        return form;
    }

    postTheInfo = (details) => {
        const form = this.builfForm(details);
        document.body.appendChild(form);
        form.submit();
        form.remove();
    }

    paymentHandler = () => {
        if (this.state.totalPrice == 0) {
            return;
        }
        const data = {
            amount: this.state.totalPrice,
            email: 'XXXXXXXX@gmail.com'
        };
        this.getCheckSum(data)
            .then(result => {
                let information = {
                    action: "https://securegw-stage.paytm.in/order/process", // URL of paytm server
                    params: result
                }
                this.postTheInfo(information);
            })
            .catch(error => {
                console.log(error);
            });
    }
    handlingOrder = () => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if(isLoggedIn){
        this.paymentHandler();
        let user=localStorage.getItem("user");
        user = JSON.parse(user);
        const userId = user._id;
        const { restaurantName,dishesArr,quantity,totalPrice,paymentStatus} = this.state;
        const obj = {
            userId:userId,
            restaurantName:restaurantName,
            dishesArr:dishesArr,
            quantity:quantity,
            total:totalPrice,
            paymentStatus:paymentStatus
        }
        axios({
            method:'POST',
            url:`${API_URL}/order`,
            header:{'Content-Type':'application/json'},
            data:obj
        }).then(result => {
            this.setState({
                order:result
            })
        }).catch(error=>{
            console.log(error);
        })
        debugger
        }else{
            window.alert("DO LOGIN FIRST !!! If you do not have an account 'CREATE AN ACCOUNT' and make your Order"  );
        }
    }

    render(){
        const {restaurantName,cuisine,cost, ph_no,address,isMenuModalOpen, menu, totalPrice,no_of_items,no }=this.state;
        return(
            <>
                <div className="container">
                    <div className="imageGallery pt-5">
                        <Carousel autoPlay={true} interval={2000} showArrows={false} dynamicHeight={false} showThumbs={false} infiniteLoop={true}>
                            <div className="image">
                                <img src={require('../assets/nightlife.png').default} alt="homeImage"/>
                            </div>
                            <div className="image">
                                <img src={require('../assets/lunch.png').default} alt="homeImage"/>
                            </div>
                            <div className="image">
                                <img src={require('../assets/drinks.png').default} alt="homeImage"/>
                            </div>
                            <div className="image">
                                <img src={require('../assets/dinner.png').default} alt="homeImage"/>
                            </div>
                            <div className="image">
                                <img src={require('../assets/snacks.png').default} alt="homeImage"/>
                            </div>
                        </Carousel>
                    </div>
                    <div className="name my-4">
                         {restaurantName}
                    </div>
                <div className="float-end">
                    <button className="btn btn-danger" onClick={this.openMenuHandler}>Place Online Order</button>
                </div>
                <div className="mytabs mt-5">
                    <Tabs>
                        <TabList>
                            <Tab className="reactTab">Overview</Tab>
                            <Tab className="reactTab">Contact</Tab>
                        </TabList>

                        <TabPanel>
                            <h4 className="subheading my-3">About this place</h4>
                            <h5 className="subheading">Cuisine</h5>
                            <div className="content">
                                {
                                    cuisine.map(item=>{
                                        return `${item.name} , `
                                    })
                                }
                            </div>
                            <br/>
                            <h5 className="subheading">Average Cost</h5>
                            <div className="content mb-5">
                                  &#8377;{cost} for two people(approx.)
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <h5 className="subheading">Phone Number</h5>
                            <div className="ph_no">
                                {ph_no}
                            </div>
                            <div className="restarauntName mt-3">
                                {restaurantName}
                            </div>
                            <div className="address">
                                {address}
                            </div>
                        </TabPanel>
                    </Tabs>
                </div>
                <Modal isOpen={isMenuModalOpen} style={customStyles} className="modal-dialog-scrollable">
                            <h3 className="restName">{restaurantName}</h3>
                            <button onClick={this.closeMenuHandler} className="bi bi-x closeBtn"></button>
                            <ul className="menu">
                                {
                                    menu.map((item, index) => {
                                        return <li key={index}>
                                            <div className="row no-gutters menuItem">
                                                <div className="col-lg-7 col-6">
                                                    <div className="cuisines">{ item.dish }</div>
                                                    <div className="cuisines">&#8377;{ item.cost }</div>
                                                    <div className="cuisines item-desc text-muted">{ item.description }</div>
                                                </div>
                                                <div className="col-lg-5 col-6">
                                                    <button className="btn btn-light addButton" onClick={() => this.minusItemHnadler(item,index)}>-</button>
                                                    <span className="no_of_items">{no_of_items[index]}</span>
                                                    <button className="btn btn-light addButton" onClick={() => this.addItemHnadler(item,index)}>+</button>
                                                </div>
                                            </div>
                                        </li>
                                    })
                                }
                            </ul>
                            <div className="mt-3 restName fs-4">
                                Subtotal  <span className="m-4">&#8377;{ totalPrice }</span><br/>
                                <button className="btn btn-danger mt-1 mx-5" onClick={()=>this.handlingOrder()}>ADD to cart & Pay Now</button>
                            </div>
                        </Modal>
                </div>
            </>
        );
    }
}

export default withRouter(Details);
