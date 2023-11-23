# vite-runtime-env-script-plugin

## Docker usage

```Dockerfile
CMD ["/bin/sh", "-c", "envsubst '$BASE_URL' < /usr/share/nginx/html/configure-runtime.sh && exec nginx -g 'daemon off;'"]
```
