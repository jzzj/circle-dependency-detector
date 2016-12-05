function CircleDependencyDetector(){
	if(!(this instanceof CircleDependencyDetector)){
		return new CircleDependencyDetector;
	}
	this.map = {};
}

CircleDependencyDetector.prototype = {
	constructor: CircleDependencyDetector,
	init: function(identifier){
		if(this.map[identifier]){
			return this.map[identifier];
		}
		var cur = this.map[identifier] = Object.create(proto);
		cur.dependency = [];
		cur.requiredBy = [];
		cur.key = identifier;
		cur.init = this.init;
		cur.get = this.get;
		cur.map = this.map;
		return cur;
	},
	get: function(item){
		return item ? this.map[item] : this.map;
	},
	reset: function(item){
		return this.map = {};
	},
	detectWithRequired: detectWithRequired
};

module.exports = CircleDependencyDetector;

CircleDependencyDetector.detect = function(map){
	var detector = new CircleDependencyDetector();
	detector.map = map;
	for(var key in map){
		if(detector.detectWithRequired(key, key)){
			return true;
		}
	}
}

var proto = {
	pushDependency: function(dependency){
		if(dependency==null)return this;
		this.init(dependency);
		if(this.detectWithRequired(this.key, dependency, "requiredBy")){
			return new Error("circle");
		}
		this.dependency.push(dependency);
		return this;
	},
	pushRequireBy: function(requiredBy){
		if(requiredBy==null)return this;
		this.init(requiredBy);
		if(this.detectWithRequired(this.key, requiredBy, "dependency")){
			return new Error("circle");
		}
		this.requiredBy.push(requiredBy);
		return this;
	},
	detectWithRequired: detectWithRequired
};

function detectWithRequired(key, searchKey, prop){
	var cur = this.get(key);
	var required = cur[prop];
	if(required && required.length){
		if(cur[prop].indexOf(searchKey)!=-1){
			return true;
		}
		for(var i=0, item, len=required.length; i<len; i++){
			item = required[i];
			if(this.detectWithRequired(item, searchKey, prop)){
				return true;
			}
		}
	}
	return false;
}

