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
- [04-ArgoCD Diffing customizations, Notifications and Sync Windows](04-argoCD-diffing-customizations-notifications-and-sync-windows)
- [05-ArgoCD Disaster Recovery.]()
- [06-ArgoCD with ArgoRollouts for progressive delivery]()


# ArgoCD Level-02
## 01-User Management(60 Minutes)
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

##### Assignment
:computer: This is sample k8s application [repo](https://github.com/shehbaz-pathan/simple-microservices-app/tree/master/manifests) deploy this application using ArgoCD and create post-sync hooks to verify we are getting http status code 200 from both ```web-frontend``` and ```customers``` service.
Note: use sync waves to run hook for customers service before the web-frontend service
<details>
<summary>Answer</summary></br>
create a post-sync hook for customers service

```yaml
apiVersion: batch/v1
kind: Job
metadata:
   name: customers-status
   annotations:
    argocd.argoproj.io/hook: PostSync
    argocd.argoproj.io/sync-wave: "1"
    argocd.argoproj.io/hook-delete-policy: BeforeHookCreation
spec:
   backoffLimit: 3
   template:
     spec:
       restartPolicy: OnFailure
       containers:
          - name: customers-status-checker
            image: curlimages/curl
            command: ["/bin/sh","-c","[[ $(curl http://customers/ -s -o /dev/null -w \"%{http_code}\") -eq 200 ]] && exit 0 || exit 1"]
```
create post-sync hook for web-frontend service
```yaml
apiVersion: batch/v1
kind: Job
metadata:
   name: web-front-status
   annotations:
    argocd.argoproj.io/hook: PostSync
    argocd.argoproj.io/sync-wave: "2"
    argocd.argoproj.io/hook-delete-policy: BeforeHookCreation
spec:
   backoffLimit: 3
   template:
     spec:
       restartPolicy: OnFailure
       containers:
          - name: customers-status-checker
            image: curlimages/curl
            command: ["/bin/sh","-c","[[ $(curl http://web-frontend/ -s -o /dev/null -w \"%{http_code}\") -eq 200 ]] && exit 0 || exit 1"]
```
as mentioned above we used sync wave 1 for customers service and wave 2 for web-frontend in this order hook for customers service will get executed before web-frontend
</details>

## 04-ArgoCD Diffing Customizations, Notifications and Sync Windows
### a) Diffing Customization
The diffing customization feature allows users to configure how ArgoCD behaves during the diff stage which is the step that verifies if an Application is synced or not. Argo CD allows you to optionally ignore differences of problematic resources. The diffing customization can be configured for single or multiple application resources or at a system level.
- [Read][Diffing Customization](https://argo-cd.readthedocs.io/en/stable/user-guide/diffing/)
- [Read][Application Level Configuration](https://argo-cd.readthedocs.io/en/stable/user-guide/diffing/#application-level-configuration)
- [Read][System Level Confgiguration](https://argo-cd.readthedocs.io/en/stable/user-guide/diffing/#system-level-configuration)

##### Assignmetn 
:computer: Use this sample k8s application [repo](https://github.com/shehbaz-pathan/simple-microservices-app/tree/master/manifests) deploy this application using ArgoCD and later configure the diffing customization to ingoner the count of replicas for web-frontend deployment.
<details>
<summary>Answer</summary></br>

- Deploy the application using ArgoCD
- Set the replica count of web-frontend deployment to 2 by editing the web-frontend deployment manually, now check the sync status of the app it will show OutOfSync due to replica count changed for web-frontend deployment
- Update the application with diffing configuration

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: customers-details
  namespace: default
spec:
      ignoreDifferences:
       - group: apps
         kind: Deployment
         namespace: default
         name: web-frontend
         jqPathExpressions:
          - .spec.replicas
      project: default
      source:
        repoURL: https://github.com/shehbaz-pathan/simple-microservices-app.git
        targetRevision: HEAD
        path: manifests
      destination:
        server: https://kubernetes.default.svc
        namespace: default
      syncPolicy:
        syncOptions:
         - RespectIgnoreDifferences=true
        automated:
          prune: true
```
- Now change the replica count of web-frontend deployment to 2 and and check this time application sync status would not show OutOfSync because we are ignoring changes of web-frontend deployment for replica count
</details>
    
