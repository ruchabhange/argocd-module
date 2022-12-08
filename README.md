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
- [11-Using Bitnami sealed secrets for storing secrets on git repos securely](#11-Using-Bitnami-sealed-secrets-for-storing-secrets-on-git-repos-securely)
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

## 07-Argocd with Kustomize (60 minutes)

Kustomize traverses a Kubernetes manifest to add, remove or update configuration options without forking. It is available both as a standalone binary and as a native feature of kubectl (and by extension oc)
- [Read][Kustomize](https://kubectl.docs.kubernetes.io/guides/introduction/kustomize/)
- [Read][kustomize-argocd](https://argo-cd.readthedocs.io/en/latest/user-guide/kustomize/)

##### Kustomized Application:</br>

Argo CD has native support for Kustomize. You can use this to avoid duplicating YAML for each deployment. This is especially good to use if you have different environments or clusters you’re deploying to.


##### Hands-on activity (30 minutes)</br>
:computer: This is sample k8s application [repo](https://github.com/shehbaz-pathan/simple-microservices-app/tree/master/manifests) we have integrate with kustomize template with 2 enviornment and deploy the application to argocd with env changes as:
```
Test : replica count for customer-2 and web-frontend-3, nameSuffix-test, commonLabels: purpose-Argocd-demo , env-test
Prod : replica count for customer-3 and web-frontend-4 , nameprifix-prod, commonLabels: purpose-Argocd-demo , env-prod
```
<details>
<summary>Answer</summary></br>
 Pre-Requsite:
 
1 kustomization installed 

2 use concept of an "overlay", where you have a "base" set of manifests and you overlay your kustomizations for test and stage enviornment.

Step1: Make 2 directory base with apllication manifest and kustomization.yaml for base application to pick up the k8 manifest as:
dir: base/kustomization.yaml

```yaml
kind: Kustomization
resources:
  - web-frontend.yaml
  - customers.yaml 
commonLabels:
  purpose: Argocd-demo
 
  ```

Step2: For test enviornment kustomization template with required enviornment dir overlays/test/kustomization.yaml

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

bases:
  - ../../base

commonLabels:
  purpose: Argocd-demo
  env : test

nameSuffix: -test

replicas:
  - name: web-frontend
    count: 2
  - name: customers-v2
    count: 3

  ```

Test the test enviornment is working properly by kustomization build and apply to cluster command: `kustomize build | kubectl apply -f -` from directory 
`/overlays/test/kustomization` with required configuration

Step 3 : For Prod enviornment kustomization template with required enviornment dir overlays/prod/kustomization.yaml

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

bases:
  - ../../base

commonLabels:
  env : prod

nameSuffix: -test

replicas:
  - name: web-frontend
    count: 3
  - name: customers-v2
    count: 4
  ```

Test the prod enviornmenttemplate is working properly by kustomization build and apply to cluster command: `kustomize build | kubectl apply -f -` from directory `/overlays/prod/kustomization.yaml` with required configuration 

</details>

## 08-Understanding App of Apps (20 minutes)

Argo CDs App-of-Apps pattern enables us to programmatically and automatically generate Argo CD applications.We can create a route Argo CD application using the App-of-Apps pattern.The route Argo CD application points to a folder that includes the Argo CD application YAML definition files for each microservers or application.The application YAMLs for each microservers refers to a directory holding
the application manifests.The idea here is to create a single Argo CD application and upload all of its definition files to a Git repository path.
- [Read][App of Apps](https://argo-cd.readthedocs.io/en/stable/operator-manual/declarative-setup/#app-of-apps)

##### Hands-on activity (30 minutes)</br>
:computer: Create argocd application deployment for Test and Prod application using the yaml files created in Topic-07 create an application with Env-apps pointing to test and Prod application yaml with namespace test for test application and prod for prod application.

<details>
<summary>Answer</summary></br>
We will create declarative Jobs for apps of apps for env.yaml and env-apps folder containing test and prod jobs.

env.yaml
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: k8s-env-apps
  namespace: argocd
spec:
  project: default
  source:
    repoURL: (git repo where yaml are places)
    targetRevision: HEAD
    path: .(path)/env-apps/(test,Prod)yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: argocd
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```
env-apps/test.yaml
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: test-app
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: default
  source:
    repoURL: git repo for application
    targetRevision: HEAD
    path: ./application/overlays/test (path to test manifest)
   
  destination:
    server: https://kubernetes.default.svc
    namespace: test-app
  syncPolicy:
    syncOptions:
      - CreateNamespace=true  
    automated:
      prune: true
      selfHeal: true
```
env-apps/prod.yaml

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: prod-app
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: default
  source:
    repoURL: git repo for application
    targetRevision: HEAD
    path: ./application/overlays/prod (dir where prod manifest are placed)
   
  destination:
    server: https://kubernetes.default.svc
    namespace: prod-app
  syncPolicy:
    syncOptions:
      - CreateNamespace=true  
    automated:
      prune: true
      selfHeal: true

```
Run command `lkubectl apply -f env.yaml` which will create env-apps application with route to test and prod application. verify on the argo cd UI
</details>

##### Prerequisite

- SealedSecret Controller should be installed 
- kubeseal utility should be installed

:computer: Configure sealed secrets for the mysql applicaiton defined in [repo](https://github.com/ppratheesh/simple-microservices-app/tree/master/custom-app/mysql) and store it in git repo.
Use ArgoCD to manage the secrets along with the application

<details>
<summary>Answer</summary></br>

The sealed secret can be created with the following way

1.`kubeseal <secret.yaml >secret.json`

Sample `secret.yaml`
```yaml
apiVersion: v1
kind: Secret
metadata:
   name: mysql-secret
data:
   username: cHJhdGhlZXNo
   password: cGFzc3dvcmQ=
```

2.Upload to `secret.json` to the git repo after forking it

3.Create Argo CD application resource
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: sealed-secret-demo
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/<your name>/simple-microservices-app.git
    targetRevision: HEAD
    path: custom-app/mysql
  destination:
    server: https://kubernetes.default.svc
    namespace: default

```
