增删改查组件
======
### 1.简介
组件依赖于dva-odoo进行模型扩展，如果需要连接mock，可依赖dva-odoomock。  
组件主要依赖于react和antd以及dva。  
可以随时修改高阶函数的静态函数以及dva对应model改变其用途。  
可以同时应对编辑和添加。
### 2.API
#### 2.1 form组件
**list**: *Array*。弹出表单的配置项。 数组的每一项都对应表单的每一行。每一行的配置都由label(*String*)标签名、input(*Object*)输入框类型，以及该行输出值对应的属性名attribute(*String*)。  
  
**addTitle**：*String*。添加新项目时表头标题。 

**editTitle**：*String*。编辑项目时表头标题。  

**visible**：*Boolean*。控制表单是否可见。  

**edit**：*Object*。编辑项目时表单需要显示信息组成的对象，应当和list添加的属性保持一致。  

**onOk**：*function*。点击确认按钮触发的函数。参数为表单所有的输出键值对组成的类似edit的对象。  

**onCancel**：*function*。点击取消按钮触发的函数。  
#### 2.2 Table函数
高阶函数，为传入的组件添加增删改查函数以及控制表单显示的公用函数，具体的函数用途可以查看函数体。要访问这些函数，请访问组件的props。
#### 2.3 tableForm组件
为了提取统一化需求，用form组件和table函数组装的列表，可满足基本需求。  
**columns**：*Array*。与蚂蚁金服antd框架中的columns基本一致，不同之处在于操作中的render函数。在操作这一栏中，添加了edit(*Boolean*)属性，控制是否显示删除、编辑两项操作。而render函数中添加了第三参数context，用于绑定this的上下文。  

**list**：*Array*。与form组件一致。  

**model**：*String*。dva中的模型名，以便于调用相应的reducer或者effect。  

**formAddTitle**：*String*。表单添加项目时的标题。  

**formEditTitle**：*String*。表单编辑项目时标题。  

**addTitle**：*String*。添加按钮的文字。  

*注意：由于dva的connect函数要注入model，所以在应用tableForm组件时，应把自定义组件的props全部传给tableForm组件*






