---
paths:
  - "terraform/**"
---

# Terraform

- Never run `terraform apply` or `destroy`. Only a person does. `fmt` and `validate` are fine; run `plan` only when asked.
- Providers: `azurerm` and `cloudflare`, with versions pinned.
- No secrets in `.tf` or committed `.tfvars` files. Pass them in through variables from GitHub secrets or Key Vault, and mark them `sensitive`.
- One environment: `environments/prod/`. State storage is created once by hand in `bootstrap/`.
- GitHub Actions logs into Azure with OIDC, never stored keys.