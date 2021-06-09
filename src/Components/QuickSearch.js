import {Component} from 'react';
import QuickSearchBox from './QuickSearchBox';

class QuickSearch extends Component{
    render(){
        const {mealTypes}=this.props;
        return(
            <div className="container mb-5 BottomPortion">
                <div className="quickSearchHeader">Quick Search</div>
                <div className="quickSearchSubHeader">Discover restaurants by type of meal</div>
                <div className="row">
                    {
                        mealTypes.map((item,index)=>{
                            return <QuickSearchBox imgsrc={require('../'+item.image).default} heading={item.name} texts={item.content} mealtypeId={item.name}/>
                        })
                    }
                </div>
            </div>
        );
    }
}

export default QuickSearch;