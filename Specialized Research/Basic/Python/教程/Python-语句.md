> 基础语句与符合语句

[TOC]
## 1. 基础语句

### 1.1. 表达式语句
表达式语句用于计算和写入值（大多是在交互模式下），或者（通常情况）调用一个过程 (过程就是不返回有意义结果的函数；在 Python 中，过程的返回值为 None)。 表达式语句的其他使用方式也是允许且有特定用处的。详细见[[表达式]]一节。
### 1.2. 赋值语句
赋值语句用于将名称（重）绑定到特定值，以及修改属性或可变对象的成员项。
- 基本赋值：`x = 10`
- 多变量赋值：`x = y = z = 10`
- 序列解包赋值：`x, y, z = (1, 2, 3)`。这行代码将元组 (1, 2, 3) 中的值分别赋给变量 x、y 和 z。这要求元组中的元素数量与变量的数量相匹配。
- 条件表达式赋值：在Python 3.8，引入了海象运算符，允许你在条件表达式中直接赋值。海象运算符其符号为`:=`。
```python
if (n := len(a)) > 10:
#:= 运算符将 len(a) 的结果赋值给变量 n，并且这个值被用在后续的条件判断中.
    print(f"List is too long ({n} elements, expected <= 10)")
```
### 1.3. `break/continue/pass`语句
#### 1.3.1. `break`
break 语句将跳出最近的一层 for 或 while 循环:
```python
for n in range(2, 10):
    for x in range(2, n):
        if n % x == 0:
            print(f"{n} equals {x} * {n//x}")
            break
```
#### 1.3.2. `continue`
continue 语句将跳出当前迭代，继续执行循环的下一次迭代:
```python
for num in range(2, 10):
    if num % 2 == 0:
        print(f"Found an even number {num}")
        continue
    print(f"Found an odd number {num}")
```
#### 1.3.3. `pass`语句
pass 语句不执行任何动作。语法上需要一个语句，但程序毋需执行任何动作时，可以使用该语句。例如：
```python
while True:
    pass  # 无限等待键盘中断 (Ctrl+C)
```
### 1.4. `import`语句
Python中`import`的语法规则如下所示：
```python
import_stmt     ::=  "import" module ["as" identifier] ("," module ["as" identifier])*
                     | "from" relative_module "import" identifier ["as" identifier]
                     ("," identifier ["as" identifier])*
                     | "from" relative_module "import" "(" identifier ["as" identifier]
                     ("," identifier ["as" identifier])* [","] ")"
                     | "from" relative_module "import" "*"
module          ::=  (identifier ".")* identifier
relative_module ::=  "."* module | "."+
```
- `import module`：导入module包
- `from module import package`：从module模块导入package包
- `from module import *`：导入模块所有内容
- `import module as m/form module import package as p`：设置别名
模块导入成功后使用规则：
- 模块名后使用 as 时，直接把 as 后的名称与导入模块绑定。
- 如果没有指定其他名称，且被导入的模块为最高层级模块，则模块的名称将被绑定到局部命名空间作为对所导入模块的引用。
- 如果被导入的模块不是最高层级模块，则包含该模块的最高层级包的名称将被绑定到局部命名空间作为对该最高层级包的引用。 所导入的模块必须使用其完整限定名称来访问而不能直接访问。
```python
import foo                 # foo 被导入并且被局部绑定
import foo.bar.baz         # foo, foo.bar 和 foo.bar.baz 被导入，foo 被局部绑定
import foo.bar.baz as fbb  # foo, foo.bar 和 foo.bar.baz 被导入，foo.bar.baz 被绑定为 fbb
from foo.bar import baz    # foo, foo.bar 和 foo.bar.baz 被导入，foo.bar.baz 被绑定为 baz
from foo import attr       # foo 被导入并且 foo.attr 被绑定为 attr
```
### 1.5. `del`语句
del 语句用于删除对象。它可以删除列表、元组、集合或字典中的元素，也可以删除整个变量。del 语句是一个非常直接的操作，它实际上移除了对象的引用，使得对象可以被Python的垃圾回收机制回收。用法为`del 待删除的对象`。
```python
#删除变量
var1 = 1
var2 = 2

# 删除1个变量
# del var1
# 同时删除多个变量
del var1, var2

try:
    print(var1)
except NameError as e:
    print(e)  # 输出: name 'var1' is not defined

try:
    print(var2)
except NameError as e:
    print(e)  # 输出: name 'var2' is not defined
```
### 1.6. `assert/raise`语句
assert 和 raise 是两个用于错误处理和调试的关键字。
#### 1.6.1. `assert`
assert 语句用于断言某个条件是真的。如果条件为真，则程序继续执行；如果条件为假，则程序抛出 AssertionError 异常。
```python
def divide(a, b):
    assert b != 0, "除数不能为零"
    return a / b

print(divide(2, 0))

"""Output
AssertionError                            Traceback (most recent call last)
Cell In[2], line 1
----> 1 print(divide(2, 0))

Cell In[1], line 2
      1 def divide(a, b):
----> 2     assert b!=0, "除数不能为0"
      3     return a/b

AssertionError: 除数不能为0
"""
```
#### 1.6.2. `raise`
raise 语句用于手动抛出一个异常。
- 在这个例子中，如果 b 为零，raise 语句将抛出 ValueError 异常，并显示错误信息 "除数不能为零"。
```python
def divide(a, b):
    if b == 0:
        raise ValueError("除数不能为零")
    return a / b
```
- raise 也可以不带任何参数，或者仅带一个异常实例，用于重新抛出当前异常。
```python
try:
    # 某些操作
    pass
except SomeException as e:
    process(e)
    raise  # 重新抛出当前捕获的异常
```
- raise 可以与自定义异常类一起使用，抛出自定义异常。
```python
class MyError(Exception):
    pass

def my_function():
    raise MyError("发生了一个错误")
```
### 1.7. `return/yield`语句
#### 1.7.1. `return`
return 语句用于从一个函数返回一个值，并终止该函数的执行。当 return 语句被执行时，函数立即结束，并将控制权返回给调用者
- 返回一个值
```python
def add(a, b):
    return a + b

result = add(3, 4)
print(result)  # 输出: 7
```
- 返回一个元组
```python
def get_user_info():
    return "Alice", 30, "New York" #函数返回多个值，实际上是返回一个元组。

name, age, city = get_user_info() # type(get_user_info()) = tuple
print(name, age, city)  # 输出: Alice 30 New York
```
- 无返回值: 如果函数没有明确的 return 语句，或者 return 语句后面没有值，那么函数默认返回 None。
#### 1.7.2. `yield`
- yield 语句用于在一个函数中返回一个值，并且能够在下一次调用时恢复执行，而不是从头开始执行。这个特性使得 yield 成为创建生成器（generator）的关键。
- 当一个函数包含 yield 语句时，它就不再是一个普通函数，而变成了一个生成器函数。调用生成器函数会返回一个生成器对象，而不是直接执行函数体。
```python
def counter(max): # 在这个例子中，counter 函数是一个生成器函数，它会产生从 1 到 max 的整数。
    n = 1
    while n <= max:
        yield n
        n += 1

counter_gen = counter(3) # type(counter(3)) = generator
for num in counter_gen:
    print(num)  # 输出: 1, 2, 3
```
### 1.8. `global/nonlocal`语句
#### 1.8.1. `global`
global 语句用于在函数内部声明变量为全局变量，这意味着它们属于最外层的作用域，而不是函数的局部作用域。
```python
x = 'global variable'

def my_function():
    global x
    print(x)  # 输出: global variable
    x = 'modified global variable'
    print(x)  # 输出: modified global variable

my_function()
print(x)  # 输出: modified global variable
```
- PS：在 global 语句中列出的名称不能被定义为形式参数，也不能被作为 with 语句或 except 子句的目标，以及 for 循环的目标列表、class 定义、函数定义、import 语句或变量标注等等。
#### 1.8.2. `nonlocal`
nonlocal 语句用于在嵌套函数中声明变量为非局部变量，即修改函数作用域从当前函数到外层函数。
```python
def outer_function():
    x = 'nonlocal variable'

    def inner_function():
        nonlocal x
        print(x)  # 输出: nonlocal variable
        x = 'modified nonlocal variable'
        print(x)  # 输出: modified nonlocal variable

    inner_function()
    print(x)  # 输出: modified nonlocal variable

outer_function()
```
- 在这个例子中，inner 函数中的 nonlocal x 声明告诉 Python，变量 x 不是 inner 函数的局部变量，而是应该在封闭的外层函数 outer 的作用域中查找。因此，inner 函数中对 x 的修改也会影响到 outer 函数中的 x。如果没有 nonlocal 声明，Python 会将 x 视为 inner 函数的局部变量，并在 inner 函数中创建一个新的局部变量 x，而不是修改 outer 函数中的 x。
### 1.9. `type`语句
type 语句声明一个[类型别名](https://blog.csdn.net/Dash4664/article/details/143393623)，即 typing.TypeAliasType 的实例。基本语法如下所示：
`type Vector = list[float]`
![[Typing库：类型提示(Type Hint)#^type]]

## 2. 复合语句
- 复合语句是包含其它语句（语句组）的语句；它们会以某种方式影响或控制所包含其它语句的执行。 通常，复合语句会跨越多行，虽然在某些简单形式下整个复合语句也可能包含于一行之内。
- `if`, `while` 和 `for` 语句用来实现传统的控制流程构造。 `try` 语句为一组语句指定异常处理和/和清理代码，而 `with` 语句允许在一个代码块周围执行初始化和终结化代码。
- 函数和类定义在语法上也属于复合语句。
- 下面每个语句的说明中给出了对应语句的语法规则，以下为规则说明：
	- 规则使用了巴科斯-诺尔范式（BNF），这是一种用于描述编程语言语法的上下文无关文法。
	- `::=`是一个用来定义语法规则的符号，表示“被定义为”。
	- 终结符是文法中的基本符号，它们不能再被分解或展开成更简单的符号。在编程语言的上下文中，终结符可以是关键字、标识符、字面量（如数字和字符串）、运算符等。
	- 非终结符是文法中的占位符，它们可以被展开或替换成终结符和其他非终结符的序列。在编程语言的上下文中，非终结符通常代表语法结构，如表达式、语句、块等。
- 总结：
```python
compound_stmt ::=  if_stmt
                   | while_stmt
                   | for_stmt
                   | try_stmt
                   | with_stmt
                   | match_stmt
                   | funcdef
                   | classdef
                   | async_with_stmt
                   | async_for_stmt
                   | async_funcdef
suite         ::=  stmt_list NEWLINE | NEWLINE INDENT statement+ DEDENT
statement     ::=  stmt_list NEWLINE | compound_stmt
stmt_list     ::=  simple_stmt (";" simple_stmt)* [";"]

"""
if_stmt：条件语句（if）
while_stmt：循环语句（while）
for_stmt：循环语句（for）
try_stmt：异常处理语句（try）
with_stmt：上下文管理语句（with）
match_stmt：模式匹配语句（match）
funcdef：函数定义（def）
classdef：类定义（class）
async_with_stmt：异步上下文管理语句
async_for_stmt：异步循环语句
async_funcdef：异步函数定义
"""
```

### 2.1. 判断语句(`if`)
#### 2.1.1. 说明
Python中`if`语句的语法规则定义如下：
```python
if_stmt ::=  "if" assignment_expression ":" suite
             ("elif" assignment_expression ":" suite)*
             ["else" ":" suite]
```
- `if_stmt ::= "if" assignment_expression ":" suite`
	- if_stmt 是这个规则的非终结符，代表一个完整的if语句。
	- "if" 是一个终结符，表示if语句的关键字。
	- assignment_expression 是一个非终结符，代表一个赋值表达式，它将被评估以确定if语句的条件。
	- ":" 是一个终结符，表示if语句的开始。
	- suite 是一个非终结符，代表一组语句，这些语句将在条件为真时执行。
- `("elif" assignment_expression ":" suite)*`
	- 这个部分是一个重复的子句，表示elif（else if）块可以有零个或多个。
	- `elif`是关键字，用于指定另一个条件。
	- assignment_expression 和 ":" 的含义与if部分相同。
	- suite 表示与elif条件相匹配时将执行的语句组。
	* `*`表示前面的模式可以重复零次或多次。
- `["else" ":" suite]`
	- 这个部分是可选的，表示else块可以有也可以没有。
	- "else" 是else关键字，用于指定当所有if和elif条件都不满足时执行的代码块。
	- ":" 和 suite 的含义与if部分相同。
	- [] 表示else块是可选的，可以出现零次或一次。
#### 2.1.2. 用例
```python
x = int(input("Please enter an integer: "))

if x < 0 : # if 判断条件: (不要遗漏 ‘：’ )
	print("-")
elif x == 0 : # 可以有零个或者多个elif部分
	print("0")
elif x == 1 :
	print("1")
else : # else可以有，也可以没有，但是从程序规范来看有else会更规范
	print("More")
```
### 2.2. 循环语句
#### 2.2.1. `for`语句
##### 2.2.1.1. 说明
Python中`for`语句的语法规则定义如下：
```python
for_stmt ::=  "for" target_list "in" starred_list ":" suite
              ["else" ":" suite]
```
- `for_stmt` 是一个非终结符，代表一个完整的for循环语句。
- `for` 是一个终结符，表示for循环语句的关键字。
- `target_list` 是一个非终结符，代表循环中的目标列表，可以是一个或多个变量，这些变量将被用来接收`starred_list`中迭代的值。
- `in` 是一个终结符，是for循环中用于指定迭代范围的关键字。
- `starred_list `是一个非终结符，代表被迭代的对象，可以是一个表达式或者一个可迭代对象，如列表、元组、字典、集合等。这个对象中的每个元素都将被逐一赋值给`target_list`中的变量。
- `:` 是一个终结符，用于分隔循环头部和循环体。
- `suite` 是一个非终结符，代表一组语句，这些语句将在每次迭代时执行。
- `["else" ":" suite]` 是一个可选部分，表示else子句及其对应的语句组。如果提供了else子句，当for循环正常结束后（即不是因为break语句而结束），将执行else子句中的语句。
- Python 的 for 语句不迭代算术递增数值（如 Pascal），或是给予用户定义迭代步骤和结束条件的能力（如 C），而是按它们在序列中出现的顺序，在列表或字符串等任意序列的元素上迭代。
##### 2.2.1.2. 用例
1. 列表循环
```python
words = ['cat', 'window', 'defenestrate']
for w in words:
    print(w, len(w))

""" Output
cat 3
window 6
defenestrate 12
"""
```
2. `range()`函数
```python
for i in range(3): # 内置函数 range() 用于生成等差数列
    print(i)

""" Output
0
1
2
"""
```
3. 多变量
```python
for i,j in range(10): 
    print(i,j)

"""
range(10) 每次迭代只产生一个整数，因此无法同时赋值给两个变量 i 和 j。如果你想要同时迭代两个值，你需要使用 zip 函数或者其他可以产生元组的迭代器。
"""

""" Output
TypeError                                 Traceback (most recent call last)
Cell In[1], line 1
----> 1 for i,j in range(10):
      2     print(i,j)

TypeError: cannot unpack non-iterable int object
"""
```

```python
for i, j in zip(range(3), range(3)): #zip 函数会将两个（或多个）可迭代对象中对应的元素打包成一个个元组，然后返回由这些元组组成的迭代器。
    print(i, j)

""" Output
0 0
1 1
2 2
"""
```
4. else语句
```python
for i in range(5):
    print(i)
else:
    print("T")

""" Output
0
1
2
3
4
T
"""
```

```python
# break跳出循环，将不会执行else语句
for i in range(5):
    if i>2:
        break
    print(i)
else:
    print("T")
""" Output
0
1
2
"""
```
``
```python
# continue跳过循环，会执行else语句
for i in range(5):
    if i>2:
        break
    print(i)
else:
    print("T")
""" Output
0
1
2
T
"""
```
#### 2.2.2. `while`语句
##### 2.2.2.1. 说明
Python中`while`语句的语法规则定义如下：
```python
while_stmt ::=  "while" assignment_expression ":" suite
                ["else" ":" suite]
```
- 重复地检验表达式`assignment_expression`，如果其值为真就执行第一个子句体；如果表达式值为假（这可能在第一次检验时就发生）则如果 else 子句体存在就会被执行并终止循环。
- 第一个子句体中的 break 语句在执行时将终止循环且不执行 else 子句体。 第一个子句体中的 continue 语句在执行时将跳过子句体中的剩余部分，并返回检验表达式。
##### 2.2.2.2. 用例
```python
a = 1
while a < 3:
	print(a)
	a += 1

""" Output
1
2
"""
```
### 2.3. `try`语句
`try`语句可为一组语句指定异常处理器和/或清理代码。
#### 2.3.1. 说明
Python中`try`语句的语法规则定义如下：
```python
try_stmt  ::=  try1_stmt | try2_stmt | try3_stmt
try1_stmt ::=  "try" ":" suite
               ("except" [expression ["as" identifier]] ":" suite)+
               ["else" ":" suite]
               ["finally" ":" suite]
try2_stmt ::=  "try" ":" suite
               ("except" "*" expression ["as" identifier] ":" suite)+
               ["else" ":" suite]
               ["finally" ":" suite]
try3_stmt ::=  "try" ":" suite
               "finally" ":" suite
```
- `try_stmt ::= try1_stmt | try2_stmt | try3_stmt：`
	- try_stmt 是一个非终结符，代表一个完整的try语句。
	- try1_stmt、try2_stmt 和 try3_stmt 是非终结符，代表try语句的三种不同形式。
- `try1_stmt ::= "try" ":" suite ("except" [expression ["as" identifier]] ":" suite)+ ["else" ":" suite] ["finally" ":" suite]：`
	- "try"：try关键字，开始一个try块；suite：一组语句，构成try块的主体。；"except"：except关键字，开始一个异常处理块。；expression：一个表达式，用于指定要捕获的异常类型。
	- `["as" identifier]`：可选的as关键字和一个标识符，用于给捕获的异常对象指定一个变量名。异常必须被赋值给一个不同的名称才能在 except 子句之后引用它。
	- `+`：表示前面的模式`（"except" [expression ["as" identifier]] ":" suite）`可以出现一次或多次，即可以有多个except块。
- `try2_stmt ::= "try" ":" suite ("except" "*" expression ["as" identifier] ":" suite)+ ["else" ":" suite] ["finally" ":" suite]：`
	- 这个规则与try1_stmt类似，但是使用`except *`来捕获所有异常，而不是特定的异常类型。
	- `except*` 子句必须有一个匹配的表达式；它不可为` except*:`。 并且，该表达式不可包括异常组类型，因为这将导致模糊的语义。
	- 在同一个 try 中不可以混用 except 和 except*。 break, continue 和 return 不可以在 except* 子句中出现。
- `try3_stmt ::= "try" ":" suite "finally" ":" suite：`
	- 这个规则定义了一个只有try和finally块的try语句，没有except块。
	- "finally"：finally关键字，开始一个finally块，这个块总是会执行，无论是否发生异常。
- `["finally" ":" suite]：`可选的"finally"块，无论是否发生异常，都会执行
- `["else" ":" suite]：`可选的"else"块，仅当try块没有引发异常时执行。
#### 2.3.2. 用例
1. `try1`
```python
try:
    # 尝试执行的代码
    result = 10 / 0
except ZeroDivisionError:
    # 处理除零异常
    print("Division by zero is not allowed.")
else:
    # 如果没有异常发生，则执行
    print("Division successful, result is:", result)

# 输出：Division by zero is not allowed.
# 若result = 10/2，则输出：Division successful, result is:5
```

```python
try:
    # 尝试执行的代码
    result = 10 / 0
except ZeroDivisionError as e:
    # 处理除零异常
    print("An error occurred:", e)
finally:
    # 无论是否发生异常，都会执行
    print("This will always be executed.")

""" Output
An error occurred: division by zero
This will always be executed.
"""
```

```python
# 多个异常处理
try:
    # 尝试执行的代码
    value = int("not a number")
except ValueError:
    # 处理值错误
    print("Cannot convert to integer.")
except Exception as e:
    # 处理其他异常
    print("An unexpected error occurred:", e)
```
2. `try2`: 捕获所有异常
```python
try:
    # 尝试执行的代码
    result = 10 / 0
except *:
    # 捕获所有异常
    print("An error occurred.")
```
在这个例子中，try块中的代码引发了一个ZeroDivisionError异常，except *块捕获所有异常，并打印一条错误消息。注意：在Python 3.8及以上版本中，except *是一个有效的语法，用于捕获所有异常。在Python 3.8之前的版本中，你需要使用except:来捕获所有异常。
3. `try3`
```python
try:
    # 尝试执行的代码
    print("Trying to perform an operation...")
    result = 10 / 0  # 这里会抛出一个异常
finally:
    # 无论是否发生异常，都会执行
    print("This will always be executed.")
```
在这个例子中，try 块中的代码尝试除以零，这将引发一个 ZeroDivisionError 异常。但是，不管是否发生异常，finally 块都会执行，打印出 "This will always be executed."。
### 2.4. `with`语句
with 语句用于包裹执行一个代码块，这个代码块中的资源会被自动管理。它主要用来确保代码块执行完毕后，资源（如文件或网络连接）能够被正确且及时地清理，即使在代码块中发生异常也是如此。这种机制被称为上下文管理。
#### 2.4.1. 说明
Python中`with`语句的语法规则定义如下：
```python
with_stmt          ::=  "with" ( "(" with_stmt_contents ","? ")" | with_stmt_contents ) ":" suite
with_stmt_contents ::=  with_item ("," with_item)*
with_item          ::=  expression ["as" target]
```
- with_stmt_contents 是一个非终结符，代表 with 语句中管理资源的表达式列表。
- "(" with_stmt_contents ","? ")"：这是一个可选的子句，表示 with 语句可以包含一个括号包裹的资源管理器列表，列表中的最后一个资源管理器后面可以有一个可选的逗号。
- "," with_item：表示资源管理器列表中可以有多个资源管理器。
- `*`：表示前面的模式（"," with_item）可以重复零次或多次，即资源管理器列表可以有一个或多个资源管理器。
- `["as" target]`：这是一个可选的子句，表示可以使用 as 关键字将资源管理器的结果（如文件对象）赋值给一个变量（target）。
#### 2.4.2. 用例
```python
# 单个资源管理器
with open("file.txt", "r") as file:
    contents = file.read()

# 多个资源管理器
with open("file1.txt", "r") as file1, open("file2.txt", "w") as file2:
    contents1 = file1.read()
    file2.write(contents1)

# 使用括号包裹多个资源管理器
with (open("file1.txt", "r") as file1, open("file2.txt", "w") as file2):
    contents1 = file1.read()
    file2.write(contents1)
```
### 2.5. ``match`语句
> Added in version 3.10

简要说明
#### 2.5.1. 说明
Python中`try`语句的语法规则定义如下：
```python
match_stmt   ::=  'match' subject_expr ":" NEWLINE INDENT case_block+ DEDENT
subject_expr ::=  star_named_expression "," star_named_expressions?
                  | named_expression
case_block   ::=  'case' patterns [guard] ":" block
```
match 语句接受一个表达式并把它的值与一个或多个 case 块给出的一系列模式进行比较。这表面上像 C、Java 或 JavaScript（以及许多其他程序设计语言）中的 switch 语句，但其实它更像 Rust 或 Haskell 中的模式匹配。只有第一个匹配的模式会被执行，并且它还可以提取值的组成部分（序列的元素或对象的属性）赋给变量。
- 基本语法
```Python
match subject:
    case pattern1:
        # 代码块1
    case pattern2:
        # 代码块2
    # ...
    case patternN:
        # 代码块N
```
- 模式匹配：match 语句支持多种模式，包括但不限于：
	- 具体的值（如 1, "hello"）
	- 变量（如 x，如果 subject 匹配 x，则 x 将被赋值为 subject 的值）
	- 守卫（guards），使用 if 表达式来进一步过滤模式
	- 类型模式（如 int，str），匹配特定类型的值
	- 序列模式（如 [x, y]），匹配序列中的元素
	- 映射模式（如 {"a": x, "b": y}），匹配字典中的键值对
	- 组合模式（如 x | y），匹配 x 或 y 中的任意一个模式
- 模式匹配失败：如果没有任何一个 case 匹配成功，程序会抛出 ValueError 异常
#### 2.5.2. 用例
```python
def match_example(value):
    match value:
        case 1:
            print("Value is 1")
        case 2 | 3 | 4:
            print("Value is 2, 3, or 4")
        case str():
            print("Value is a string")
        case [x, y] if x < y:
            print(f"List with first element {x} and second element {y}")
        case {"a": x, "b": y}:
            print(f"Dictionary with a={x} and b={y}")
        case _:
            print("No match found")

# 测试 match_example 函数
match_example(3)  # 输出: Value is 2, 3, or 4
match_example("hello")  # 输出: Value is a string
match_example([1, 2])  # 输出: List with first element 1 and second element 2
match_example({"a": 1, "b": 2})  # 输出: Dictionary with a=1 and b=2
match_example(5)  # 输出: No match found
```
### 2.6. 函数定义
[[函数]]
### 2.7. 类定义
[[Python-面向对象]]

## 3. 参考
1. [简单语句](https://docs.python.org/zh-cn/3/reference/simple_stmts.html#pass)
2. [复合语句](https://docs.python.org/zh-cn/3/reference/compound_stmts.html#match)
3. [python教程](https://docs.python.org/zh-cn/3/tutorial/controlflow.html#break-and-continue-statements)


