var React = require('react');
var ReactDOM = require('react-dom');
var classNames = require('classnames');
var Api = require('./utils/api');

var city;
var recentSearch = [];
var history = [];
var historyTemp = [];

class WeatherApp extends React.Component {
    
    constructor(props) {
        super(props);
    
        this.handleChange = this.handleChange.bind(this); 
        this.handleSearch = this.handleSearch.bind(this);
        this.handleRecentClick = this.handleRecentClick.bind(this); 

        this.state = { 
            weather: '',
            temp: 0,
            humidity: 0,
            wind: 0,
            country: '',
            history: []
        };
    }
    
    fetchData() {
        // Request new data to the API
        Api.get(city)
            .then(function(data) {
                if(data !== 'error') {
                    city = data.name;
                    recentSearch.forEach(function(item, index) {
                        if(city == item) {
                            recentSearch.splice(index, 1);
                        }
                    });

                    if(recentSearch.length > 14) {
                        recentSearch.pop();
                    }
                    recentSearch.unshift(city);
                    
                    this.setState({
                        weather: data.weather[0].id,
                        temp: Math.round(data.main.temp - 273.15), // Kelvin to Celcius
                        humidity: Math.round(data.main.humidity),
                        wind: Math.round(data.wind.speed),
                        country: data.sys.country,
                        city: data.name,
                        rain: data.rain
                    });
                } else {
                    alert('That city is not found');
                }
        }.bind(this));
    }
    
    handleChange(e) {
        var tempHistory = [];
        history.forEach((item, index) => {
            if(e.target.value.length >= 1) {
                if(history[index].toUpperCase().indexOf(e.target.value.toUpperCase()) == 0){
                    tempHistory.push(history[index]);
                    this.setState({history: tempHistory});
                }
            } else {
                this.setState({history: []})
            }
        });
        
        this.setState({
            value: e.target.value,
        })
    }
    
    handleRecentClick(item) {
        console.log(item);
        city = item;
        this.fetchData();
        
    }
    
    handleSearch(e) {
        this.setState({history: []})
        city = this.state.value;
        this.fetchData();
        
        history.forEach(function(item, index) {
            if(city.toUpperCase() == item) {
                console.log(city);
                console.log(item);
                history.splice(index, 1);
            }
        });
        
        history.push(city.toUpperCase());
        
    }
    
    // Called before the render method is executed
    componentWillMount() {
        city = 'Oslo'; // Set Oslo as the default city
        this.fetchData();
    }
    
    render() {
        // Build class names with dynamic data
        var weatherClass = classNames('wi wi-owm-' + this.state.weather);
        var colorStyle = '';
        var recentSearchStyle = 'recent-search ';
        var bgColorClass = 'weather-widget '; // very-warm, warm, normal, cold, very-cold
        

        // Set the background colour based on the temperature
        if (this.state.temp > 30) {
            bgColorClass += 'very-warm';
            colorStyle += 'very-warm';
        }
        else if (this.state.temp > 20 && this.state.temp <= 30) {
            bgColorClass += 'warm';
            colorStyle += 'warm';
        }
        else if (this.state.temp > 10 && this.state.temp <= 20) {
            bgColorClass += 'normal';
            colorStyle += 'normal';
        }
        else if (this.state.temp > 0 && this.state.temp <= 10) {
            bgColorClass += 'cold';
            colorStyle += 'cold';
        }
        else if (this.state.temp <= 0) {
            bgColorClass += 'very-cold';
            colorStyle += 'very-cold';
        }
        
        // Render the DOM elements
        return (
            <div className={bgColorClass}>
                <div className="search">
                    <input
                        className={`search-input ${colorStyle}`}
                        type='text'
                        value= {this.state.value}
                        onChange={this.handleChange}/>
                    <button 
                        onClick={this.handleSearch}
                        className={colorStyle}>
                        Search
                    </button>
                </div>
                {
                <ul className={`history ${colorStyle}`}>
                    {this.state.history.map((item, index) => {
                        return (<li key={ index } onClick={this.handleRecentClick.bind(this, item)}>{item}</li>);
                    })}
                </ul>
                }
                
                <h1 className="city">
                    {this.state.city}
                    <span className="country">({this.state.country})</span>
                </h1>

                <div className="weather">
                    <i className={weatherClass}></i>
                </div>
                <section className="weather-details">
                    <div className="temp"><span className="temp-number">{this.state.temp}</span><span className="wi wi-degrees"></span></div>
                    <div className="humidity"><i className="wi wi-raindrop"></i>{this.state.humidity} %</div>
                    <div className="wind"><i className="wi wi-small-craft-advisory"></i>{this.state.wind}   <span className="vel">Km/h</span></div>
                </section>   
                
                <ul className={`recent-search ${colorStyle}`}>
                    {recentSearch.map((item, index) =>{
                    return (<li key={ index } onClick={this.handleRecentClick.bind(this, item)}>{item}</li>);
                 })}
                </ul>
            </div>  
        )}
}

// Assign the React component to a DOM element
var element = React.createElement(WeatherApp, {});
ReactDOM.render(element, document.querySelector('.container'));