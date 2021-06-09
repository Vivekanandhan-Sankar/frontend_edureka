import {Component} from 'react';
import {withRouter} from 'react-router-dom';

class QuickSearchBox extends Component{
    handleClick(id,heading){
        const url = `/filter?mealtypes=${id}&mealTypeName=${heading}`;
        this.props.history.push(url);
    }
    render(){
        const {imgsrc , heading , texts, mealtypeId} = this.props;
        return(
            <>
            <div className="col-12 col-lg-4 col-md-6" onClick={()=>this.handleClick(mealtypeId,heading)}>
                         <div className="box">
                             <img src={imgsrc} className="Image" alt="loading"/>
                             <div className="boxText">
                                  <h4 className="boxHeading">{heading}</h4>
                                  <p className="boxContent">{texts}</p>
                             </div>
                         </div>
             </div>
            </>
        );

    }
}

export default withRouter(QuickSearchBox);