> Pytorch中的RNNBase 与 RNN类的学习

## 1. RNNBase
实现了RNN、LSTM、GRU一些公共的基础方法。
### 1.1. 基本参数
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

- `__constant__`属性的使用：![[Pytorch中的__constants__#^constant]]
- `__jit_unused_properties__` 属性用于指定在 TorchScript 中不会被使用的 Python 属性，这可以帮助编译器进一步优化代码，因为这些属性不会影响模型的执行。

### 1.2. 方法
#### 1.2.1. `__init__()`
> 构造函数（`__init__`方法）的定义，用于初始化一个类的实例。
##### 1.2.1.1. 片段1
> 完成基本参数的初始化
``` python
def __init__(self, mode: str, input_size: int, hidden_size: int,
                 num_layers: int = 1, bias: bool = True, batch_first: bool = False,
                 dropout: float = 0., bidirectional: bool = False, proj_size: int = 0,
                 device=None, dtype=None) -> None:
                 
        factory_kwargs = {'device': device, 'dtype': dtype}
        super().__init__()
        
        self.mode = mode
        self.input_size = input_size
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        self.bias = bias
        self.batch_first = batch_first
        self.dropout = float(dropout)
        self.bidirectional = bidirectional
        self.proj_size = proj_size     
        self._flat_weight_refs: List[Optional[weakref.ReferenceType[Parameter]]] = []
        num_directions = 2 if bidirectional else 1
```
-  `factory_kwargs`：用于指定计算设备（如CPU或GPU）和数据类型，这是深度学习编程中常见的做法
- `super().__init__()`
- `self.dropout = float(dropout)`
- `self._flat_weight_refs: List[Optional[weakref.ReferenceType[Parameter]]] = []
- `num_directions = 2 if bidirectional else 1`
        
##### 1.2.1.2. 片段2
``` python
        if not isinstance(dropout, numbers.Number) or not 0 <= dropout <= 1 or \
                isinstance(dropout, bool):
            raise ValueError("dropout should be a number in range [0, 1] "
                             "representing the probability of an element being "
                             "zeroed")
        if dropout > 0 and num_layers == 1:
            warnings.warn("dropout option adds dropout after all but last "
                          "recurrent layer, so non-zero dropout expects "
                          f"num_layers greater than 1, but got dropout={dropout} and "
                          f"num_layers={num_layers}")

        if not isinstance(hidden_size, int):
            raise TypeError(f"hidden_size should be of type int, got: {type(hidden_size).__name__}")
        if hidden_size <= 0:
            raise ValueError("hidden_size must be greater than zero")
        if num_layers <= 0:
            raise ValueError("num_layers must be greater than zero")
        if proj_size < 0:
            raise ValueError("proj_size should be a positive integer or zero to disable projections")
        if proj_size >= hidden_size:
            raise ValueError("proj_size has to be smaller than hidden_size")

        if mode == 'LSTM':
            gate_size = 4 * hidden_size
        elif mode == 'GRU':
            gate_size = 3 * hidden_size
        elif mode == 'RNN_TANH':
            gate_size = hidden_size
        elif mode == 'RNN_RELU':
            gate_size = hidden_size
        else:
            raise ValueError("Unrecognized RNN mode: " + mode)
```
	
##### 1.2.1.3. 片段2
``` python
        self._flat_weights_names = []
        self._all_weights = []
        for layer in range(num_layers):
            for direction in range(num_directions):
                real_hidden_size = proj_size if proj_size > 0 else hidden_size
                layer_input_size = input_size if layer == 0 else real_hidden_size * num_directions

                w_ih = Parameter(torch.empty((gate_size, layer_input_size), **factory_kwargs))
                w_hh = Parameter(torch.empty((gate_size, real_hidden_size), **factory_kwargs))
                b_ih = Parameter(torch.empty(gate_size, **factory_kwargs))
                # Second bias vector included for CuDNN compatibility. Only one
                # bias vector is needed in standard definition.
                b_hh = Parameter(torch.empty(gate_size, **factory_kwargs))
                layer_params: Tuple[Tensor, ...] = ()
                if self.proj_size == 0:
                    if bias:
                        layer_params = (w_ih, w_hh, b_ih, b_hh)
                    else:
                        layer_params = (w_ih, w_hh)
                else:
                    w_hr = Parameter(torch.empty((proj_size, hidden_size), **factory_kwargs))
                    if bias:
                        layer_params = (w_ih, w_hh, b_ih, b_hh, w_hr)
                    else:
                        layer_params = (w_ih, w_hh, w_hr)

                suffix = '_reverse' if direction == 1 else ''
                param_names = ['weight_ih_l{}{}', 'weight_hh_l{}{}']
                if bias:
                    param_names += ['bias_ih_l{}{}', 'bias_hh_l{}{}']
                if self.proj_size > 0:
                    param_names += ['weight_hr_l{}{}']
                param_names = [x.format(layer, suffix) for x in param_names]

                for name, param in zip(param_names, layer_params):
                    setattr(self, name, param)
                self._flat_weights_names.extend(param_names)
                self._all_weights.append(param_names)

        self._init_flat_weights()

        self.reset_parameters()
```