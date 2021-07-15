## 功能1:选中样式，在驼峰和下划线之间相互转换
如
```
  width: '100%',
  background: 'white',
  display: 'flex',
  flexWrap: 'wrap',
  padding: '10px 10px',
  justifyContent: 'space-between',
  borderBottom: '1px solid #eee',
```
和
```
  width: 100%;
  background: white;
  display: flex;
  flex-wrap: wrap;
  padding: 10px 10px;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
```
用法：选中文本后，"驼峰转中划线"和"中划线转驼峰"按钮会出现在右上角，点击即可转换。

## 功能2，抽取行内样式到单独文件
在.tsx或.jsx文件中右键，选择"抽取样式到单独文件",即可将行内样式抽取到单独文件，如
```
export default function Foo(){
  return <div style={{xxxx}}>
    <div style={{xxxxx}}></div>
  </div>
}
```
会在当前目录下新生成一个文件index.module.less

```
.class0{
  xxxx
}
.class1{
  xxxx
}
```
原文件会变成

```
import styles from './index.module.less';

export default function Foo(){
  return <div className={styles.class0}>
    <div className={styles.class1}></div>
  </div>
}
```
> 支持绝大多数情况，部分情况如css变量等需要手动处理，为什么呢，作者懒得写了。。。。。也不要问我为啥没有英文readme，
还是因为懒。