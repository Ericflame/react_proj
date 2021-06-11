import React, { Component } from 'react'
import Admin from './containers/Admin'
import Login from './containers/Login'
import {Route,Switch,Redirect} from 'react-router-dom'

export default class App extends Component {
    render() {
        return (
            <div className="app">
                <Switch>
                    <Route path='/Login' component={Login}/>
                    <Route path='/Admin' component={Admin}/>
                    <Redirect to="/Admin"/>    
                </Switch>
            </div>
        )
    }
}
