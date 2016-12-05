# circle-dependency-detector
Detect circle dependency anywhere

## Usage
```js
var detector = CircleDependencyDetector();
var dependency = detector.init(file);
var ret = dependency.pushRequireBy(parent);
if(ret instanceof Error){
  throw ret;
}
dependency.pushDependency(dep);
```
