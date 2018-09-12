# weather-hf
和风天气cli

### 使用

首先在和风天气官网注册一个开发者key，并填入config.json中<br>
入口文件为cli.js<br>

#### 参数说明

```
--city / -c : 选择目标城市(如果选择了地区可以忽略)
--area / -a : 选择目标地区(如果选择了城市可以忽略)
--opt  / -o : 选择查询的模式，目前有now(今天的天气情况)，forecast(未来天气情况)
--lang / -l : 语言，默认为中文，可忽略
--key  / -k : 开发者key，如果在config.json中已经填了可忽略此选项
```

demo：<br>

查询今天广州的天气：<br>

```
node cli.js -c 广州 -o now
```
