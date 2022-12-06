# Argocd-module

This module will walk you through the concepts of GitOps and Argocd(Gitops tools) with hands-on to gear up and start using Argocd deployment in your projects.

Total number of days: 1.5 days

# Level-01

# Table of Contents
- [01-Introduction to GitOps]()
    - [Gitops Principle]()
    - [Gitops tools]()
    - [Benefits and Drawback]()
- [02-ArgoCd]()
    - [Argocd Architecture]()
    - [Argocd server Installation and CLI]() 
- [03-Adding git repos through UI, CLI and declarative way in argocd]()
- [04-Understanding Multi Cluster Setup ]()
- [05-Understanding HA Cluster Setup]()
- [06-Argocd with Helm]()
- [07-Argocd with Kustomize]()
- [08-Understanding App of Apps]()
- [09-Understanding Application sets]()
- [10-Assignment on AppicationSets]()
- [11-Using Bitnami sealed secrets for storing secrets on git repos securely]()
- [12-ArgoCD integration with external secret operator]()
- [13-ArgoCD with HC Vault and Bitnami sealed secrets]()
- [14-end-to-end CI/CD pipeline using Jenkins(CI) and ArgoCD(CD)]()

# Level-02
- [01-User Management](#user-management60-minutes)
    - [Local Users/Accounts](#a-local-usersaccounts20-minutes)
    - [SSO](#b-sso40-minutes)
- [02-ArgoCD with github actions for end-to-end CI/CD ]()
- [03-ArgCD Sync Phases and Waves](#03-argcd-sync-phases-and-waves)
- [04-ArgoCD Diff customizations, Notifications and Sync Windows]()
- [05-ArgoCD Disaster Recovery.]()
- [06-ArgoCD with ArgoRollouts for progressive delivery]()



# ArgoCD Level-02
## User Management(60 Minutes)
### a) Local Users/Accounts(20 Minutes)
ArgoCD allows us to create to local users/accounts for authenticating and authorizing the different users and groups and restrict access to the ArgoCD and its resources. Argo CD does not have its own user management system and has only one built-in user admin. The admin user is a superuser and it has unrestricted access to the system. ArgoCD allows restrict access to ArgoCD resources using RBAC permissions.
- [Read][Local Users/Accounts](https://argo-cd.readthedocs.io/en/stable/operator-manual/user-management/#local-usersaccounts-v15)
- [Read][RBAC Rules](https://argo-cd.readthedocs.io/en/stable/operator-manual/rbac/#rbac-configuration)

##### Assignment(10 Minutes)
:computer: Create a new user for Argocd and give the permissions to get, create, update and delete appplications in default AppProject
<details>
<summary>Answer</summary></br>
argocd-cm:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  labels:
    app.kubernetes.io/name: argocd-cm
    app.kubernetes.io/part-of: argocd
  name: argocd-cm
  namespace: argocd
data:
  accounts.Newuser: apiKey,login
  ```
argocd-rbac-cm:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  labels:
    app.kubernetes.io/name: argocd-rbac-cm
    app.kubernetes.io/part-of: argocd
  name: argocd-rbac-cm
  namespace: argocd
data:
  policy.csv: |-
    p,role:defaul-applications-CRUD-role,applications,get,default/*,allow
    p,role:defaul-applications-CRUD-role,applications,create,default/*,allow
    p,role:defaul-applications-CRUD-role,applications,update,default/*,allow
    p,role:defaul-applications-CRUD-role,applications,get,default/*,allow
    g,NewUser,role:defaul-applications-CRUD-role
```
</details>

### b) SSO(40 Minutes)
ArgoCD allows us to integrate SSO to use our existing identity provider to access ArgoCD resources, since we already know ArgoCD don't its own user management system but allow us to restrict access to its resource using RBAC permissions so we can use our existing identity provider for authenticating and RBAC permission for authorization.
- [Read][ArgoCD SSO Configuration](https://argo-cd.readthedocs.io/en/stable/operator-manual/user-management/#sso)
##### Assignment(20 Minutes)
:computer: Configure ArgoCD SSO using Okta via SAML method
<details>
<summary>Answer</summary></br>

Follow [this](https://argo-cd.readthedocs.io/en/stable/operator-manual/user-management/okta/#saml-with-dex) guide for ArgoCD SSO integration using Okta
</details>

## 03-ArgCD Sync Phases and Waves
Argo CD executes a sync operation in a number of steps. At a high-level, there are three phases pre-sync, sync and post-sync.

Within each phase you can have one or more waves, that allows you to ensure certain resources are healthy before subsequent resources are synced.
- [Read][ArgoCD Phases and Syncs](https://argo-cd.readthedocs.io/en/stable/user-guide/sync-waves/#how-do-i-configure-phases)
- [Read][Phase Configuration](https://argo-cd.readthedocs.io/en/stable/user-guide/sync-waves/#how-do-i-configure-phases)
- [Read][Wave Configuration](https://argo-cd.readthedocs.io/en/stable/user-guide/sync-waves/#how-do-i-configure-waves)



