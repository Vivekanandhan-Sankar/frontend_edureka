import React, {Component} from 'react';
import '../CSS_folder/assign2.css'
import ImageContent from './ImageContent';
import QuickSearch from './QuickSearch';

import axios from 'axios';

const constant = require('../constant');
const API_URL = constant.API_URL;
<<<<<<< HEAD
=======

>>>>>>> 5c875d41425f92bd7dafb8cfb6b1ba36a1807516
class Home extends Component{
    constructor(){
        super();
        this.state={
            locations:[],
            mealTypes:[]
        }
    }
    componentDidMount(){
        axios.get(`${API_URL}/getAllRest`)
        .then(result=>{
            this.setState({
                locations: result.data.restaurants
            });
        }).catch(error=>{
            console.log(error);
        });
        axios.get(`${API_URL}/getMealTypes`)
        .then(result=>{
            this.setState({
                mealTypes:result.data.mealtypes
            });
        })
        .catch(error=>{
            console.log(error);
        });

    }
    render(){
        const {locations}=this.state;
        const {mealTypes}=this.state;
        return(
            <>
                <ImageContent cities={locations}/>
                <QuickSearch mealTypes={mealTypes}/>
            </>
        );
    }
}

export default Home;
