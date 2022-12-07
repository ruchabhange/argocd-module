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
- [09-Understanding Application sets](#ApplicationSet) 
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
- [03-ArgCD Sync Waves and phases]()
- [04-ArgoCD Diff customizations, Notifications and Sync Windows]()
- [05-ArgoCD Disaster Recovery.]()
- [06-ArgoCD with ArgoRollouts for progressive delivery]()

# ArgoCD Level-01

## ApplicationSet


ApplicationSet is used to create, modify, and manage multiple Argo CD applications at once. ApplicationSet uses templated automation for creating or modifying multiple applications while also targeting multiple clusters and namespaces.

ApplicationSet Controller is installed alongside ArgoCD and creates multiple Argo Applications based on ApplicationSet Custom Resource.

AppicationSet resource is made up of generators.A generator is responsible for generating parameters that will be rendered later in the template section of your ApplicationSet

#### Types of generators in ArgoCD:
- [List Generator](https://argocd-applicationset.readthedocs.io/en/stable/Generators-List/)
- [Cluster Generator](https://argocd-applicationset.readthedocs.io/en/stable/Generators-Cluster/)
- [Git generator](https://argocd-applicationset.readthedocs.io/en/stable/Generators-Git/)
- [Matrix generator](https://argocd-applicationset.readthedocs.io/en/stable/Generators-Matrix/)
- [Merge Generator](https://argocd-applicationset.readthedocs.io/en/stable/Generators-Merge/)
- [SCM Provider Generator](https://argocd-applicationset.readthedocs.io/en/stable/Generators-SCM-Provider/)
- [Pull Request Generator](https://argocd-applicationset.readthedocs.io/en/stable/Generators-Pull-Request/)
- [Cluster Decision Resource Generator](https://argocd-applicationset.readthedocs.io/en/stable/Generators-Cluster-Decision-Resource/)

Below is an example of an ApplicationSet resource.
```yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: guestbook
spec:
  generators:
  - list:
      elements:
      - cluster: engineering-dev
        url: https://1.2.3.4
      - cluster: engineering-prod
        url: https://2.4.6.8
      - cluster: finance-preprod
        url: https://9.8.7.6
  template:
    metadata:
      name: '{{cluster}}-guestbook'
    spec:
      source:
        repoURL: https://github.com/infra-team/cluster-deployments.git
        targetRevision: HEAD
        path: guestbook/{{cluster}}
      destination:
        server: '{{url}}'
        namespace: guestbook
```

The template fields within an ApplicationSet spec are used to generate an Argo CD Application resource. 
The Argo CD Application is created by combining the params from the generator with the fields from the template.
The above example creates three Argo CD applications one for each defined cluster

- [Read] [ApplicationSet controller](https://argo-cd.readthedocs.io/en/stable/operator-manual/applicationset/)

#### Assignment

##### Prerequisite

- Two local kind clusters
- Argo CD multi-cluster set up

 :computer: Fork the following repository `https://github.com/shehbaz-pathan/simple-microservices-app.git` and configure an ApplicationSet for deploying applications on remote cluster alone with following parameters
```
 - application name: demo-application-sets
 - project: default
 - SYNC POLICY: auto
 - repository URL: https://github.com/<your user>/simple-microservices-app.git
 - path: manifests
 - Cluster: Remote cluster
 - NameSpace: default
```
<details>
<summary>Answer</summary></br>

```yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: demo-applicationset
  namespace: argocd
spec:
  generators:
  - list:
      elements:
      - name: demo-application-sets
        namespace: default
        url: https://172.18.0.2:31413  # replace with remote server url

  template:
    metadata:
      name: '{{name}}'
    spec:
      project: default
      source:
        repoURL: https://github.com/<your user>/simple-microservices-app.git
        targetRevision: HEAD
        path: manifests
      destination:
        server: '{{url}}'
        namespace: '{{namespace}}'
      syncPolicy:
        automated:
          prune: true
          selfHeal: true
        syncOptions:
          - CreateNamespace=true 
```

</details>

:computer: Fork the following repo `https://github.com/ppratheesh/simple-microservices-app.git` and configure an ApplicationSet for deploying all the applications defined in cluster-addons directory except sample-app-three 
on both clusters with following parameters


```
 - application name: <resource_directory_name>-<clustername>
 - project: default
 - SYNC POLICY: auto
 - repository URL: https://github.com/<your name>/simple-microservices-app.git
 - path: cluster-addons
 - Cluster: Both clusters
 - NameSpace: same as resource directory name
```

<details>
<summary>Answer</summary></br>

```yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: cluster-git
  namespace: argocd
spec:
  generators:
    - matrix:
        generators:
          - git:
              repoURL: https://github.com/<your name>/simple-microservices-app.git
              revision: HEAD
              directories:
                - path: cluster-addons/*
                - path: cluster-addons/sample-app-three
                  exclude: true
          - clusters: {}
  template:
    metadata:
      name: '{{path.basename}}-{{name}}'
    spec:
      project: default
      source:
        repoURL: https://github.com/<your name>/simple-microservices-app.git
        targetRevision: HEAD
        path: '{{path}}'
      destination:
        server: '{{server}}'
        namespace: '{{path.basename}}'
      syncPolicy:
        automated:
          prune: true
          selfHeal: true
        syncOptions:
          - CreateNamespace=true

```
</details>

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
