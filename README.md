# circle-dependency-detector
Detect circle dependency anywhere

## Usage
```js
var detector = CircleDependencyDetector();
var moduleA = detector.init(yourIdentifier);
var ret = moduleA.pushRequireBy(parent);
if(ret instanceof Error){
  throw ret;
}
moduleA.pushDependency(dep);
console.log(moduleA.dependency); // => output all the dependencies of moduleA
console.log(moduleA.requiredBy); // => output all modules that had been required moduleA
console.log(moduleA.get()); // => output the full map of detector
```
