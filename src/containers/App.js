import React, { Component } from 'react';
import './App.css';
import Banner from '../components/Banner';
import MyMenu from '../components/MyMenu';
import LstGau from '../components/LstGau'
import MainContainer from '../components/MainContainer';
import _ from 'lodash';


var _debug = true;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        ressourceTypes:   {},
        ressourceTypeActive:  '',
        
        ressourceRecords:    [],
        ressourceRecordsLoading: false,
        ressourceRecordsLoadingIndex : 1,
        ressourceRecordsLoadingHowMany : 0,
        ressourceRecordsPropKeyName: '',
        ressourceRecordActive:  '',
        
        ressourceDetailLoading : false,
        ressourceDetailLoadingHowMany : 0,
        ressourceDetailLoadingIndex : 1,
        ressourceDetail : {}
    };
}

  componentDidMount () {
     fetch('https://swapi.co/api/')
    .then (pipe => pipe.json ())
    .then (pipe => this.setState ({ ressourceTypes : pipe}))
    .then (pipe => _debug ? console.log ("get Ressource Type OK : ", this.state.ressourceTypes) : null);
  }

  ressourceTypeChange = async (arg1, e) => {
/*       console.warn (e); */

    this.setState ({ ressourceTypeActive : arg1});

    let newIndex = this.state.ressourceRecordsLoadingIndex+1;
    this.setState ({ ressourceRecordsLoading : true});
    this.setState ({ ressourceRecordsLoadingIndex : newIndex}); 
    let myIndex = newIndex;
    /* console.warn("myIndex :", myIndex); */
    this.setState ({ ressourceRecordsPropKeyName : '' });
    this.setState ({ ressourceRecords : []});
    this.setState ({ressourceRecordsLoadingHowMany : 0});
    
    this.setState ({ressourceDetail : {}});
    this.setState ({ressourceDetailLoading : false});
    this.setState ({ressourceDetailLoadingHowMany : 0});
    this.setState ({ressourceDetailLoadingIndex : this.state.ressourceDetailLoadingIndex+1});

    let fetchURL = this.state.ressourceTypes[arg1]
    
    if (_debug) console.log("Set ressourceTypeActive =", arg1, "-- fetching :", fetchURL );

    let newPropKeyName;
    let newRecords = [];

    await fetch(fetchURL+'schema')
    .then (pipe => pipe.json ())
    .then (pipe => newPropKeyName = pipe['required']['0'])
    .then (pipe => _debug ? console.log ("get Ressource Records PropsKey : ", newPropKeyName) : null);

    let nextURL = '';
    let howManyCounter = 0;
    do {
      await fetch(fetchURL)
      .then (pipe => pipe.json ())
      .then (pipe => {
          console.log("nextURL :", nextURL);
          nextURL= pipe['next'];
          fetchURL = nextURL;
          newRecords = newRecords.concat(pipe['results']);
          howManyCounter = newRecords.length;
          if (_debug) console.log ("get Ressource Records OK : ", newRecords);
          if (this.state.ressourceRecordsLoadingIndex===myIndex) {
            this.setState ({ ressourceRecordsLoadingHowMany : howManyCounter});
          }
      });
    } while (nextURL!=null);

    //need to check if we are still the lastr "ressourceTypeChange" asked, else we don't change anything and die in silence

    
    if (this.state.ressourceRecordsLoadingIndex==myIndex) {
      /* console.warn ('apply it'); */
      this.setState ({ ressourceRecordsLoading : false});
      this.setState ({ ressourceRecordsPropKeyName : newPropKeyName });
      this.setState ({ ressourceRecords : newRecords});
      this.setState ({ ressourceRecordsActive : ''});
      console.log ("Promise ressourceTypeChange N° ", myIndex, " applying cause it is the current promise awaiting for (",this.state.ressourceRecordsLoadingIndex,")");
    } else {
      console.log ("Promise ressourceTypeChange N° ", myIndex, "is ignored cause it's too late (current await is :",this.state.ressourceRecordsLoadingIndex,")");
    };
  
      
  }

  ifURLconvertToName = async (supposedURL) => {

    if (supposedURL.toString().match(/^https:\/\/swapi\.co/)) {
        const fetchobj = await fetch (supposedURL).then (pipe => pipe.json());
    
/*         console.warn ("wwwwwwwwww :", fetchobj);
        console.warn ("yyyyyyyyyy :", _.values(fetchobj)[0]); */
    
        return _.values(fetchobj)[0]; 

    } else {
      return supposedURL;
    }
  }

  ressourceRecordChange = async (arg1,e) =>  {

    this.setState ({ ressourceRecordActive : arg1});

    let newIndex = this.state.ressourceDetailLoadingIndex+1;
    this.setState ({ ressourceDetailLoading : true});
    this.setState ({ ressourceDetailLoadingHowMany : 0});
    this.setState ({ ressourceDetailLoadingIndex : newIndex}); 
    let myIndex = newIndex;
    /* console.warn("myIndex :", myIndex); */

    let fetchURL = this.state.ressourceRecords.filter(record => record[this.state.ressourceRecordsPropKeyName] === arg1)[0].url;
    
    if (_debug) console.log("Set ressourceRecordActive =", arg1, "-- fetching :", fetchURL );

    let myDetail =  await fetch(fetchURL)
                          .then (pipe => pipe.json());

    //parse detail to found URL and change them by array of value....

    let howManyCounter = 0;

    for (const key in myDetail) {
      if (myDetail.hasOwnProperty(key)) {
        const value = myDetail[key];

        if (Array.isArray(value)) {
          let newValue = [];
          for (let i=0; i<value.length; i++) {
            newValue[i] = await this.ifURLconvertToName(value[i]);
            howManyCounter +=1;
            this.setState ({ ressourceDetailLoadingHowMany : howManyCounter});
          }
          myDetail[key] = newValue;
          console.log ("newValue", newValue, "myDetail[key]", myDetail[key]  )
        } else {
          myDetail[key] = await this.ifURLconvertToName(value);
          howManyCounter +=1;
          this.setState ({ ressourceDetailLoadingHowMany : howManyCounter});
        }
      }
    }

    if (this.state.ressourceDetailLoadingIndex==myIndex) {
      this.setState ({ ressourceDetail : myDetail})
      this.setState ({ ressourceDetailLoading : false});
      console.log ("Promise ressourceRecordChange N° ", myIndex, " applying cause it is the current promise awaiting for (",this.state.ressourceDetailLoadingIndex,")");
    } else {
      console.log ("Promise ressourceRecordChange N° ", myIndex, "is ignored cause it's too late (current await is :",this.state.ressourceDetailLoadingIndex,")");
    };


  }

  render() {

    return (
      <div className="App">
          <Banner />

          <MyMenu menuItems={this.state.ressourceTypes} 
                  onClickFunc={this.ressourceTypeChange}/>

          <LstGau lstGauItems={this.state.ressourceRecords} 
                  propKeyName={this.state.ressourceRecordsPropKeyName} 
                  loadingInProgress={this.state.ressourceRecordsLoading} 
                  loadingHowMany={this.state.ressourceRecordsLoadingHowMany}
                  onClickFunc={this.ressourceRecordChange}/>

          <MainContainer detailToShow={this.state.ressourceDetail}
                         loadingInProgress={this.state.ressourceDetailLoading}
                         loadingHowMany={this.state.ressourceDetailLoadingHowMany}/>  

      </div>
    );
  }
}

export default App;
