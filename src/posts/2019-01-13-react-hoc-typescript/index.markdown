---
path: "/react-hoc-typescript"
date: "2019-01-13"
title: "React HOC with Typescript and Jest"
published: true
files:
 - "./hero.png"
tags: ["unit", "testing", "test", "react", "hoc", "hocs", "higher", "order", "components", "jest", "typescript", "ts", "async", "componentDidMount"]
---

React hocs with ts. This is my preferred way. Say you have a hoc called `withData.js` that wraps a component and shows
a loader and fetches some data on componentDidMount. It looks something like this:

#### withData.js
```jsx
import React, { Component } from 'react';

export default function withData(WrappedComponent, dataUrl) {
  return class extends Component {
    state = { isLoading: true, data: {} };

    fetchData = async url => {
      const response = await fetch(url);
      const data = await response.json();
      this.setState({ isLoading: false, data });
    };

    async componentDidMount() {
      await this.fetchData(dataUrl);
    }

    render() {
      const { isLoading, data } = this.state;
      return isLoading ? 'Loading' : 
        <WrappedComponent {...this.props} data={data} />;
    }
  };
}
```

#### withData.tsx
```typescript
import * as React from 'react';

export interface Post {
  userId?: number;
  id?: number;
  title?: string;
  body?: string;
}

export interface InjectedProps {
  data: Post;
}

interface HocState extends InjectedProps {
  isLoading: boolean;
}

export interface EnhancedComponent extends React.Component {
  fetchData(url: string): Promise<void>;
  componentDidMount(): Promise<void>;
}

function withData<P>(
    WrappedComponent: React.ComponentType<P & InjectedProps>, 
    dataUrl: string
) {
  return class extends React.Component<P, HocState> implements EnhancedComponent {
    readonly state: HocState = { isLoading: true, data: {} };

    fetchData = async (url: string) => {
      const response = await fetch(url);
      const data = (await response.json()) as Post;
      this.setState({ isLoading: false, data });
    };

    async componentDidMount() {
      await this.fetchData(dataUrl);
    }

    render() {
      const { isLoading, data } = this.state;
      return isLoading ? 'Loading' : 
        <WrappedComponent {...this.props} data={data} />;
    }
  };
}

export default withData;
```

Let's ignore everything else and look at the main method `withData` at line 23: 

```typescript{numberLines: 23}
function withData<P>(
    WrappedComponent: React.ComponentType<P & InjectedProps>, 
    dataUrl: string
)
```

`withData` becomes a generic function so we can use `<P>` to represent the wrapped component's props.

WrappedComponent is a ComponentType meaning it can be a class or a functional component.
It's props are represented by `<P & InjectedProps>`. This is an intersection type. In english this means
"I accept a set of props P, which are my own props and also extra props of type InjectedProps". These
extra props are injected by our HOC. Describing the props this way lets you render WrappedComponent 
like below:

```typescript{numberLines: 40}
    render() {
      const { isLoading, data } = this.state;
      return isLoading ? 'Loading' : 
        <WrappedComponent {...this.props} data={data} />; // highlight-line
    }
```

 
Next we return the hoc:

```typescript{numberLines: 27}
return class extends React.Component<P, HocState> implements EnhancedComponent {
    readonly state: HocState = { isLoading: true, data: {} };
    
```

`<P, HocState>` is standard ts saying our HOC has props type P and state type HocState.
But let's look at EnhancedComponent. Why do we need to implement EnhancedComponent? The answer is you don't have to. The
reason you might want to is because of testing. We'll talk about testing in depth
a bit later, but implementing this interface allows typescript to infer
the hoc's instance methods so you can access and invoke them.

Setting state to readonly is good practice so you don't accidentally mutate the reference to state. Using setState
is safe since that only mutates the properties of state, not state itself.

### Testing the Typescript HOC with Jest

We want to test that on componentDidMount, fetchData is called and the fetched response 
is passed down to the wrapped component as props. The test looks like below:

```typescript
 test('componentDidMount fetches data and renders data', async () => {
   const Enhanced = withData(App, mockFetchUrl);
   const component = shallow(<Enhanced />, { disableLifecycleMethods: true });
   const instance = component.instance() as EnhancedComponent;
   await instance.componentDidMount();

   expect(fetch.mock.calls.length).toEqual(1);
   expect(fetch.mock.calls[0][0]).toEqual(mockFetchUrl);
   expect(component).toMatchSnapshot();
 });
```

I use enzyme for shallow rendering and jest-fetch-mock to mock fetch. To test async componentDidMount, 
I set `disableLifecycleMethods` to true (line 3). This is so I can invoke componentDidMount manually and await for it. 
We need to wait for fetchData and then mounting to complete before running assertions.

On line 3, shallow rendering returns our hoc but its instance type is a React Component. You can't await componentDidMount on a 
standard React Component because it is not async. So this is where `EnhancedComponent` saves the day.   
 
```typescript{numberLines: 18}
export interface EnhancedComponent extends React.Component { // highlight-line
  fetchData(url: string): Promise<void>;
  componentDidMount(): Promise<void>;
}
```

On line 4 in our test, we use type assertion to tell Typescript that our instance is actually of type `EnhancedComponent` 
and has an async componentDidMount and fetchData methods. Note that async methods in Typescript must have a return 
type of `Promise<return-type>`.

Now we can invoke componentDidMount manually and await for it. The three assertions ensure that fetchData is invoked once
with the correct url and that the fetched data is passed to the wrapped component as props.

### Example project with universal-hot-reload in Typescript

All the code in this blog are available on [github](https://github.com/yusinto/typescript-hoc). This is a fully functional
react router spa with server side rendering and hot reload courtesy of [universal hot reload](https://github.com/yusinto/universal-hot-reload).

Have fun coding!


---------------------------------------------------------------------------------------
