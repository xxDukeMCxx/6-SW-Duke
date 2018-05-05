import React, { Component } from 'react';
import './App.css';
import Banner from '../components/Banner';
import MyMenu from '../components/MyMenu';
import LstGau from '../components/LstGau'


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
    console.warn("myIndex :", myIndex)
    this.setState ({ ressourceRecordsPropKeyName : '' });
    this.setState ({ ressourceRecords : []});
    this.setState ({ressourceRecordsLoadingHowMany : 0});
          
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
      console.warn ('apply it');
      this.setState ({ ressourceRecordsLoading : false});
      this.setState ({ ressourceRecordsPropKeyName : newPropKeyName });
      this.setState ({ ressourceRecords : newRecords});
      console.log ("Promise ressourceTypeChange N° ", myIndex, " applying cause it is the current promise awaiting for (",this.state.ressourceRecordsLoadingIndex,")");
    } else {
      console.log ("Promise ressourceTypeChange N° ", myIndex, "is ignored cause it's too late (current await is :",this.state.ressourceRecordsLoadingIndex,")");
    };
  
      
  }

  render() {

    return (
      <div className="App">
          <Banner />
          <MyMenu menuItems={this.state.ressourceTypes} onClickFunc={this.ressourceTypeChange}/>
          <LstGau lstGauItems={this.state.ressourceRecords} propKeyName={this.state.ressourceRecordsPropKeyName} loadingInProgress={this.state.ressourceRecordsLoading} loadingHowMany={this.state.ressourceRecordsLoadingHowMany}/>
  
        <div className="mainContainer">
          <h1>main</h1>
        </div>
      </div>
    );
  }
}

export default App;
