> Added in version 3.5

## 1. 简介
### 1.1. 什么是类型提示/注解？
类型提示是对Python中变量，函数参数、返回值类型的注解，以增加代码的可读性。类型注解并不会影响代码的运行，也不会影响实际值，即变量的传值仍然可以是任意的。但是可以安装mypy库用于代码的静态分析，来判断代码是否满足类型注解，不满足则会报错。
### 1.2. 为什么使用类型提示？
Python中不要求函数参数、返回值与变量类型的标注，即不用像C/C++等静态语言预先声明变量的类型，函数参数、返回值的类型。这种特性使得Python编程变得非常灵活，但也导致了代码可读性变差。例如下面的代码：
``` python
def print_value(value):
	print(f"Value is {value}")

print_value('a')
print_value(1)
print_value(-1.11)

""" Output
Value is a
Value is 1
Value is -1.11
"""
```
### 1.3. 基础用法
#### 1.3.1. 声明参数类型与函数返回值
```python
def print_value(value:int)->float: # 声明传入参数的变量类型int与返回值的类型float
    return float(value)

print_value(1)

""" Output
1.0
"""
```
#### 1.3.2. 声明变量
```python
name: str # 声明为str,也可以输入其他值，并不会出错
name = ‘Lan’
```
#### 1.3.3. 类型检测
Python并不会对类型提示进行检测，但是提供了mypy库进行类型检测。mypy是一个可选的静态类型检查器，使用mypy运行脚本会按照类型注解的内容进行检测，不符合要求的会报错。
```shell
# 安装
pip install mypy
# 运行
mypy fileName.py
```
## 2. 类型别名
### 2.1. 是什么？
类型别名指新定义一个类型并为其取一个代号，如`type Vector = list[float]`，其中`Vector`为新定义的类型`list[float]`的别名。其适用于简化复杂的类型签名。
``` python
type Vector = list[float]

def scale(scalar: float, vector: Vector) -> Vector:
    return [scalar * num for num in vector]

# 通过类型检查；浮点数列表是合格的 Vector。
new_vector = scale(2.0, [1.0, -4.2, 5.4])
```
### 2.2. 如何定义？
``` python
# 1. type定义: type语句于Python 3.12中添加
type Vector = list[float]

# 2. 简单赋值: 为了Python能够向下兼容，也可使用简单赋值的方式来创建
Vector = list[float]

# 3. TypeAlias标记:  TypeAlias 标记来显式说明这是一个类型别名，而非一般的变量赋值
from typing import TypeAlias
Vector: TypeAlias = list[float]
```
## 3. NewType
### 3.1. 是什么？
`NewType` 用于创建几乎零运行时开销的简单唯一类型，也是一种类型注解，用于静态检测时的类型判断，普通运行时传值依然不受NewType类型的影响，可以随意传值。
静态类型检查器认为 `NewType(name, tp)` 是 `tp` 的一个子类型。在运行时，`NewType(name, tp)` 返回一个简单的虚拟函数，该函数简单地返回其参数。NewType函数定义如下所示: 
```python
def NewType(name, tp):

    def new_type(x):
        return x

    new_type.__name__ = name
    new_type.__supertype__ = tp
    return new_type
```
### 3.2. 有什么用？
- 强制类型别名：当你想要为某个类型创建一个明确的别名，以区分其在代码中的用途时。
- 类型检查：在静态类型检查工具（如 mypy）中，NewType 可以帮助识别类型错误，因为它会将新类型与原始类型区分开来。
- 代码清晰性：通过为特定用途创建新的类型，可以使代码更加清晰，易于理解。
### 3.3. 基本用法
```python
from typing import NewType

UserId = NewType('UserId', int)

def name_by_id(user_id: UserId) -> str:
	...

UserId('user')          # Fails type check

name_by_id(42)          # Fails type check
name_by_id(UserId(42))  # OK

num = UserId(5) + 1     # type: int
```
### 3.4. 注意事项
- NewType 创建的类型在运行时与原始类型是相同的，这意味着它们可以相互赋值，但是它们在类型检查时被视为不同的类型。
- NewType 并不适用于创建具有不同运行时行为的类型，它只是用于类型注解和类型检查。
- 在 Python 3.10 及更高版本中，可以使用 TypeAlias 来创建类型别名，这与 NewType 类似，但是更加灵活。
### 3.5. NewType与type
- 使用类型别名将声明两个类型是相互等价的。使用 type Alias = Original 将使静态类型检查器在任何情况下都把 Alias 视为与 Original 完全等价。 这在你想要简化复杂的类型签名时会很有用处。
- NewType 声明把一种类型当作另一种类型的 子类型。Derived = NewType('Derived', Original) 时，静态类型检查器把 Derived 当作 Original 的 子类 ，即，Original 类型的值不能用在预期 Derived 类型的位置。这种方式适用于以最小运行时成本防止逻辑错误。
## 4. 标注可调用对象(函数)
### 4.1. 简介
通过Callable对函数、方法或实现了 `__call__()` 方法的类的实例等可调用对象进行注解，注解参数列表和返回值。
### 4.2. 基本用法
- `Callable[[参数类型列表], 返回值类型]`。下标语法总是要刚好使用两个值：参数列表和返回类型。 参数列表必须是一个由类型组成的列表、ParamSpec、Concatenate 或省略号。 返回类型必须是单一类型。
```python
from collections.abc import Callable
def async_query(on_success: Callable[[int], None]) -> None:# Callable[[int], None] 表示接受一个int类型的单个形参并且返回值为None的一个函数。
```
- 如果将一个省略号字面值 ... 作为参数列表，则表示可以接受包含任意形参列表的可调用对象:
```python
def concat(x: str, y: str) -> str:
    return x + y

x: Callable[..., str]
x = str     # 可以
x = concat  # 同样可以
```
## 5. 泛型(Generic)
> Added in version 3.12
### 5.1. 简介
泛型（Generics）是一种支持类型参数化的方式，它允许你定义一个函数或类，使其能够接受不同类型的参数，并且保持这些参数的类型信息。泛型在很多编程语言中都有，比如 Java 和 C#，它们提供了一种方式来创建可以处理多种数据类型的代码，同时又能保持类型安全。
### 5.2. 基本用法
- 类
```python
from typing import Generic, TypeVar

# 定义一个类型变量 T，它将用于指定 Box 可以持有的数据类型
T = TypeVar('T')

# 定义一个泛型类 Box，它接受一个类型参数 T
class Box(Generic[T]):
    def __init__(self, value: T):
        self.value = value

    def get_value(self) -> T:
        return self.value

# 使用泛型类 Box
# 创建一个整数类型的 Box
int_box = Box[1]
print(int_box.get_value())  # 输出: 1

# 创建一个字符串类型的 Box
str_box = Box["Hello, World!"]
print(str_box.get_value())  # 输出: Hello, World!

# 创建一个浮点类型的 Box
float_box = Box[3.14]
print(float_box.get_value())  # 输出: 3.14
```
- 函数
```python
from typing import TypeVar

# 定义一个类型变量 T
T = TypeVar('T')

# 定义一个泛型函数
def identity(value: T) -> T:
    return value

# 使用泛型函数
print(identity(10))       # 输出: 10，类型为 int
print(identity("hello"))  # 输出: hello，类型为 str
print(identity(3.14))     # 输出: 3.14，类型为 float
print(identity([1, 2, 3])) # 输出: [1, 2, 3]，类型为 list
```
## 6. 常用标注
### 6.1. Any
> typing.Any

Any 是一种特殊的类型。静态类型检查器认为所有类型均与 Any 兼容，同样，Any 也与所有类型兼容。

### 6.2. Union
> typing.Union
1. 简介：联合类型； Union[X, Y] 等价于 X | Y ，意味着满足 X 或 Y 之一。
2. 用法：要定义一个联合类型，可以使用类似 Union[int, str] 或简写 int | str。
3. 注意事项:
	- 参数必须是某种类型，且至少有一个。
	- 联合类型之联合类型会被展平，例如：`Union[Union[int, str], float] == Union[int, str, float]`
	- 冗余的参数会被跳过，例如：`Union[int, str, int] == Union[int, str] == int | str`
	- 不可创建 Union 的子类或实例

### 6.3. Optional
> typing.Optional
1. 简介：表示可选的参数，Optional[X] 等价于 X | None （或 Union[X, None] ）
2. 用法：`value: Optional[int]`
3. 注意事项：可选类型与含默认值的可选参数不同。含默认值的可选参数不需要在类型注解上添加 Optional 限定符，因为它仅是可选的。例如：
```python
def foo(arg: int = 0) -> None:
    ...
```
### 6.4. Final
> typing.Final

特殊类型注解构造，用于向类型检查器表示最终名称。不能在任何作用域中重新分配最终名称。类作用域中声明的最终名称不能在子类中重写。
### 6.5. 常用类型
> typing
1. List
2. Dict
3. Set
4. Tuple
### 6.6. 常用容器
> collections.abc
1. Mapping
2. Sequence
## 7. 参考
[python 3.13.0 Docs](https://docs.python.org/zh-cn/3/library/typing.html#distinct)
