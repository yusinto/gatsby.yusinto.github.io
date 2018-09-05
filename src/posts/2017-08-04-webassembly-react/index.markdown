---
path: "/webassembly-react"
date: "2017-08-04"
title: "WebAssembly and React"
published: true
tags: ["webAssembly", "react", "wasm", "web", "assembly", "javascript", "c", "c++", "emscripten"]
---
WebAssembly is the next big thing. So they say. Who knows. All I know is
that it's fast and it can make my app goes faster, like native fast. So
naturally I am interested.

I looked around for a quick guide to get WebAssembly up and running in
node, express and react but couldn't find one. So I decided to do it myself.

Let's begin!

## Goal
Run a C function from a .wasm file in a react component.

## Step 1: Install emscripten
Emscripten compiles C/C++ code to web assembly. Given a C file,
emscripten produces a .wasm and a .js file.

.wasm is a binary file. You can't easily
import .wasm files directly into js ([yet!](https://medium.com/webpack/webpack-awarded-125-000-from-moss-program-f63eeaaf4e15)) so 
emscripten also produces a js file which acts as a proxy. You add a 
script reference to this file in your html so you can use wasm in your 
js app. They call this js file the "glue" code. Personally I prefer to call
it proxy code.

Here are the steps to install emscripten:

* Download [emscripten portable](https://s3.amazonaws.com/mozilla-games/emscripten/releases/emsdk-portable.tar.gz)
* Unzip and cd into the dir and execute these:

```bash
./emsdk update
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh
```

* Add the emcc executable to your /etc/paths file. Mine is
located at /your_download_dir/emsdk-portable/emscripten/1.37.16

## Step 2: Write C code
Create a file called utils.c under your src folder.

#### utils.c
```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <emscripten/emscripten.h>

int main(int argc, char ** argv) {
    // gets translated to console.log
    printf("WebAssembly successfully loaded!\n");
}

// Emscripten does dead code elimination during compilation.
// This decorator ensures our code does not get removed.
EMSCRIPTEN_KEEPALIVE
int generateRandom() {
    srand ( time(NULL) );
    return rand();
}
```


## Step 3: Compile your C code

```bash
emcc utils.c -s WASM=1 -o utils.js -O3
```

* -s Specify settings which gets passed down to the emscripten compiler. Here
we specify we want to compile to wasm. The default is asm. This will
produce utils.wasm.

* -o Specify the filename for the glue code. This will produce utils.js.

* -O3 The first character is the upper case letter 'O' not zero! Sets the optimisation
level for your wasm and js files. You can check the various optimisation levels
[here](https://kripken.github.io/emscripten-site/docs/tools_reference/emcc.html#emcc-o0).

## Step 4: Add the glue code to your html

```html
<!DOCTYPE html>
<html>
     <head>
        <title>Hasta la vista JS!</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        <div id="reactDiv"/>
        <script src="/dist/utils.js"></script>
        <script src="/dist/bundle.js"></script>
      </body>
</html>
```

## Step 5: Add an express route to serve wasm files

Express does not serve .wasm files by default so we have to add a custom route.

#### server.js
```js
app.get('/:filename.wasm', (req, res) => {
  const wasmFilePath = path.resolve(__dirname, 
    `../../dist/${req.params.filename}.wasm`);
  
  console.log(`Wasm request ${wasmFilePath}`);

  fs.readFile(wasmFilePath, (err, data) => {
    const errorMessage = `Error ${wasmFilePath} not found. ${JSON.stringify(err)}`;
    if (err) {
      console.log(errorMessage);
      res.status(404).send(errorMessage);
      return;
    }
    res.send(data);
  });
});
```

## Step 6: Call wasm from React!

Finally! You can now use your C function from React by prefixing an underscore
in front of the C function's name. We included the glue code in our app html, so
all your C methods are exposed globally. This is not the best way, but 
in the future, webpack will rescue us. There is [wip](https://medium.com/webpack/webpack-awarded-125-000-from-moss-program-f63eeaaf4e15)
right now sponsored by Mozilla to develop first class support for WebAssembly in webpack. 
This means we'll be able to import C/C++ files directly in js files and
call wasm functions directly! 

Till that day arrives, a global script tag will have to do for now.

#### app.js
```jsx
export default class App extends Component {
    state = {randomNumber: -1};
    
    onClickGenerateRandom = () => {
      // EUREKA! Call our C function with an underscore prefix!
      // All the methods in utils.c are exposed globally because utils.js
      // is included as a script tag in our html.
      const randomNumber = _generateRandom();
      console.log(`onClickGenerateRandom: ${randomNumber}`);
      this.setState({randomNumber});
    }; 
      
    render() {
      return (
        <div>
          <button onClick={this.onClickGenerateRandom}>
            Generate random
          </button>
          {this.state.randomNumber}
        </div>
      );
    }
}
```

## Conclusion
The next step is to help Sean Larkin and co to get webpack support WebAssembly!

The complete code is [here](https://github.com/yusinto/wasm-playground)
as usual. Start learning C/C++. Enjoy!

---------------------------------------------------------------------------------------
