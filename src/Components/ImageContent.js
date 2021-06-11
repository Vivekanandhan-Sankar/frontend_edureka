import {Component} from 'react';
import axios from 'axios';
import '../CSS_folder/imageContent.css';
import {withRouter} from 'react-router-dom';

const constant = require('../constant');
const API_URL = constant.API_URL;

class ImageContent extends Component{

    constructor(){
        super();
        this.state={
            searchText:'',
            restaurants:[],
            suggestions:[],
        }
    }
    onSelectingCity(event){
        const city_city_name=event.target.value;
        const city = city_city_name.split('_')[0];
        const city_name = city_city_name.split('_')[1];
        localStorage.setItem("city",city);

        axios.get(`${API_URL}/getRestaurantByCity/${city_name}`)
        .then(result=>{
            this.setState({
                restaurants:result.data.restaurants
            })
        }).catch(error=>{
            console.log(error);
        });
    }
    onTextChange=(event)=>{
        const searchText = event.target.value;
       const {restaurants} = this.state;
       let suggestions = [];
       if(searchText.length > 0){
           suggestions=restaurants.filter(item=> item.name.toLowerCase().includes(searchText.toLowerCase()));
       }    
       this.setState({
           suggestions:suggestions,
           searchText:searchText
       })  
    }
    goToRestaraunt=(item)=>{
        const url = `/details?id=${item._id}`;
        this.props.history.push(url);
    }
    renderSuggestions=()=>{
        const {suggestions,searchText} = this.state;
        if(searchText.length == 0){
            return null;
        }
        return(
            <ul className="suggestionsBox">
                {
                    suggestions.map((item, index) => {
                        return (
                            <li key={index} onClick={()=>this.goToRestaraunt(item)}>
                                <div className="suggestionImage">
                                    <img src={require('../assets/dinner.png').default} alt="myimg"/>
                                </div>
                                <div className="suggestionText w-100">
                                    <div>
                                        {item.name}, {item.locality}
                                    </div>
                                    <div className="text-muted">
                                        Cost: {item.cost}
                                        <span className="text-danger float-end">
                                            Order Now 
                                        </span>
                                    </div>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        )
    }
    render(){
        const {cities}=this.props;
        return(
            <>
              <img src={require('../assets/main_image.png').default} className="mainImage" alt="loading"/>
           <div className="imageContent">
              <div className="logo">
               e!
              </div>
              <div className="imageText">Find the best restaurants, cafes, and bars</div>
              <div className="selectlocation" onChange={(event)=>this.onSelectingCity(event)}>
                  <select className="select">
                      <option value="0">Select location</option>
                      {
                          cities.map((item,index)=>{
                              return <option key={index} value={item.city +'_'+ item.city_name}>{item.locality},{item.city_name}</option>;
                          })
                      }
                  </select>
              </div>
              <div className="searchRestaurants">
                  <input className="searchRestaurantsInput" type="text"  placeholder=" &#128269; Search for restaraunts" onChange={(e)=>this.onTextChange(e)}/>
                  {
                      this.renderSuggestions()
                  }
              </div>
             <div className="msg text-white" >Kindly Select Location and then Search for restaraunts</div>
           </div>
           
            </>
        );
    }
}

export default withRouter(ImageContent);
