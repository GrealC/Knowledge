在编写代码时，我们通常会将可重用的代码段封装成[函数](https://blog.csdn.net/Dash4664/article/details/143470372)，这样做可以提高代码的复用性，并减少重复代码。然而，在大型项目中，我们往往会遇到许多需要在不同地方复用的模块或功能，这些模块的代码量通常较大，且分散在不同的文件或目录中。为了便于管理和调用这些分散的代码，我们引入了模块和包的概念。
[TOC]
## 1. 模块
### 1.1. 定义
模块是将相关功能封装在一个文件中的基本单位，一个.py文件就是一个模块，文件名就是模块名。模块可以定义函数、类和变量，也可以包含可执行的代码。
### 1.2. 使用
#### 1.2.1. 创建
创建模块非常简单，只需要创建一个.py文件，并在其中定义函数、类和变量即可。例如，创建一个名为math_operations.py的文件，内容如下：
```python
# math_operations.py

def add(x, y):
    """Add two numbers and return the result."""
    return x + y

def subtract(x, y):
    """Subtract two numbers and return the result."""
    return x - y
```
#### 1.2.2. 导入与调用
在Python中，可以使用[import语句](https://blog.csdn.net/Dash4664/article/details/143449680)[[Python-语句]]来导入模块。导入模块后，可以访问模块中定义的函数、类和变量。
- `import module`：导入整个模块。
```python
import math_operations

print(math_operations.add(3,2)) # 5
print(math_operations.subtract(3,2)) # 1
```
- `from module import msub`：从module模块导入特定内容。
```python
from math_operations import add

print(add(3,2)) # 5
print(subtract(3,2)) # NameError: name 'subtract' is not defined
```
- `from module import *`：导入模块所有内容。
```python
from math_operations import *

#
print(add(3,2)) # 5
print(subtract(3,2)) # 1
```
- import module as m/form module import package as p：设置别名
```python
import math_operations as m

#
print(m.add(3,2)) # 5
print(m.subtract(3,2)) # 1
```
- 模块的重新加载：如果你修改了模块的代码并希望立即反映这些更改，可以使用importlib.reload()重新加载模块。这在开发过程中非常有用，特别是当你在调试或测试代码时，需要频繁地修改模块文件并立即看到修改后的效果。
```python
import importlib
"""
importlib模块是Python 3中用于导入的标准库模块，它提供了一个reload()函数，可以用来重新加载模块。
"""
import math_operations

# 修改math_operations模块的代码后, 重新加载math模块
importlib.reload(math_operations)
```
### 1.3. 模块的搜索路径
Python解释器会在特定的路径中搜索模块，这些路径存储在相关的变量中。
#### 1.3.1. 搜索路径变量
Python模块的搜索路径存储在`sys.path`变量中，这是一个字符串列表。列表中的每个元素都代表一个目录，Python解释器会依次在这些目录中查找被导入的模块。
- 查看和添加搜索路径
```python
import sys

# 查看当前的模块搜索路径
print(sys.path)

# 添加一个新的路径到模块搜索路径
sys.path.append('/path/to/your/module')
```
- 如果Python解释器在这些路径中找到了匹配的模块文件（.py文件），它就会加载该模块。如果没有找到，解释器会抛出ModuleNotFoundError异常。
#### 1.3.2. 默认搜索路径
sys.path默认包含以下路径：
- 空字符串：代表当前目录。。
- site-packages目录：这是Python包的标准安装位置，通常位于Python安装目录下的lib/pythonX.X/site-packages（其中X.X是Python的版本号）。
- PYTHONPATH环境变量：如果设置了PYTHONPATH环境变量，那么这个变量中的路径也会被添加到sys.path中。
- 安装时指定的其他路径：在安装Python时，可能会指定其他路径，这些路径也会被添加到sys.path中。

### 1.4. 模块的私有变量与函数
在Python中，私有变量和函数的命名约定是使用单下划线_或双下划线__前缀。
#### 1.4.1. 单下划线前缀`_`
使用单下划线前缀的变量或函数被视为模块内部使用的私有成员。这是一种约定，表明这些成员不应该被外部直接访问。类对象和子类可以访问。
```python
# math_operations.py
def _private_function():
    print("This is a private function")

_private_function()  # 内部使用
_private_num = 1 # 内部使用
```
#### 1.4.2. 双下划线前缀`__`
使用双下划线前缀的变量或函数会触发名称改写（name mangling）机制。Python解释器会将这些成员的名称改写为__module__.var_name，其中module是模块名。这种改写使得外部代码无法直接通过原始名称访问这些成员，从而提供了一种保护机制。
```python
# math_operations.py
def __private_function():
    print("This is a private function")

__private_function()  # 内部使用
__private_num = 1 # 内部使用
```
### 1.5. `__name__`属性
`__name__`是一个内置变量，用于标识模块是被直接运行还是被导入到另一个模块中。
#### 1.5.1. 工作原理
- 运行一个Python文件时，Python解释器会自动将这个文件视为一个模块，并为这个模块创建一个命名空间。在这个命名空间中，`__name__`变量被自动设置为`__main__`。
- 导入模块的时候，`__name__`变量被设置为模块的名字。
#### 1.5.2. 使用场景
用以区分哪些代码是直接运行的时候执行，哪些代码是导入的时候执行。
```python
# math_operations.py

def add(x, y):
    """Add two numbers and return the result."""
    return x + y

def subtract(x, y):
    """Subtract two numbers and return the result."""
    return x - y
	
if __name__ == '__main__':
    print("This module is being run directly.")
    print(add(3,2))
else:
	print(subtract(3,2))
```
- 直接运行`math_operations.py`：
```cmd
This module is being run directly.
5
```
- 在`test.py`导入为模块，运行`test.py`:
```python
# test.py
import math_operations # print(subtract(3,2))  - >  输入：1
```
## 2. 包
### 2.1. 定义
包是一种将模块组织在一起的方式。一个包可以包含多个模块，也可以包含子包（即其他包）。
```cmd
mypackage/
│
├── __init__.py          # 标识该目录为Python包的初始化文件
├── module1.py           # 包内的一个模块
├── module2.py           # 包内的另一个模块
└── subpackage/          # 子包，即包内的包
    ├── __init__.py      # 子包的初始化文件
    └── submodule1.py     # 子包内的一个模块
```
### 2.2. 使用
#### 2.2.1. 创建
创建一个包非常简单，只需要创建一个包含`__init__.py`文件的目录即可。`__init__.py`文件可以为空，但它必须存在于包的目录中，以标识该目录为一个Python包。
#### 2.2.2. 导入与调用
- 导入模块后的使用与上面模块的调用相同。
```python
# 导入包中的模块
import mypackage.module1

# 导入包中的子包中的模块
import mypackage.subpackage.submodule1

# 使用包中的模块
mypackage.module1.some_function()

# 使用包中的子包中的模块
mypackage.subpackage.submodule1.some_function()

```
- 包内导入(相对导入)：在包内部，可以使用相对导入来导入同一包中的其他模块或子包。相对导入使用点号（.）表示当前包，两个点号（..）表示上级包。
```python
# 在mypackage/module1.py中导入mypackage/module2.py
from . import module2

# 在mypackage/subpackage/submodule1.py中导入mypackage/module1.py
from .. import module1
```
### 2.3. 包的搜索
包的搜索路径与模块的搜索路径类似，但包必须包含__init__.py文件。
### 2.4. `__init__.py`
`__init__`.py文件是包的初始化文件，它可以用来执行包级别的初始化代码，例如：
- 定义包级别的变量和函数
- 导入包内部的模块，使得它们可以直接从包中访问，而不需要指定模块名
控制包的命名空间，例如：
```python
# mypackage/__init__.py
from .module1 import some_function
from .subpackage import submodule1
```
在文件中导入包后，可以直接访问：
```python
# test.py
import mypackage
mypackage.some_function()  # 直接访问module1中的some_function
mypackage.submodule1.some_function()  # 直接访问subpackage中的submodule1
```
### 2.5. `__name__`属性
在包中，`__name__`属性的行为略有不同。当导入一个包时，包的`__init__.py`文件中的`__name__`将被设置为包的全路径名。例如，如果有一个名为mypackage的包，其中包含一个名为module1.py的模块，那么`mypackage.__name__`将会是`mypackage`，`mypackage.module1.__name__`将会是`mypackage.module1`。