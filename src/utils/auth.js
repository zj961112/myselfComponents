import Cookies from 'js-cookie';

const TokenKey = 'Message-Center-Web-Token';
const UserKey = 'Message-Center-Web-User';

function getToken() {
	return Cookies.get(TokenKey)
}

function setToken(token) {
	return Cookies.set(TokenKey, token)
}

function removeToken() {
	return Cookies.remove(TokenKey)
}

function getUser() {
	const token = sessionStorage.getItem(UserKey);
	return (!token || token == 'undefined' || token == 'null') ? {} : JSON.parse(token);
}

function setUser(user) {
	return sessionStorage.setItem(UserKey, JSON.stringify(user));
}

function removeUser() {
	return sessionStorage.removeItem(UserKey);
}

export {
	getToken,
	setToken,
	removeToken,
	getUser,
	setUser,
	removeUser
}