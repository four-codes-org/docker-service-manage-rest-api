_Rest API_

```console
curl -XGET  --header "application/json" http://192.168.0.114:3000/healthz

curl -XGET  --header "application/json" http://192.168.0.114:3000/container-list

curl -X POST -H "Content-Type: application/json" -d '{"containerNames": ["ldap", "db", "arc"]}' http://192.168.0.114:3000/selected-containers-restart

url -XPOST -H "Content-Type: application/json" http://192.168.0.114:3000/specific-container-restart/ldap
```
