FROM nginx:1.13.12-alpine
COPY dist /usr/share/nginx/html


COPY nginx.conf /etc/nginx/

ADD ./docker-run.sh /usr/share/nginx/

EXPOSE 80

CMD ["sh", "/usr/share/nginx/docker-run.sh"]
