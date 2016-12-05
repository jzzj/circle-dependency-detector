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
	detectWithRequiredBy: detectWithRequiredBy
};

//module.exports = CircleDependencyDetector;

CircleDependencyDetector.detect = function(map){
	var detector = new CircleDependencyDetector();
	detector.map = map;
	for(var key in map){
		if(detector.detectWithRequiredBy(key, key)){
			return true;
		}
	}
}

var proto = {
	pushDependency: function(dependency){
		if(dependency==null)return this;
		this.init(dependency);
		if(this.detectWithRequiredBy(this.key, dependency)){
			return new Error("circle");
		}
		this.dependency.push(dependency);
		return this;
	},
	pushRequireBy: function(requiredBy){
		if(requiredBy==null)return this;
		this.init(requiredBy);
		if(this.detectWithRequiredBy(this.key, requiredBy)){
			return new Error("circle");
		}
		this.requiredBy.push(requiredBy);
		return this;
	},
	detectWithRequiredBy: detectWithRequiredBy
};

function detectWithRequiredBy(key, searchKey){
	var cur = this.get(key).requiredBy;
	while(cur && cur.length){
		if(cur.indexOf(searchKey)!=-1){
			return true;
		}
		for(var item of cur){
			if(this.detectWithRequiredBy(item, key)){
				return true;
			}
		}
		cur = cur.requiredBy;
	}
	return false;
}
