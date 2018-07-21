## fork from scratch 3.0

- [x] 本地运行
- [ ] docker化

1. npm install 失败原因，谷歌墙的问题
```
npm install chromedriver@2.40.0 --chromedriver_cdnurl=http://cdn.npm.taobao.org/dist/chromedriver
```

2. docker build
docker build -t="registry.cn-beijing.aliyuncs.com/maodouio/scratch:dev" .

3. run docker

docker rm -f scratch
docker run \
       -d \
       --name=scratch \
       --restart=always \
       -p 8601:8601 \
       -e VIRTUAL_HOST=scratch.maodou.io \
       registry.cn-beijing.aliyuncs.com/maodouio/scratch:dev

4. 修改
需要加上--public，才能通过nginx访问到
    "start": "webpack-dev-server --public",

在webpack的devServer中，加入
    disableHostCheck：true