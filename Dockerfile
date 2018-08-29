FROM openresty/openresty:alpine

ENV GATEWAY_URL http://10.9.60.141:9999
COPY dist /usr/share/nginx/html


COPY nginx.conf /usr/local/openresty/nginx/conf/nginx.conf

EXPOSE 80


