[TOC]

## 1. 基础知识
### 1.1. 什么是函数？
函数是编程中的一种封装机制，用于将可复用的代码块打包成独立的、可调用的单元。例如，数学函数 $f(x) = x^2 + 1$可以通过Python函数实现，以计算不同$x$值的结果：
```python
# 计算 f(x) = x^2 + 1 的结果
print(1**2 + 1)  # 输出 2
print(2**2 + 1)  # 输出 5
print(3**2 + 1)  # 输出 10
```
上述方法每次输出都有一个重复的部分，只有$x$的值在变化，因此可以将重复使用的部分提取出来，抽象为函数：
```python
def f(x):
    return x**2 + 1

# 使用函数计算并输出结果
print(f(1))  # 输出 2
print(f(2))  # 输出 5
print(f(3))  # 输出 10
```
### 1.2. 函数定义
在Python中，函数通过`def`关键字定义，包括函数名、参数列表、函数体和返回值。以下是函数定义的基本格式：
```python
def function_name(parameters):
    """
    函数的文档字符串，用于描述函数的功能和参数。

    参数:
    parameters : type
        参数描述。
    """
    # 函数体开始
    # 执行的代码，包括对参数的处理
    return expression  # 返回值，如果函数有返回值的话
```
- `function_name` 是函数的名称，应遵循Python命名规范。
- `parameters`是函数的参数列表，可以包括位置参数、关键字参数、默认参数等。
- 文档字符串（docstring）是函数的第一条语句(且是字符串语句)，用于描述函数的目的、参数和返回值。用文档字符串可以自动生成在线文档或打印版文档，还可以让开发者在浏览代码时直接查阅文档；Python 开发者最好养成在代码中加入文档字符串的好习惯。
- 函数体包含具体的执行代码，可以包含多条语句。
- `return` 语句用于返回函数的结果，不是所有函数都需要返回值。
### 1.3. 参数
函数参数可以是位置参数、关键字参数、默认参数、可变数量的位置参数和可变数量的关键字参数。
#### 1.3.1. 位置参数
位置参数是根据函数定义时的顺序传入的参数，调用函数时提供的参数必须与函数定义中的参数数量和顺序相匹配。
``` python
def f(x): # 此处x为一个位置参数
	return x + 1

f(1) #  此处调用函数传入一个参数1与定义的时候相对应
```
如果调用函数时没有提供必需的位置参数，或者提供的参数数量不正确，Python解释器将抛出TypeError。
```python
f()  # 报错：TypeError: f() missing 1 required positional argument: 'x'
f(1, 2) #报错：TypeError: f() takes 1 positional argument but 2 were given
```
#### 1.3.2. 默认值参数
指定参数的默认值是Python中常用的一种功能，它允许函数在被调用时更加灵活地处理参数。当函数定义时，可以为一个或多个参数指定默认值。如果调用函数时没有提供这些参数的值，将自动使用默认值。**在调用函数时，必须先提供位置参数，然后才是默认参数。**
```python
def f(x, n = 1, b = 1):
	return x**n + b

# 不提供默认值参数
f(2) # 3

# 提供1/2个默认值参数
f(2, 2) # x = 2, n = 2, b = 1, f(2, 2) = 5
f(2, 0, 3) # 4

# 选择性修改参数
f(2, b = 2) # 4
```
- 默认值只计算一次。默认值为列表、字典或类实例等可变对象时，会产生与该规则不同的结果。例如，下面的函数会累积后续调用时传递的参数：
```python
def f(a, L=[]):
    L.append(a)
    return L

print(f(1))
print(f(2))
print(f(3))

""" Output
[1]
[1, 2]
[1, 2, 3]
"""
```
- 不想在后续调用之间共享默认值时，应以如下方式编写函数：
```python
def f(a, L=None):
    if L is None:
        L = []
    L.append(a)
    return L
```
#### 1.3.3. 关键字参数
关键字参数是函数调用时使用的一种参数，它允许你明确指定每个参数值对应的参数名。这使得函数调用更加清晰，尤其是当函数有多个参数时，它也允许在调用函数时不按参数定义的顺序传递参数值。
```python
def point(x , y = 0):
	return f"({x}, {y})"

point(y = 1, x = 2) # '(2, 1)' , 此时的x和y都是关键字参数

# 错误使用
point(0, x=1) # 同一个参数重复的赋值
point(y=2, 0) # 关键字参数后存在非关键字参数
point(z = 3) # 未知参数
```

#### 1.3.4. 参数位置
在参数列表中，`/`和`*`可以用来划分参数，`/`之前只能存在位置参数，`*`之后只能存在关键字参数。
```python
# 
def f(pos1, pos2, /, pos_or_kwd, *, kwd1, kwd2):
"""
		  -----------      ----------            ----------
			|                   |                          |
			|                   位置或关键字       |
			|                                              - 仅限关键字
			 -- 仅限位置
"""
```
例如：
```python
def standard_arg(arg):
    print(arg)

def pos_only_arg(arg, /):
    print(arg)

def kwd_only_arg(*, arg):
    print(arg)

def combined_example(pos_only, /, standard, *, kwd_only):
    print(pos_only, standard, kwd_only)
```
- `standard_arg` 函数接受一个参数，可以是位置参数或关键字参数。
- `pos_only_arg` 函数接受一个位置参数，只能以位置参数的形式传入。
- `kwd_only_arg `函数接受一个仅限关键字参数，必须以关键字参数的形式传入。
- `combined_example` 函数展示了位置参数、普通参数和仅限关键字参数的组合使用。
#### 1.3.5. 可变参数
可变参数提供了一种灵活的方式来定义函数，允许函数接受任意数量的参数。这包括任意数量的位置参数（使用星号*）和任意数量的关键字参数（使用双星号**）。
##### 1.3.5.1. 可变位置参数`(*args)`
使用星号`*`定义的参数可以收集任意数量的位置参数到一个元组中。
```python
def make_pizza(*toppings):
    print(toppings)
make_pizza("pepperoni")
make_pizza("mushrooms", "green peppers", "extra cheese")

"""Output
('pepperoni',)
('mushrooms', 'green peppers', 'extra cheese')
"""
```
##### 1.3.5.2. 可变关键字参数`(**kwargs)`
使用双星号`**`定义的参数可以收集任意数量的关键字参数到一个字典中。
```python
def build_profile(first_name, last_name, **user_info):
    user_info["first_name"] = first_name
    user_info["last_name"] = last_name
    print(user_info)
build_profile("John", "Doe", age=45, city="New York")

"""Output
{'age': 45, 'city': 'New York', 'first_name': 'John', 'last_name': 'Doe'}
"""
```
##### 1.3.5.3. 注意事项
- 在使用可变参数时，`*args`必须放在所有位置参数之后，`**kwargs`必须放在所有参数之后。
#### 1.3.6. 参数解包
参数解包是Python中的一种特性，它允许将序列（如列表或元组）中的元素解包为函数调用的位置参数，或者将字典中的键值对解包为函数调用的关键字参数。
##### 1.3.6.1. 位置参数解包
使用星号`（*）`操作符，可以将一个序列（通常是列表或元组）中的元素解包为位置参数。
- 例1
```python
list(range(3, 6))            # 附带两个参数的正常调用
#[3, 4, 5]
args = [3, 6]
list(range(*args))            # 附带从一个列表解包的参数的调用
# [3, 4, 5]
```
- 例2：传入参数的时候没有使用`*`，把`args`当作一个参数传入。
```python
def f(*ps):
	print("ps:", ps)
	print("*ps:", *ps)
	print(type(ps))
	print(type(*ps))
	
args = [1, 2, 3]
f(args)  # 传入参数的时候没有使用*，把args当作一个参数传入

"""Output
ps: ([1, 2, 3],)
*ps: [1, 2, 3]
<class 'tuple'>
<class 'list'>
"""
```
- 例3：传入参数的时候使用`*`，把`args`当作多个参数传入。
```python
def f(*ps):
	print("ps:", ps)
	print("*ps:", *ps)
	
args = [1, 2, 3]
f(*args) # 传入参数的时候使用*

"""Output
ps: (1, 2, 3)
*ps: 1 2 3
<class 'tuple'>

"""
```
##### 1.3.6.2. 关键字参数解包
使用双星号`**`操作符，你可以将一个字典中的键值对解包为关键字参数。
```python
def f(**ps):
	print("ps:", ps)

dicts = {'a':1, "b":2}
f(**dicts) # ps: {'a': 1, 'b': 2}
```

### 1.4. 返回值
函数可以通过return语句返回一个值给调用者。如果函数中没有return语句或者return语句后面没有指定值，则函数默认返回None。[return语句](https://blog.csdn.net/Dash4664/article/details/143449680)用于从一个函数返回值，并终止该函数的执行。当 return 语句被执行时，函数立即结束，并将控制权返回给调用者。
- 返回一个值
```python
def add(a, b):
    return a + b

result = add(3, 4)  # result 现在是 7
print(result)  # 输出: 7
```
- 返回多个值，实际上是返回一个元组。
```python
def get_user_info():
    return "Alice", 30, "New York"

name, age, city = get_user_info()
print(name, age, city)  # 输出: Alice 30 New York
```
[[Python-语句#^return]]

### 1.5. 文档字符串
文档字符串（docstring）是紧跟在函数定义之后的字符串字面量，用于描述函数的功能、参数和返回值。文档字符串是Python中的一种约定，用于提供关于函数的文档。
- 基本用法
```python
def add(a, b):
    """
    返回两个数的和。

    参数:
    a (int): 第一个加数。
    b (int): 第二个加数。

    返回:
    int: 两个数的和。
    """
    return a + b
```
- 访问文档字符串
```python
print(add.__doc__)
```
- 格式约定
	- 第一行应为对象用途的简短摘要。为保持简洁，不要在这里显式说明对象名或类型，因为可通过其他方式获取这些信息（除非该名称碰巧是描述函数操作的动词）。这一行应以大写字母开头，以句点结尾。
	- 文档字符串为多行时，第二行应为空白行，在视觉上将摘要与其余描述分开。后面的行可包含若干段落，描述对象的调用约定、副作用等。
	- Python 解析器不会删除 Python 中多行字符串字面值的缩进，因此，文档处理工具应在必要时删除缩进。这项操作遵循以下约定：文档字符串第一行 之后 的第一个非空行决定了整个文档字符串的缩进量（第一行通常与字符串开头的引号相邻，其缩进在字符串中并不明显，因此，不能用第一行的缩进），然后，删除字符串中所有行开头处与此缩进“等价”的空白符。不能有比此缩进更少的行，但如果出现了缩进更少的行，应删除这些行的所有前导空白符。转化制表符后（通常为 8 个空格），应测试空白符的等效性。
```python
def my_function():
    """Do nothing, but document it.

    No, really, it doesn't do anything.
    """
    pass

print(my_function.__doc__)

"""Output
Do nothing, but document it.

    No, really, it doesn't do anything.
"""
```
## 2. 高阶函数
函数名可以看作一个变量，函数也可以像其他对象一样被传递和返回。高阶函数指的是能够接受函数作为参数、能够返回一个函数、或者同时具备这两种能力的函数。
### 2.1. 返回函数
```python
def greater_than(n):
    """返回一个函数，该函数检查另一个数是否大于n。"""
    def compare(x):
        return x > n
    return compare

# 使用返回的函数
gt10 = greater_than(10) # 此时gt10是一个函数
print(gt10(11))  # 输出: True
print(gt10(9))   # 输出: False
```
### 2.2. 传入函数
```python
def apply_to_elements(collection, func):
    """将函数func应用于集合中的每个元素，并返回结果列表。"""
    return [func(x) for x in collection]

# 定义一个函数作为参数
def square(x):
    return x * x

# 调用apply_to_elements，传递square函数
results = apply_to_elements([1, 2, 3, 4], square)
print(results)  # 输出: [1, 4, 9, 16]
```
### 2.3. 应用场景
- 装饰器：Python中的装饰器是高阶函数的一个典型应用。装饰器函数接受一个函数作为参数，并返回一个新的函数，这个新函数在执行原有函数之前或之后添加了一些额外的行为。
```python
def my_decorator(func):
    def wrapper():
        print("Something is happening before the function is called.")
        func()
        print("Something is happening after the function is called.")
    return wrapper

@my_decorator
def my_function():
    print("Hello, World!")

my_function()P
```
- 函数工厂：高阶函数可以作为函数工厂，根据给定的参数动态生成新的函数。
```python
def greater_than(n):
    def compare(x):
        return x > n
    return compare

gt10 = greater_than(10)
print(gt10(11))  # 输出: True
```
- 映射和遍历：高阶函数可以用于对集合中的每个元素应用某个函数，如map()和filter()。
```python
def square(x):
    return x * x

numbers = [1, 2, 3, 4]
squared = map(square, numbers)
print(list(squared))  # 输出: [1, 4, 9, 16]
```

## 3. 函数注解
Python 3.5后支持函数注解，它允许你为函数参数和返回值指定类型(只是一种注解，仍然可以随意传值，运行不会检查)。详见[类型注解](https://blog.csdn.net/Dash4664/article/details/143393623)
```python
def add(a: int, b: int) -> int:
    return a + b
```
[[Typing库：类型提示(Type Hint)#^function]]

## 4. 递归函数
递归函数是一种自己调用自己的函数。递归函数通常用于解决那些可以分解为相似子问题的问题，如树的遍历、排序算法（如快速排序和归并排序）等。
```python
def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n - 1)

# 计算 5 的阶乘
print(factorial(5))  # 输出: 120
```
## 5. 函数嵌套
函数可以定义在其他函数内部，称为嵌套函数。嵌套函数可以访问外部函数的变量，但外部函数不能访问嵌套函数的变量。
## 6. 匿名函数
在Python中，匿名函数是一种没有名称的函数，它们通常用于编写简单的、一次性使用的函数。匿名函数通过 lambda 关键字定义，并且通常用在需要函数对象的地方，例如在 map()、filter()、sorted() 等函数中。
### 6.1. 定义
Python中的语法规则如下所示：
```python
lambda_expr ::=  "lambda" [parameter_list] ":" expression
```
### 6.2. 用例
- 例1
```python
# 定义一个匿名函数，计算两个数的和
add = lambda x, y: x + y

# 使用匿名函数
result = add(3, 4)
print(result)  # 输出: 7
```
- 例2
```python
pairs = [(1, 'one'), (2, 'two'), (3, 'three'), (4, 'four')]
pairs.sort(key=lambda pair: pair[1])
pairs #[(4, 'four'), (1, 'one'), (3, 'three'), (2, 'two')]
```
## 7. 装饰器
装饰器是一种设计模式，用于在不修改原有函数代码的情况下，给函数增加额外的功能。装饰器本质上是一个函数，它接收一个函数作为参数并返回一个新的函数。
### 7.1. 基本结构
```python
def decorator_function(original_function):
    def wrapper_function(*args, **kwargs):
        # 在原函数执行前做一些事
        result = original_function(*args, **kwargs)
        # 在原函数执行后做一些事
        return result
    return wrapper_function
```
decorator_function 是一个装饰器，它接收一个函数 original_function 作为参数，并返回一个新的函数 wrapper_function。wrapper_function 可以访问 original_function，并在调用它前后添加一些额外的操作。
### 7.2. 装饰器使用
使用装饰器非常简单，只需要在函数定义之前加上` @ `符号和装饰器的名称即可：
```python
@decorator_function
def my_function():
    print("Hello, World!")
```
等价于:
```python
my_function = decorator_function(my_function)
```
### 7.3. 实例
```python
def my_decorator(func):
    def wrapper():
        print("Something is happening before the function is called.")
        func()
        print("Something is happening after the function is called.")
    return wrapper

@my_decorator
def my_function():
    print("Hello, World!")

my_function()

"""Output
Something is happening before the function is called.
Hello, World!
Something is happening after the function is called.
"""
```
### 7.4. 应用场景
- 日志记录：装饰器可以用来记录函数的调用情况，包括调用时间、参数值等。
```python
import functools

def log_decorator(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__} with args {args} and kwargs {kwargs}")
        result = func(*args, **kwargs)
        print(f"{func.__name__} returned {result}")
        return result
    return wrapper

@log_decorator
def add(a, b):
    return a + b

add(2, 3)

"""Output
Calling add with args (2, 3) and kwargs {}
add returned 5
5
"""
```
- 权限检查：装饰器可以用于检查用户是否有权限执行某个操作。
```python
def permission_required(permission):
    def decorator(func):
        def wrapper(*args, **kwargs):
            if not user_has_permission(permission):
                raise Exception("Permission denied")
            return func(*args, **kwargs)
        return wrapper
    return decorator
```
- 缓存结果：装饰器可以实现缓存机制，避免重复计算。
```python
def memoize(func):
    cache = {}
    def wrapper(*args):
        if args in cache:
            return cache[args]
        result = func(*args)
        cache[args] = result
        return result
    return wrapper
```
### 7.5. 注意事项
- 当一个函数有多个装饰器时，装饰器的执行顺序是从下到上的。
- 装饰器也可以接受参数，这就需要创建一个返回装饰器的函数。
- 使用 `functools.wraps`：`functools.wraps` 可以用来保留原函数的元数据，如函数名、文档字符串等。
## 8. 常用系统函数
### 8.1. `range()`
用于生成一个不可变的数字序列。
- 基本用法
```python
class range(stop)
class range(start, stop[, step])
```
range 构造器的参数必须为整数（可以是内置的 int 或任何实现了 `__index__() `特殊方法的对象）。 如果省略 step 参数，则默认为 1。 如果省略 start 参数，则默认为 0。 如果 step 为零，则会引发 ValueError。
- 用例
```python
list(range(10))
# [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
list(range(1, 11))
# [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
list(range(0, 30, 5))
# [0, 5, 10, 15, 20, 25]
list(range(0, 10, 3))
# [0, 3, 6, 9]
list(range(0, -10, -1))
# [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
list(range(0))
# []
list(range(1, 0))
# []
```
### 8.2. `zip()`
用于将多个可迭代对象中对应的元素打包成一个元组，然后返回由这些元组组成的对象。
- 基本用法
```python
zip(*iterables, strict=False)
```
- 用例1
```python
numbers = [1, 2, 3]
letters = ['a', 'b', 'c']
zipped = zip(numbers, letters)  # 生成<zip object>
print(list(zipped))  # 输出: [(1, 'a'), (2, 'b'), (3, 'c')]
```
- 用例2
```python
for item in zip([1, 2, 3], ['sugar', 'spice', 'everything nice']):
    print(item)

"""Output
(1, 'sugar')
(2, 'spice')
(3, 'everything nice')
"""
```
- 小技巧
	- 可确保迭代器的求值顺序是从左到右的。这样就能用` zip(*[iter(s)]*n, strict=True)` 将数据列表按长度 n 进行分组。这将重复相同的迭代器 n 次，输出的每个元组都包含 n 次调用迭代器的结果。这样做的效果是把输入拆分为长度为 n 的块。
	- zip() 与 * 运算符相结合可以用来拆解一个列表:
```python
x = [1, 2, 3]
y = [4, 5, 6]
list(zip(x, y))
# [(1, 4), (2, 5), (3, 6)]
x2, y2 = zip(*zip(x, y))
x == list(x2) and y == list(y2)
# True
```
### 8.3. `sorted()`
用于返回一个列表的排序副本。
- 基本用法
```python
sorted(iterable, /, *, key=None, reverse=False)
"""
iterable: 需要排序的可迭代对象。
key : 一个函数，用于从可迭代对象中提取比较键值。
reverse: 布尔值，用于指定是否降序排序，默认为False。
"""
```
- 用例
```python
numbers = [3, 1, 4, 1, 5, 9, 2]
sorted_numbers = sorted(numbers)  # 默认升序排序
print(sorted_numbers)  # 输出: [1, 1, 2, 3, 4, 5, 9]

sorted_numbers_desc = sorted(numbers, reverse=True)  # 降序排序
print(sorted_numbers_desc)  # 输出: [9, 5, 4, 3, 2, 1, 1]

```
### 8.4. `filter()`
用于过滤序列，过滤掉不符合条件的元素，返回一个迭代器。
- 基本用法
```python
filter(function, iterable)
"""
function：用于判断元素是否应该被包含在结果中的函数。
iterable：需要过滤的可迭代对象。
"""
```
- 用例
```python
numbers = [1, 2, 3, 4, 5]
even_numbers = filter(lambda x: x % 2 == 0, numbers)  # 过滤出偶数
print(list(even_numbers))  # 输出: [2, 4]
```
### 8.5. `map()`
用于将一个函数应用于可迭代对象的每个元素。
- 基本用法
```python
map(function, iterable, *iterables)
"""
function：应用于每个元素的函数。
iterable：可迭代对象。
"""
```
- 用例
```python
numbers = [1, 2, 3, 4]
squared = map(lambda x: x ** 2, numbers)  # 每个元素求平方
print(list(squared))  # 输出: [1, 4, 9, 16]
```
### 8.6. `enumerate()`
用于将一个可迭代对象组合为一个索引序列，同时列出数据和数据下标。
- 基本用法
```python
enumerate(iterable, start=0)
"""
iterable：需要添加索引的可迭代对象。
start：索引起始值，默认为0。
"""
```
- 用例
```python
items = ['a', 'b', 'c']
for index, value in enumerate(items):
    print(index, value)  # 输出: 0 a, 1 b, 2 c
```
### 8.7. `exec()`
于执行存储在字符串或对象中的Python代码。(可能会导致安全问题)
- 基本用法
```python
exec(source, /, globals=None, locals=None, *, closure=None)
"""
code：包含Python代码的字符串或代码对象。
globals：字典，用于定义代码执行的全局环境。
locals：字典，用于定义代码执行的局部环境。
"""
```
- 用例
```python
code = 'print("Hello, World!")'
exec(code)  # 输出: Hello, World!
```
### 8.8. `eval()`
用于计算存储在字符串或代码对象中的有效Python表达式，并返回表达式的值。(可能会导致安全问题)
- 基本用法
```python
eval(source, /, globals=None, locals=None)
"""
expression：包含Python表达式的字符串或代码对象。
globals：字典，用于定义表达式计算的全局环境。
locals：字典，用于定义表达式计算的局部环境。
"""
```
- 用例
```python
result = eval('1 + 2')
print(result)  # 输出: 3
```
## 9. 参考
[Python3.13.0](https://docs.python.org/zh-cn/3/tutorial/controlflow.html#arbitrary-argument-lists)
[Python 标准库](https://docs.python.org/zh-cn/3/library/index.html#library-index)