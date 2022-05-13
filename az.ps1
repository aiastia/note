az ad sp create-for-rbac --role contributor  --years 99 --scopes /subscriptions/$(az account list --query [].id -o tsv) >ls.txt
