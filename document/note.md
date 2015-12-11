#使用流程
- 先注册，或者自定义节点的样式到jmEditor.js中
- 然后注册节点类型到jmEditor.components中，需要加上之前定义的样式

#主要变量
- jmEditor.components 中放所有的节点类型，比如开始，结束，等等
- jmEditor.styles 放各个节点的样式
- 图像操作在jmEditor.graph中

#注意事项
- 节点的命名不能有下换线_.因为处理点击监听的事件，用了split('_')

#自定义节点的工作流程
- 先在src/shapes中写一个自定义节点，然后第二步骤
- jmGraph.js , jmGraph.min.js, jmGraph.debug.js中需要注册类型