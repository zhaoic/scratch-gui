FROM node:9.11.1

# RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
#创建app目录,保存我们的代码
RUN mkdir -p /usr/src/node
RUN mkdir -p /usr/src/node/src
RUN mkdir -p /usr/src/node/static
RUN mkdir -p /usr/src/node/test
#设置工作目录
WORKDIR /usr/src/node

#复制所有文件到 工作目录。
COPY ./src /usr/src/node/src
COPY ./static /usr/src/node/static
COPY ./test /usr/src/node/test
COPY package.json /usr/src/node
COPY webpack.config.js /usr/src/node

#编译运行node项目，使用npm安装程序的所有依赖,利用taobao的npm安装

#暴露container的端口
EXPOSE 8601

#运行命令
RUN npm install chromedriver@2.40.0 --chromedriver_cdnurl=http://cdn.npm.taobao.org/dist/chromedriver
# RUN npm i scratch-audio@0.1.0-prerelease.20180625202813 --registry=https://registry.npmjs.org/
# RUN npm i scratch-blocks@0.1.0-prerelease.1532024291 --registry=https://registry.npmjs.org/
# RUN npm i scratch-l10n@3.0.20180719145856 --registry=https://registry.npmjs.org/
# RUN npm i scratch-paint@0.2.0-prerelease.20180718183615 --registry=https://registry.npmjs.org/
# RUN npm i scratch-render@0.1.0-prerelease.20180618173030 --registry=https://registry.npmjs.org/
# RUN npm i scratch-storage@0.5.1 --registry=https://registry.npmjs.org/
# RUN npm i scratch-svg-renderer@0.2.0-prerelease.20180712223402 --registry=https://registry.npmjs.org/
# RUN npm i scratch-vm@0.2.0-prerelease.20180719205147 --registry=https://registry.npmjs.org/

#RUN npm config set registry https://registry.npm.taobao.org
# RUN npm i --registry=https://registry.npm.taobao.org
RUN npm i --registry=https://registry.npmjs.org/
CMD ["npm", "start"]
