#!/bin/sh
yes | ssh -o StrictHostKeyChecking=no -A -T $1-bastion ssh -o StrictHostKeyChecking=no -A -T 10.0.1.3 <<eof
id=\$(sh /opt/keycloak/keycloak-14.0.0/bin/kcadm.sh get clients -r mediarithmics --no-config --server 'https://auth.$1.mics-sandbox.com/auth' --realm master --user vagrant --password 1234 | jq -r '.[] | select(.clientId =="mediarithmics-computing-console").id')
sh /opt/keycloak/keycloak-14.0.0/bin/kcadm.sh update clients/\$id -r mediarithmics  -s 'directAccessGrantsEnabled=$2' --no-config --server 'https://auth.$1.mics-sandbox.com/auth' --realm master --user vagrant --password 1234
eof