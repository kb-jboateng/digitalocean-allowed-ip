# digitalocean-allowed-ip

> Makes use of [Digital Ocean API](https://docs.digitalocean.com/reference/api/api-reference/#operation/databases_update_firewall_rules) to add/remove trusted sources and [ipify](https://api.ipify.org) to query runner's IP

This action allows you to add and/or removed the runner''s public IPv4 address to digital ocean manaaged database trusted sources

## Usage
```yaml
  - name: Add Runner IP
  - uses: kb-jboateng/digitalocean-allowed-ip
  - with:
      action: "add"
      max_retries: "4"
      database_id: ${{ secrets.DATABASE_ID }}
      digitalocean_token: ${{ secrets.DIGITALOCEAN_TOKEN }}

  - name: Perform action against database
    run: echo "running action against database"

  - name Remove Runner IP
  - uses: kb-jboateng/digitalocean-allowed-ip
  - with:
      action: "remove"
      max_retries: "4"
      database_id: ${{ secrets.DATABASE_ID }}
      digitalocean_token: ${{ secrets.DIGITALOCEAN_TOKEN }}
```
