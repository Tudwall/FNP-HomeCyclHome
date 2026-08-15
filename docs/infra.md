# Infrastructure

Ce projet est hébergé sur une machine virtuelle Debian 13 sous Proxmox.

2 coeurs 3.8GHz Intel N305
4Go RAM DDR5
15Go SSD

#### Configuration réseau

CNAME -> DDNS -> LXC Nginx Proxy Manager -> VM VPS

### Sécurité

Firewall router, Firewall PVE, Firewall VPS, CrowdSec
HTTPS forcé, HSTS activé

### Nginx Proxy Manager

LXC Debian 13 sous Proxmox
2 coeurs 3.8GHz Intel N305
2Go RAM DDR5
8Go SSD

Arguments de configuration:

```
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
real_ip_header X-Forwarded-For;
set_real_ip_from 192.168.1.0/24;
proxy_buffering off;
proxy_read_timeout 300s;
```
