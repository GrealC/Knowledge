# Pytorch(GPU)与CUDA的环境配置

## Ⅰ. 简介

#### A. CUDA

​	CUDA(Compute Unified Device Architecture)是由NVIDIA推出的并行计算架构，是一种硬件技术。CUDA旨在利用GPU来执行通用计算任务。与传统的CPU相比，GPU在处理大规模并行计算任务时具有更高的效率和更低的能耗。CUDA的出现，使得GPU不再仅仅局限于图形处理领域，而是可以广泛应用于科学计算、数据分析、人工智能等多个领域。CUDA为开发者提供了一套丰富的API，这些API涵盖了从底层硬件访问到高层抽象的各种功能。开发者可以使用这些API来编写高效的并行计算程序，并充分利用GPU的并行计算能力。

​	CUDA Toolkit是一套完整的软件开发工具集，包括编译器、库和API，用于开发CUDA应用程序。

​	cuDNN（CUDA Deep Neural Network library）是由NVIDIA提供的一个深度学习库，专门用于加速深度神经网络的训练和推理。它包含了高度优化的深度学习操作实现，可以显著提高深度学习模型在NVIDIA GPU上的性能

#### B. PyTorch

​	PyTorch是一个开源的机器学习库，它为用户提供了构建和训练机器学习模型所需的丰富工具。其中，PyTorch能够利用NVIDIA CUDA技术，实现神经网络在GPU上的高效并行计算，这一特性使得深度学习模型的训练更加迅速且高效。

## Ⅱ. 环境

- 系统环境：Windows 11(X86_64, RTX4060)

- 工具：Miniconda

```shell
conda -V # 查询Conda版本
# conda 24.7.1
```

- Python版本：3.8.16

## Ⅲ. 步骤

1. 确定Python版本，以找到对于支持的Pytorch版本

2. 查看当前系统支持的CUDA版本

   ```shell
   nvidia-smi
   ```

   ![image-20241005163458619](C:\Users\GetrM\AppData\Roaming\Typora\typora-user-images\image-20241005163458619.png)
   
   - 可以看到当前系统所支持的最高CUDA版本为12.2
   - 安装Pytorch(GPU)版本之前需要先安装CUDA和cuDNN，否则Pytorch无法正常工作

3. 安装CUDA

   - 可以在官网下载安装(不方便版本管理)：https://developer.nvidia.com/cuda-toolkit-archive

   - 利用conda在虚拟环境中安装(比较新的版本没有)：此处安装11.8.0

     ```shell
     conda search cudatoolkit # 查看可以安装的版本
     ```

     ![image-20241005190729215](C:\Users\GetrM\AppData\Roaming\Typora\typora-user-images\image-20241005190729215.png)

     ```shell
     conda install cudatoolkit==11.8.0
     ```

     **![image-20241005190940606](C:\Users\GetrM\AppData\Roaming\Typora\typora-user-images\image-20241005190940606.png)**

4. 安装cuDNN

   - cuDNN与CUDA toolkit也有版本对应关系。

     ![image-20241005191157998](C:\Users\GetrM\AppData\Roaming\Typora\typora-user-images\image-20241005191157998.png)

   - 可以在官网下载：https://developer.nvidia.com/rdp/cudnn-archive

   - 也可在conda中下载：

     ``` shell
     conda search cudnn
     ```
     
     ![image-20241005191751634](C:\Users\GetrM\AppData\Roaming\Typora\typora-user-images\image-20241005191751634.png)

     ``` shell
     conda install cudnn==8.9.2.26=cuda11_0
     ```

     ![image-20241005191721498](C:\Users\GetrM\AppData\Roaming\Typora\typora-user-images\image-20241005191721498.png)

5. 安装Pytorch

   - 在官网上找对应的版本：https://pytorch.org/

     ![image-20241005191940739](C:\Users\GetrM\AppData\Roaming\Typora\typora-user-images\image-20241005191940739.png)

   - 在虚拟环境中安装：

     ``` shell
     conda install pytorch torchvision torchaudio pytorch-cuda=11.8 -c pytorch -c nvidia
     ```

     ![image-20241005192046154](C:\Users\GetrM\AppData\Roaming\Typora\typora-user-images\image-20241005192046154.png)

6. 测试安装结果

   - 在conda环境中进入python命令行：

     ``` SHELL
     python
     ```

     ![image-20241005203535728](C:\Users\GetrM\AppData\Roaming\Typora\typora-user-images\image-20241005203535728.png)

   - 导入torch包并查看版本、查看cuda版本、查看cudnn版本

     ``` python
     import torch
     
     print(torch.__version__)
     print(torch.version.cuda)
     print(torch.backends.cudnn.version())
     ```

     ![image-20241005204017194](C:\Users\GetrM\AppData\Roaming\Typora\typora-user-images\image-20241005204017194.png)

