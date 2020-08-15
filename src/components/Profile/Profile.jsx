import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { Route } from "react-router-dom";

import './profile.css'
import Sidebar from '../Sidebar/Sidebar'
// import ProfileInfo from './ProfileInfo'
// import { Route } from "react-router-dom";
// import Settings from "../Settings/Settings";
// import Recommendation from "../Search/Recommendation";
// import Messages from "../Messages/Messages";
// import Recommendation from "../Search/Recommendation";
import Messages from "../Messages/Messages";
import Recommendation from "../Recommendation/Recommendation";
import Settings from "../Settings/Settings";
import ProfileInfoTest from './ProfileInfoTest'
import { useCookies } from 'react-cookie';

const Profile = ({...props}) => {
	const [userData, setUserData] = useState([]);
	const [cookie, setCookie] = useCookies(['name']);
	console.log('userData Profile', userData);
	let id = props.match.params.id;
	console.log('profile id',id);
	console.log('profile props',props);
	// get

	useEffect(() => {
		axios.get(`/api/profile/${id}`)
			.then(response => {
				console.log('USER ID RESP', response);
				let data = response.data;
				setUserData(data);
			})
	}, [id]);

	return (
		<div className="content">
			<Sidebar />

			<Route path={`/profile/${id}`} exact render={() => <ProfileInfoTest user={userData}/>}/>
			{/*<Route path={`/profile/${id}/messages`} exact render={() => <Messages/>}/>*/}
			{/*<Route path={`/profile/${id}/settings`} render={() => <Settings/>}/>*/}
			<Route path='/search' exact render={() => <Recommendation/>}/>

		</div>

	)
}

export default Profile
