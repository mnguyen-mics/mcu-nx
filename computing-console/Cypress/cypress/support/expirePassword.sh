#!/bin/bash
ssh-keyscan -H $1 >> ~/.ssh/known_hosts
sleep 0.5

yes | ssh -o StrictHostKeyChecking=no -A -T $1 ssh -o StrictHostKeyChecking=no -A -T 10.0.1.7 <<eof
sudo su postgres
psql core_services
Update public.user set last_password_update = last_password_update - INTERVAL '1 year' where email = '$2';
eof
result=$?

# Remove bastion ssh key
ssh-keygen -R $1
exit $result