#### 1. 简介
在 PyTorch 中，`__constants__`是一个特殊的类属性，用于 TorchScript 中。当你将一个 nn.Module 的子类转换为 TorchScript 时，`__constants__` 属性告诉编译器这些指定的属性是不变的，即它们的值在模型的整个生命周期内都不会改变。例如在Pytorch的RNNBase源码中：
``` python
class RNNBase(Module):
    __constants__ = ['mode', 'input_size', 'hidden_size', 'num_layers', 'bias',  
                     'batch_first', 'dropout', 'bidirectional', 'proj_size']
    __jit_unused_properties__ = ['all_weights']

    mode: str  
    input_size: int  
    hidden_size: int  
    num_layers: int  
    bias: bool  
    batch_first: bool  
    dropout: float  
    bidirectional: bool  
    proj_size: int
```
`mode`、`input_size`、`hidden_size`、`num_layers`、`bias`、`batch_first`、`dropout`、`bidirectional` 和 `proj_size` 这些属性在模型被脚本化后，将被视为常量。TorchScript 编译器会知道这些属性在模型的前向传播过程中不会改变，因此可以对它们进行更激进的优化，例如内联（inlining）或者死码消除（dead code elimination）。 ^constant

在标准的 nn.Linear 模块定义中没有内置的常量。
#### 2. 技巧
##### 2.1. 用于可选的子模块
基本上，一些模块可以有可选的子模块（即子模块可以存在，也可以是 None）。当我们脚本化某个东西时，我们碰巧会先添加子模块，然后是常量，跳过任何已经存在于模块上的名称，所以它要么作为正常的子模块被添加（忽略 `__constants__` 中的条目），要么作为 None 常量被添加。如果编译器在 if 语句中看到一个 None 常量，它将跳过 if 内部代码的编译，这允许我们支持像 resnet 中的 downsample 这样的用法。所以如果你在 `__constants__` 中看到一个 nn.Module，它真正的含义就是 Optional[nn.Module]，我们只是用这种有点荒谬的方式来指定这一点。
##### 2.2. 删除`__constant__`属性并不影响模型
如果 JIT 知道某些值是恒定不变的，那么就可以对这些值进行更积极的优化和重新排序，相比之下，对于那些只是模型上普通属性的东西则没有这么多优化。所以当你移除 `__constants__` 或者 Final 类型注解时，模型的行为不应该改变，但是对于 JIT 来说，关于它能对你的代码做什么的信息就变少了。JIT 的类型系统将强制这些值不会被改变，这也可以使你的代码更加清晰。

#### 3. 参考
[Why do we use __constants__ (or Final)? - jit - PyTorch Forums](https://discuss.pytorch.org/t/why-do-we-use-constants-or-final/70331)
[TorchScript — PyTorch 2.5 documentation](https://pytorch.org/docs/stable/jit.html#frequently-asked-questions) (How do I store attributes on a [`ScriptModule`](https://pytorch.org/docs/stable/generated/torch.jit.ScriptModule.html#torch.jit.ScriptModule "torch.jit.ScriptModule")?)