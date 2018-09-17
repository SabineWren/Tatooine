/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2018 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
export { FetchJson, FetchText, Warning };

const logError = function(reason) {
	setTimeout(() => { throw new Error(reason)});
};

let requests = 3;

const FetchJson = async function(err, url) {
	while(requests < 1) { await sleep(50); }
	requests--;
	
	return fetch(url)
		.then(function(resp) {
			if(resp.ok){
				const result = resp.json();
				requests++;
				return result;
			}
			throwError(err, "error retrieving json from url: " + url);
		})
		.catch(reason => throwError(err, reason));
};

const FetchText = async function(err, url) {
	while(requests < 1) { await sleep(50); }
	requests--;
	
	return fetch(url)
		.then(function(resp) {
			if(resp.ok){
				const result = resp.text();
				requests++;
				return result;
			}
			throwError(err, "error retrieving json from url: " + url);
		})
		.catch(reason => throwError(err, reason));
};

const sleep = function(ms){
	return new Promise(resolve => setTimeout(resolve, ms));
};

const Warning = function(err) {
	console.log("placeholder until user-visible error block: " + err);
	return [];
};

const throwError = function(err, reason){
	err.message = reason;
	window.setTimeout(function() {
		requests++;
		throw err;
	});
};

window.onerror = function(message, source, lineno, colno, err){
	console.log("source: " + source);
	console.log("line number: " + lineno);
	console.log("reason: " + err.message);
}

window.onunhandledrejection = function(err) {
	console.log("Failed to catch error!");
	console.log(err.message);
}
