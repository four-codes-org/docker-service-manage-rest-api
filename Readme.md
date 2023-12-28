_docker-service-manage-rest-api_

_Docker image_

```bash
docker build -t docker-service-rest-api .
docker run -d --name docker-service-rest-api -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock docker.io/library/docker-service-rest-api
```

_validate_

```bash
curl -XGET  --header "application/json" http://192.168.0.114:3000/healthz
curl -XGET  --header "application/json" http://192.168.0.114:3000/container-list
curl -X POST -H "Content-Type: application/json" -d '{"containerNames": ["ldap", "db", "arc"]}' http://192.168.0.114:3000/selected-containers-restart
url -XPOST -H "Content-Type: application/json" http://192.168.0.114:3000/specific-container-restart/ldap
```
