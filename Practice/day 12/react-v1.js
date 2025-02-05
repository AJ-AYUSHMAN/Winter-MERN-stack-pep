const parent = document.getElementById("dom-root");
const root = ReactDOM.createRoot(parent);

const newTitle = React.createElement("h2", {}, "Hello from REAL React!"); // single child --> text
const newPara = React.createElement("p", {}, "Lorem ipsum delor..."); // single child --> text
const container = React.createElement("div", {}, [newTitle, newPara]); // children --> array of react elements

const newli = React.createElement("li", {}, "item no. 1");
const newli2 = React.createElement("li", {}, "item no. 2");
const newUl = React.createElement("ul", {}, [newli, newli2, container]);

root.render(newUl);
// root.render(container);