This module will walk you through the concepts of GitOps and Argocd(Gitops tools) with hands-on to gear up and start using Argocd deployment in your projects. bjknl

Total number of days: 1.5 days

# Level-01adafewfw

# Table of Contents
- [01-Introduction to GitOps](#01-introduction-to-gitops)
    - [Gitops Principle](#g knljitops-principle)
    - [Gitops tools](#gitops-tools)
    - [Benefits](#benefits)
    - [Drawback](#drawback)
- [02-ArgoCD](#02-argocd)
    - [ArgoCD Architecture](#02-argocd)
    - [ArgoCD server Installation and CLI](#argocd-server-installation-and-cli) 
- [03-Adding git repos through UI, CLI and declarative way in argocd](#03-adding-git-repos-through-ui-cli-and-declarative-way-in-argocd)
- [04-Understanding Multi Cluster Setup ](#04-understanding-multi-cluster-setup)
- [05-Understanding HA Cluster Setup](#05-understanding-ha-cluster-setup)
- [06-ArgoCD with Helm](#06-argocd-with-helm30-minutes)
- [07-ArgoCD with Kustomize](#07-argocd-with-kustomize-60-minutes)
- [08-Understanding App of Apps](#08-understanding-app-of-apps-20-minutes)
- [09-Understanding Application sets](#09-applicationset)
- [10-ArgoCD with HC Vault and Bitnami sealed secrets](#10-argocd-with-hc-vault-and-bitnami-sealed-secrets)
- [11-ArgoCD integration With External Secrets Operator](#11-argocd-integration-with-external-secrets-operator)
- [12-end-to-end CI/CD pipeline using Jenkins(CI) and ArgoCD(CD)](#12-end-to-end-cicd-pipeline-using-jenkinsci-and-argocdcd)

# Level-02
- [01-User Management](#01-user-management)
    - [Local Users/Accounts](#a-local-usersaccounts)
    - [SSO](#b-sso)
- [02-ArgoCD with github actions for end-to-end CI/CD](#02-argocd-with-github-actions-for-end-to-end-cicd)
- [03-ArgCD Sync Phases, Waves and Sync Windows](#03-argcd-sync-phases-waves-and-sync-windows)
    - [Sync Phases and Waves](#a-sync-phases-and-waves) 
    - [Sync Windows](#b-sync-windows)
- [04-ArgoCD Diffing customizations and Notifications](#04-argocd-diffing-customizations-and-notifications)
   - [Diffing Customization](#a-diffing-customization) 
   - [Notifications](#b-notifications)
- [05-ArgoCD Disaster Recovery.](#05-argocd-disaster-recovery-40-minutes)
- [06-ArgoCD with ArgoRollouts for progressive delivery](#06-argocd-with-argorollouts-for-progressive-delivery)

# ArgoCD Level-01

## 01-Introduction to GitOps
The term GitOps was coined in August, 2017 by Weaveworks.

GitOps is a way to do Kubernetes cluster management and application delivery.  

GitOps works by using Git as a single source of truth for declarative infrastructure and applications.

With GitOps, the use of software agents can alert on any drift between Git and what's running in a cluster, and if there's a difference, Kubernetes reconcilers automatically update or rollback the cluster depending on the case. 

<b>Push based VS Pull based CICD</b>  

- Push-based pipeline means that code starts with the CI system and may continue its path through a series of encoded scripts or uses ‘kubectl’ by hand.  CI systems can be known as attack vectors for production. Because potential we expose credentials outside of your cluster. 

- GitOps uses a pull strategy that consists of two key components: a “Deployment Automator” that watches the image registry and a “Deployment Synchronizer” that sits in the cluster to maintain its state.

### Gitops Principle

1. <b>The entire system described declaratively. </b>  
With Gitops, Kubernetes is just one example of many modern cloud native tools that are “declarative” and that can be treated as code. Declarative means that configuration is guaranteed by a set of facts instead of by a set of instructions. 

2. <b>The canonical desired system state versioned in Git.</b>  
With the declaration of your system stored in a version control system, and serving as your canonical source of truth, you have a single place from which everything is derived and driven. This trivializes rollbacks; where you can use a `Git revert` to go back to your previous application state.

3. <b>Approved changes that can be automatically applied to the system.</b>    
Once you have the declared state kept in Git, the next step is to allow any changes to that state to be automatically applied to your system. What's significant about this is that you don't need cluster credentials to make a change to your system. With GitOps,

4. <b>Software agents to ensure correctness and alert on divergence.</b>  
Once the state of your system is declared and kept under version control, software agents can inform you whenever reality doesn’t match your expectations.  The use of agents also ensures that your entire system is self-healing. like in the case of human error.

### Gitops tools

`ArgoCD`: A GitOps operator for Kubernetes with a web interface  
`Flux`: The GitOps Kubernetes operator by the creators of GitOps — Weaveworks  
`Gitkube`: A tool for building and deploying docker images on Kubernetes using git push  
`JenkinsX`: Continuous Delivery on Kubernetes with built-in GitOps  
`Terragrunt`: A wrapper for Terraform for keeping configurations DRY, and managing remote state  
`WKSctl`: A tool for Kubernetes cluster configuration management based on GitOps principles  
`Helm Operator`: An operator for using GitOps on K8s with Helm  
`werf`: A CLI tool to build images and deploy them to Kubernetes via push-based approach  


### Benefits

By applying GitOps best practices, there is a ‘source of truth’ for both your infrastructure and application code, allowing development teams to increase velocity and improve system reliability.

- Lightweight and vendor-netural as it is based on git protocol 
- Faster, Safer, Immutable and Reproducible deployments (git hosted yaml files)
- Eliminating configuraion drift like manual changes directly to the cluster
- Uses familiar tools and processes (git repo and CI pipeline)
- Revisions with history (git version history)

For more details, https://www.weave.works/technologies/gitops/#key-benefits-of-gitops


### Drawback

- Doesn't help with Secret Management (Requires to use Vault or Sealed secrets)
- Number of Git repositories (Separate code repo and manifest repo)
- Challenges with programmatic updates like multiple CI processes generates Pull request for new change
- Governance other than PR approval (the only approval before CD)
- Malformed conig manifests (linting, syntax validation etc)

Refs: 
- https://www.gitops.tech/
- https://www.weave.works/technologies/gitops/
- https://github.com/weaveworks/awesome-gitops

## 02-ArgoCD
<b>What is?</b>  
Argo CD is a declarative, GitOps continuous delivery tool for Kubernetes.

Argo CD consider Git repositories as the source of truth for defining desired application state and automate the deployment of desired application state in the specified target environment. 

<b>Why?</b>  
Application definitions, configurations, and environments should be declarative and version controlled in Git.  
Application deployment and lifecycle management should be automated, auditable, and easy to understand.  
It can deploy multiple clusters and provides auditability, compliance, security,RBAC, SSo, etc.

<b>How it work?</b>  
It follows GitOps pattern by using Git repo as source of truth.  
ArgoCD automates the synchronization from git repository to the target environment. It can keep checking on kubernetes manifest yaml, Helm charts, Kustomize apps, etc.

### Argocd Architecture

<b>Key Components
1. API Server
2. Repository Server
3. Applicaion Controller  
</b>

![Diagram](https://argo-cd.readthedocs.io/en/stable/assets/argocd_architecture.png)

Read more: [ArgoCD Architecture](https://argo-cd.readthedocs.io/en/stable/operator-manual/architecture/)  
Read more like Application and Projects: [ArgoCD Core Concepts ](https://argo-cd.readthedocs.io/en/stable/core_concepts/)

### Argocd server Installation and CLI
<b>Requirements  </b>
- Installed kubectl command-line tool.
- Kubernetes cluster running on minikube, AWS EKS, GKE, etc.
- Have a kubeconfig file (default location is ~/.kube/config).

<b>Installation Options</b>   
Argo CD has two type of installations: multi-tenant and core.

<b>1. Multi-Tenant</b>
The multi-tenant installation is the most common way to install Argo CD. This type of installation is typically used to service multiple application developer teams in the organization and maintained by a platform team.

- Non High Availability
Not recommended for production use. This type of installation is typically used during evaluation period for demonstrations and testing.
  - install.yaml - Standard Argo CD installation with cluster-admin access.
  - namespace-install.yaml - Installation of Argo CD which requires only namespace level privileges (does not need cluster roles). Use this manifest set if you do not need Argo CD to deploy applications in the same cluster that Argo CD runs in, and will rely solely on inputted cluster credentials. 
- High Availability
High Availability installation is recommended for production use. This bundle includes the same components but tuned for high availability and resiliency.
  - ha/install.yaml - the same as install.yaml but with multiple replicas for supported components.
  - ha/namespace-install.yaml - the same as namespace-install.yaml but with multiple replicas for supported components.

<b>2. Core</b> - [Read here](https://argo-cd.readthedocs.io/en/stable/operator-manual/installation/#core)

<b>Installation</b>  
1. Install Argo CD
```
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```
2. Download ArgoCD CLI (Latest Linux)

```
curl -sSL -o argocd-linux-amd64 https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
sudo install -m 555 argocd-linux-amd64 /usr/local/bin/argocd
rm argocd-linux-amd64
```
3. Access The Argo CD Server
```
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'
kubectl get svc argocd-server -n argocd
```
Port Forwarding (Optional)  
Kubectl port-forwarding can also be used to connect to the API server without exposing the service.  
```
kubectl port-forward svc/argocd-server -n argocd 8080:443
```
Open GUI browser with https://localhost:port and login using admin user and password.  

4. Login Using The CLI  
The initial password for the admin account is auto-generated and stored in a secret named `argocd-initial-admin-secret`.  
```
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
```
Login using credentials and ArgoCD Server IP:
```
argocd login <ARGOCD_SERVER>
```

>Configure the client OS to trust the self signed certificate.  
>Use the --insecure flag on all Argo CD CLI operations in this guide.  

Read more: [ArgoCD Server Installation types](https://argo-cd.readthedocs.io/en/stable/operator-manual/installation/)  
Read more: [Getting started with ArgoCD](https://argo-cd.readthedocs.io/en/stable/getting_started/)

## 03-Adding git repos through UI, CLI and declarative way in argocd
An example repository containing a guestbook application is available at https://github.com/argoproj/argocd-example-apps.git to demonstrate how Argo CD works.

<b>Creating Apps Via CLI</b>

First we need to set the current namespace to argocd
```
kubectl config set-context --current --namespace=argocd
```
Create the example guestbook application
```
argocd app create guestbook --repo https://github.com/argoproj/argocd-example-apps.git --path guestbook --dest-server https://kubernetes.default.svc --dest-namespace default
```

<b>Creating App via UI</b> [Read here](https://argo-cd.readthedocs.io/en/stable/getting_started/#creating-apps-via-ui)

<b>Creating App via Declarative way</b>  

Argo CD applications, projects and settings can be defined declaratively using Kubernetes manifests. These can be updated using `kubectl apply`, without needing to touch the argocd command-line tool.

It is defined by two key pieces of information in yaml manifest:

- `source` reference to the desired state in Git (repository, revision, path, environment)
- `destination` reference to the target cluster and namespace.

```
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: guestbook
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/argoproj/argocd-example-apps.git
    targetRevision: HEAD
    path: guestbook
  destination:
    server: https://kubernetes.default.svc
    namespace: guestbook
``` 
Now, just do `kubectl apply -f app.yaml` 

Read more here: [Declarative-setup Apps and AppProject](https://argo-cd.readthedocs.io/en/stable/operator-manual/declarative-setup/)

## 04-Understanding Multi Cluster Setup

ArgoCD can sync applications on the Kubernetes cluster it is running on and can also manage external clusters. It can be configured to only have access to a restricted set of namespaces.

Credentials to the other clusters’ API Servers are stored as secrets in ArgoCD’s namespace. ArgoCD is useful feature for managing all deployments at a single place. The built-in RBAC mechanism gives options to control access to deployments to different environments only to certain users.

<b>Prerequisite</b>

- Installed kubectl
- Installed ArgoCD in one Cluster(Primary)
- Setup the External clusters on EKS or GKE
- Have kubeconfig file for both clusters

### Add External Cluster 

ArgoCD CLI we will use and it can get the cluster credentials from the kubeconfig file.

```
kubectl config set-cluster prod --server=https://1.2.3.4 --certificate-authority=prod.crt
kubectl config set-credentials admin --client-certificate=admin.crt --client-key=admin.key
kubectl config set-context admin-prod --cluster=prod --user=admin --namespace=prod-app
```
Add Cluster and Verify
```
argocd cluster add admin-prod

arocd cluster list
```
Check external cluster secrets
```
kubectl describe secret SecretName -n argocd 
```
Now Deploy application ArgoCD config for external cluster.
```
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: guestbook
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/argoproj/argocd-example-apps.git
    targetRevision: HEAD
    path: guestbook
  destination:
    server: https://1.2.3.4
    namespace: guestbook
```

For Advance use-case refer [ApplicationSet](https://argo-cd.readthedocs.io/en/stable/user-guide/application-set/).

## 05-Understanding HA Cluster Setup

Argo CD is largely stateless, all data is persisted as Kubernetes objects, which in turn is stored in Kubernetes' etcd. Redis is only used as a throw-away cache and can be lost. When lost, it will be rebuilt without loss of service.

A set of HA manifests are provided for users who wish to run Argo CD in a highly available manner. This runs more containers, and runs Redis in HA mode.

Ref: [HA Setup Manifests](https://github.com/argoproj/argo-cd/tree/master/manifests)

Require at least three different nodes due to pod anti-affinity roles in the specs.

### Scaling Up Argo Components

Four main components which we can scale up to support HA.

<b>argocd-repo-server</b>  
The argocd-repo-server is responsible for cloning Git repository, keeping it up to date and generating manifests using the appropriate tool.

<b>argocd-application-controller</b>

The argocd-application-controller uses argocd-repo-server to get generated manifests and Kubernetes API server to get actual cluster state.

<b>argocd-server</b>

The argocd-server is stateless and probably least likely to cause issues. You might consider increasing number of replicas to 3 or more to ensure there is no downtime during upgrades.

<b>argocd-dex-server, argocd-redis</b>

The argocd-dex-server uses an in-memory database, and two or more instances would have inconsistent data. argocd-redis is pre-configured with the understanding of only three total redis servers/sentinels.

Read More: [HA Cluster Setup](https://argo-cd.readthedocs.io/en/stable/operator-manual/high_availability/)

## 06-ArgoCD with Helm(30 minutes)

We can directly connect packaged helm chat with Argo CD and Argo CD will monitor it for new versions.
When we deploying helm charts using Argo CD the application is no longer a helm applicaiton. The helm chart 
is then considered as an Argo app that can only operated by Argo CD.

- [READ] - [Argo CD with Helm](https://argo-cd.readthedocs.io/en/stable/user-guide/helm/)

#### Hands-on activity (15 minutes)

:computer: Deploy the [sample app helm chart](https://github.com/shehbaz-pathan/simple-microservices-app/tree/helm-repo/customer-info) using Argo CD.The sample app should be deployed with an image  `gcr.io/tetratelabs/customers:2.0.0` 
```
Helm repo: 	https://shehbaz-pathan.github.io/simple-microservices-app/chart
Chart name: customer-info
Chart version: 0.1.0
```
<details>
<summary>Answer</summary></br>

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: customers
  namespace: argocd
spec:
  project: default
  source:
    chart: customer-info
    repoURL: https://shehbaz-pathan.github.io/simple-microservices-app/chart/
    targetRevision: 0.1.0
    helm:
      releaseName: customers
      parameters:
        - name: customers.image
          value: gcr.io/tetratelabs/customers:2.0.0
  destination:
    server: "https://kubernetes.default.svc"
    namespace: default
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```
</details>

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
Run command `kubectl apply -f env.yaml` which will create env-apps application with route to test and prod application. verify on the argo cd UI
</details>

## 09-ApplicationSet

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

##### Hands-on activity (30 minutes)</br>
##### Prerequisite

- Two local Kubernetes clusters
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

:computer: Fork the following repo `https://github.com/ppratheesh/simple-microservices-app.git` and configure an ApplicationSet for deploying all applications defined in `custom-app/ApplicationSet` directory except sample-app-three 
on both clusters with following parameters


```
 - application name: <resource_directory_name>-<clustername>
 - project: default
 - SYNC POLICY: auto
 - repository URL: https://github.com/<your name>/simple-microservices-app.git
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
                - path: custom-app/ApplicationSet/*
                - path: custom-app/ApplicationSet/sample-app-three
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

## 10-ArgoCD with HC Vault and Bitnami sealed secrets

#### Bitnami sealed secrets

Argo CD is un-opinionated about how secrets are managed. One of the most popular tools to manage gitops secrets is Bitnami Sealed Secrets 

Using Bitnami Sealed Secrets we can encrypt our secrets into a a SealedSecret, which is safe to store - even inside a public repository.
Once we encrypt our secrets only the controller running in the target cluster can decrypt them (not even the original author can decrypt it)

The SealedSecrets are cluster and namespace specific.If you want to use the same secret for different clusters, you need to encrypt it for each cluster individually.

![diagram](https://user-images.githubusercontent.com/51965567/206392261-08d1b235-4815-4fe4-8c99-8a23aaa84c2a.svg)

- [READ] - [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets)

#### Assignment

##### Prerequisite

- SealedSecret Controller should be installed 
- kubeseal utility should be installed

:computer: Configure sealed secrets for the nginx applicaiton defined in the directory `custom-app/BitnamiSecret` of [repo](https://github.com/ppratheesh/simple-microservices-app.git) and store it in git repo.
Use ArgoCD to deploy the secrets along with the application

<details>
<summary>Answer</summary></br>

The sealed secret can be created with the following way

1.`kubeseal <secret.yaml >secret.json`

Sample `secret.yaml`
```yaml
apiVersion: v1
kind: Secret
metadata:
   name: my-nginx
data:
  MY_SECRET: TXl0ZXN0cGFzc3dvcmQ=
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
    path: custom-app/BitnamiSecret
  destination:
    server: https://kubernetes.default.svc
    namespace: default
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
        - CreateNamespace=true
```
</details>

Do a curl test  `curl <node_ip>:30080` and check if you can see the secret

#### HC Vault

We can integrate HC Vault with Argo CD using  Argo CD Vault Plugin

The Argo CD Vault Plugin  is an Argo CD configuration management plugin compatible with many secret management tools (HashiCorp Vault, IBM Cloud Secrets Manager, AWS Secrets Manager, etc.).

The Argo CD Vault Plugin allows for a placeholder to be stored in git instead of an actual Kubernetes secret.

sample kubernets secret would look like 

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
  annotations:
    avp.kubernetes.io/path: "secret/data/my-token"
type: Opaque
data:
  TOKEN: <myToken>
```

  - Argo CD pulls the above secret manifest template from GitHub
  - The Vault Plugin is triggered by the presence of a placeholder in the template
  - The plugin authenticates with Vault and pulls the secret 
  - The retrieved secret is injected into the template replacing the placeholder
  - Argo CD then applies the updated manifest to Kubernetes

[READ] - [Argocd vault plugin](https://argocd-vault-plugin.readthedocs.io/en/stable/)

#### Hands-on activity

##### Prerequisite

- HC Vault should be installed and configure with credentials
- Argocd vault plugin should be configured

:computer: Configure Argo CD to deploy the nginx applicaiton defined in `custom-app/Vault` directory of [repo](https://github.com/ppratheesh/simple-microservices-app.git). Store the secrets required for the applicaiton in Vault and
use ArgoCD to deploy the secrets along with the application 

<details>
<summary>Answer</summary></br>

- You can deploy vault with following Argo CD applicaiton resource.
  ```yaml
  apiVersion: argoproj.io/v1alpha1
  kind: Application
  metadata:
    name: vault
    namespace: argocd
  spec:
    destination:
      namespace: argocd
      server: https://kubernetes.default.svc 
    project: default
    source:
      repoURL: 'https://helm.releases.hashicorp.com'
      chart: vault
      targetRevision: 0.15.0
      helm:
        releaseName: vault
        values: |
          injector:
            enabled: false
          server:
            dev:
              enabled: true
            postStart:
              - /bin/sh
              - -c
              - |
                sleep 10s &&\
                printf 'path "secret/*"{\ncapabilities=["read"]\n}' | vault policy write argocd - &&\
                vault auth enable kubernetes &&\
                vault write auth/kubernetes/config\
                  kubernetes_host=https://kubernetes.default.svc \
                  disable_iss_validation=true &&\
                vault write auth/kubernetes/role/argocd \
                  bound_service_account_names=argocd-repo-server \
                  bound_service_account_namespaces=argocd \
                  policies="argocd"
    syncPolicy:
      automated:
        prune: true
        selfHeal: true

  ```
   Once the Vault has been deployed exec into vault pod and store the secret as following

   ```
   vault kv put secret/my-nginx password="secret-password"
   vault kv get secret/my-nginx
   ```
- Deploy nginx applicaiton and secrets with following Argo CD applicaiton resource.
   ```yaml
    apiVersion: argoproj.io/v1alpha1
    kind: Application
    metadata:
      name: my-nginx-vault-demo
      namespace: argocd
    spec:
      destination:
        namespace: default
        server: https://kubernetes.default.svc 
      project: default
      source:
        repoURL: https://github.com/ppratheesh/simple-microservices-app.git
        targetRevision: HEAD
        path: custom-app/Vault
        plugin:
          name: argocd-vault-plugin
      syncPolicy:
        automated:
          prune: true
          selfHeal: true
        syncOptions:
        - CreateNamespace=true

  ```
  
</details>

  - Do a curl test  `curl <node_ip>:30090` and check if you can see the secret

## 11-ArgoCD Integration With External Secrets Operator
Secrets are the intgral part of modern day applications, secrets are used to store the store the sensitive data such as passwords, keys, APIs, tokens, and certificates, storing secrets on any vcs repository is not a good prctice. We can use external secrets operator with ArgoCD to store secrets required by application on any external secret managers like AWS Secret Manager, Google Secret Manager, HC Vault etc and pull them into the application without writing them down in any kubernetes manifests.

- [Read][External Secrets Operator](https://external-secrets.io/v0.7.0-rc1/introduction/getting-started/)

##### Assigment
 Use this sample k8s application [repo](https://github.com/shehbaz-pathan/simple-microservices-app/tree/master/manifests/external-secrets-example) and deploy this application using ArgoCD, this app reads value for environment variable NAME from secret, store the value of this env variable in external secrets manager(AWS or Google) and pull that value using External Secrets Operator, integrate External Secrets Operator with ArgoCD.
 <details>
<summary>Answer</summary></br>
In this solution we will use Google Secret Manager for storing secret

- Follow [this](https://external-secrets.io/v0.7.0-rc1/provider/google-secrets-manager/) guide to use Google Secret Manager with External Secrets Operator
Create SecretStore and ExternalSecret manifets and push them to the repo to deploy them using ArgoCD
- Create secret store to connect with Google Secret Manger

```yaml
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: gcp-secret-store
spec:
  provider:
      gcpsm:                                  
        auth:
          secretRef:
            secretAccessKeySecretRef:
              name: gcpsm-secret              
              key: secret-access-credentials  
        projectID: your-project-id
```
- Create external secret resource to pull secret value from GCP secrets

```yaml
apiVersion: external-secrets.io/v1alpha1
kind: ExternalSecret
metadata:
  name: example
spec:
  refreshInterval: 10m
  secretStoreRef:
    kind: SecretStore
    name: gcp-secret-store              
  target:
    name: web-secret
    creationPolicy: Owner
  dataFrom:
    - key: web-secret
```
- Create the application 
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: customers
  namespace: argocd    
spec:
  project: default
  source:
    repoURL: 'https://github.com/shehbaz-pathan/simple-microservices-app.git'
    path: manifests/external-secrets-example/
    targetRevision: HEAD
  destination:
    server: 'https://kubernetes.default.svc'
    namespace: default
```

Google Secret:
![Folder](./assets/web-secret.png)

Expected Result:
![Folder](./assets/web-frontend-name.png)

</details>

## 12 End-to-end CI/CD pipeline using Jenkins(CI) and ArgoCD(CD)

Jenkins is a platform for creating a Continuous Integration/Continuous Delivery (CI/CD) environment. The system offers many different tools, languages, and automation tasks to aid in pipeline creation when developing and deploying programs. We can use jenkins with argocd for application.
  
- [Read][jenkinswith argocd](https://cloudyuga.guru/blog/jenkins-argo)
- [Read][jenkins with argocd](https://yetiops.net/posts/argocd-jenkins-pipeline/)

##### Hands-on activity
:computer: Create end-to-end CI/CD pipeline using Jenkins(CI) and ArgoCD, use [this](https://github.com/shehbaz-pathan/argocd-jenkins) sample app, this repo has two branches ```master``` and ```argocd```, master branch holds application source code and argocd branch holds kubernetes deployment manifests. Fork this repo and deploy a pipeline as below
1. Deploy an ArgoCD application from the argocd branch
2. Create a Jenkins pipeline which will build and push new docker image to docker hub whenever there is any code changes pushed to master branch for customers or web-frontend service
3. Your pipeline should also be able to update new image in deployment manifests from argocd branch so that ArgoCD application should detect changes and sync to deploy new image

<b>Code changes to test pipeline</b>

<b>web-frontend</b>

You can change the backgroud color of the web-frontend from```web-frontend/dist/views/index.ejs``` file, there already available css classes for background color are ```bg-tetrate-blue```, ```bg-tetrate-black``` and ```bg-tetrate-green``` you can use one of them or you can add new css class for bg-color in ```web-frontend/dist/public/css/style.css```.

<b>customers</b>

You can update the ```customers/customers.json``` file to change the customers details e.g you can add or remove new customers or you can add or remove any field related to customer like id,age,address etc.
<details>
<summary>Answer</summary></br>

<b>Pre-requisites</b>
>- Docker - You should have docker installed on your jenkins node
>- Git - You should have git installed on your jenkins node 
>- yq - You should have yq utility to be installed on your jenkins node, we are using yq for updating deployment manifests. read about yq more [here](https://mikefarah.gitbook.io/yq/)
>- Add your github and docker hub credentials in jenkins to push images to docker hub and to push updated manifests to github

- Deploy an ArgoCD application from argocd branch

```
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: simple-customer-app
  namespace: argocd
spec:
      project: default
      source:
        repoURL: https://github.com/<your github account>/<your repo>.git
        targetRevision: argocd
        path: manifests/
      destination:
        server: https://kubernetes.default.svc
        namespace: default
      syncPolicy:
        automated:
          prune: true
          selfHeal: true
```

<b> Customers </b>

- Create a Jenkinsfile for customers service

```
pipeline {
    agent any
    environment {
      github = credentials('github')
      dockerhub = credentials('dockerhub')
    }
     stages {
        stage('build') {
          when {
           allOf {
            changeset "customers/**"
            not { changeset pattern: "customers/Jenkinsfile" }
          }
        } 
           steps {
               sh '''
                 until docker container ls ; do sleep 3 ;done && docker build -t ${dockerhub_USR}/<your docker hub repo>:customers-${GIT_COMMIT} ./customers/
                 docker login -u ${dockerhub_USR} -p ${dockerhub_PSW} && docker push ${dockerhub_USR}/<your docker hub repo>:customers-${GIT_COMMIT}
                 '''
           }
        }
       stage('deploy') {
        
          when {
           allOf {
            changeset "customers/**"
            not { changeset pattern: "customers/Jenkinsfile" }
          }
        } 

           steps {
               sh '''
                     git config --global user.email "<your github account email>" 
                     git checkout argocd
                     git pull origin argocd
                     export image_tag="${dockerhub_USR}/<you docker hub repo>:customers-${GIT_COMMIT}" 
                     yq eval '.spec.template.spec.containers[0].image = env(image_tag)' -i ./manifests/customers.yaml
                     git add . 
                     git commit -m "Updated image tag for customers" 
                     git push https://${github_USR}:${github_PSW}@github.com/<your github account>/<your github repo name>.git
                  '''
           }
       }

     }
}
```
Change the below values from above Jenkins file

```
<your docker hub repo>: name of your docker hub repo
<your github account email>: your github email for authorization
<your github account>: you github account name
<your github repo name>: name of your repo
```
Create pipeline in jenkins for customers service by using above jenkins file.

<b>Web-frontend</b>

- Create Jenkinsfile for web-frontend service as below

```
pipeline {
    agent any
    environment {
      github = credentials('github')
      dockerhub = credentials('dockerhub')
    }
     stages {
        stage('build') {
          when {
           allOf {
            changeset "web-frontend/**"
            not { changeset pattern: "web-frontend/Jenkinsfile" }
          }
        } 
           steps {
               sh '''
                 until docker container ls ; do sleep 3 ;done && docker build -t ${dockerhub_USR}/<your docker hub repo>:web-frontend-${GIT_COMMIT} ./web-frontend/
                 docker login -u ${dockerhub_USR} -p ${dockerhub_PSW} && docker push ${dockerhub_USR}/<your docker hub repo>:web-frontend-${GIT_COMMIT}
                 '''
           }
        }
       stage('deploy') {
        
           when {
           allOf {
            changeset "web-frontend/**"
            not { changeset pattern: "web-frontend/Jenkinsfile" }
          }
        }

           steps {
               sh '''
                     git config --global user.email "<your github account email>" 
                     git checkout argocd
                     git pull origin argocd
                     export image_tag="${dockerhub_USR}/<your docker hub repo>:web-frontend-${GIT_COMMIT}" 
                     yq eval '.spec.template.spec.containers[0].image = env(image_tag)' -i ./manifests/web-frontend.yaml
                     git add . 
                     git commit -m "Updated image tag for web-frontend" 
                     git push https://${github_USR}:${github_PSW}@github.com/<your github account>/<your github repo name>.git
                  '''
             
           }
       }

     }
}

```
Change the below values from above Jenkins file

```
<your docker hub repo>: name of your docker hub repo
<your github account email>: your github email for authorization
<your github account>: you github account name
<your github repo name>: name of your repo
```
Create pipeline in jenkins for web-frontend service by using above jenkins file.

After you successfully deploy ArgoCD app and jenkins pipeline, you can make any changes in code and push those changes to master branch, it will triger jenkins pipeline for either customers or web-fronted service based the changes you have made then pipeline will build and push new image to docker hub and also update the deployment manifest with new image, once the updated deployment manifest pushed to github then ArgoCD application will sync to deploy new image.


</details>


# ArgoCD Level-02
## 01-User Management
### a) Local Users/Accounts
ArgoCD allows us to create to local users/accounts for authenticating and authorizing the different users and groups and restrict access to the ArgoCD and its resources. Argo CD does not have its own user management system and has only one built-in user admin. The admin user is a superuser and it has unrestricted access to the system. ArgoCD allows restrict access to ArgoCD resources using RBAC permissions.
- [Read][Local Users/Accounts](https://argo-cd.readthedocs.io/en/stable/operator-manual/user-management/#local-usersaccounts-v15)
- [Read][RBAC Rules](https://argo-cd.readthedocs.io/en/stable/operator-manual/rbac/#rbac-configuration)

##### Assignment
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

### b) SSO
ArgoCD allows us to integrate SSO to use our existing identity provider to access ArgoCD resources, since we already know ArgoCD don't its own user management system but allow us to restrict access to its resource using RBAC permissions so we can use our existing identity provider for authenticating and RBAC permission for authorization.
- [Read][ArgoCD SSO Configuration](https://argo-cd.readthedocs.io/en/stable/operator-manual/user-management/#sso)
##### Assignment
:computer: Configure ArgoCD SSO using Okta via SAML method
<details>
<summary>Answer</summary></br>

Follow [this](https://argo-cd.readthedocs.io/en/stable/operator-manual/user-management/okta/#saml-with-dex) guide for ArgoCD SSO integration using Okta
</details>


## 02-ArgoCD with github actions for end-to-end CI/CD

Considering the GitOps principle your application and the configuration should be stored in a version controlled repository. All the changes made to the Code/Cluster config should be tracked in the code repository and triggered from the repo itself.

There are few main tenants of this philosophy are:

- Use a Git repository as a single source of truth.
- Any change is made in the form of a Git commit.
- When the application state differs from the desired state (that is: what’s in Git), a reconciliation loop detect the drift and make the adjustments to the cluster.

##### Assignment(40 Minutes)
:computer: Setup a CI workflow with GitHub Actions that should trigger a pipeline as and when there is a change commited in the repository. Once the CI pipeline is done argocd shpuld pick the changes and deploy in the cluster.

Prerequisite
- A kubernetes cluster
- Any Sample application created in the above assignments
- Running argocd instance

<details>
<summary>Answer</summary></br>

You can use this [sample-application](https://github.com/rajatrj16/nginx-test-app/blob/master/index.html):

```html
<!DOCTYPE html>
<Head>
<title>
Simplest page
</title>
<Head>
<h1> This is the simplest HTML page</h1>
```

Create a docker image and push it to dockerhub
Need to add the `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` secrets in the github repository.

Setup a github action worflow in the sample application repository [.github/workflows/CI.yaml](https://github.com/rajatrj16/nginx-test-app/blob/master/.github/workflows/ci.yaml)

```yaml
name: CI
on:
  push:
    branches:
      - master
jobs:
  build:
    name: create-and-push-image
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Set up QEMU
        uses: docker/setup-qemu-action@v2

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v3
        with:
          context: .
          file: ./Dockerfile
          push: true
          tags: rajatrj16/nginx-test-app:${{ github.sha }}

      - name: Update Version
        run: |
          version=$(cat ./kubernetes/deployment.yaml | grep image: | awk '{print $2}' | cut -d ':' -f 2)
          echo "$version"
          sed -i "s/$version/${{ github.sha }}/" ./kubernetes/deployment.yaml
          cat ./kubernetes/deployment.yaml | grep image: | awk '{print $2}'
      
      - name: Commit and push changes
        uses: devops-infra/action-commit-push@v0.3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          commit_message: Image version updated
```

Argocd works with helm, Kustomize or plane manifests.

Plane manifests for the sample application [deployment.yaml](https://github.com/rajatrj16/nginx-test-app/blob/master/kubernetes/deployment.yaml)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-test-app
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx-test-app
        image: rajatrj16/nginx-test-app:latest
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-test-app
spec:
  type: NodePort
  selector:
    app: nginx
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
```

Setup an application in argocd UI or using CLI
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: nginx-test-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/rajatrj16/nginx-test-app.git
    targetRevision: HEAD
    path: kubernetes
  destination:
    server: https://kubernetes.default.svc
    namespace: default
  syncPolicy:
    automated:
      selfHeal: true
      Prune: true
      Replace: true
      allowEmpty: true
    syncOptions:
    - CreateNamespace=true
    - Prune=true
    - Replace=true
```
Make sure the appliation is sync to fetch and deploy the latest change from code repository.

Sync argocd app:

```yaml
argocd app sync nginx-test-app
```

Reference Repository: [nginx-test-app](https://github.com/rajatrj16/nginx-test-app.git)

</details>

## 03-ArgCD Sync Phases, Waves and Sync Windows
## a) Sync Phases and Waves
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

## b) Sync Windows
Sync windows are configurable windows of time where syncs will either be blocked or allowed. Using sync windows we can allow or block app snyc for the specific duration of either specific applications, namespaces or entire cluster, sync windows will be helpful for restricting the deployment of applications on specific time lets say deploying production apps during weekend only no app deployments during working hours etc.
- [Read][Sync Windows](https://argo-cd.readthedocs.io/en/stable/user-guide/sync_windows/)

##### Assignmetn 
:computer: Create an allow sync window in default AppProject for entire cluster with duration of 2h between 8PM-10PM on all days also create a deny window as well of same duration and timing.
<details>
<summary>Answer</summary></br>

- Update the default AppProject with the sync windows mentioned above
```sh
kubectl edit appproject default -n argocd
```

```yaml
apiVersion: argoproj.io/v1alpha1
kind: AppProject
metadata:
  name: default
  namespace: argocd
spec:
  clusterResourceWhitelist:
  - group: '*'
    kind: '*'
  destinations:
  - namespace: '*'
    server: '*'
  sourceRepos:
  - '*'
  syncWindows:
   - kind: allow
    schedule: '0 20 * * *'
    duration: 2h
    clusters:
    - in-cluster
  - kind: deny
    schedule: '0 20 * * *'
    duration: 2h
    clusters:
    - in-cluster
```
</details>

##### Quick Questions

1. After creating above mentioned sync windows would you be able to sync any app between 8PM-10PM every day?
<details>
<summary>Answer</summary></br>

> NO, because an active deny window will orverrides the an active allow window for you would not be able sync any application during that window
</details>

2. After creating above mentioned sync windows would you be able to sync any app at any time expect 8PM-10PM?
<details>
<summary>Answer</summary></br>

> No, because there would no active allow window at any time expect 8PM-10PM, but we have an active deny window during the same time 8PM-10PM that means we would not be able to sync any application at any time.```
</details>

## 04-ArgoCD Diffing Customizations and Notifications
### a) Diffing Customization
The diffing customization feature allows users to configure how ArgoCD behaves during the diff stage which is the step that verifies if an Application is synced or not. Argo CD allows you to optionally ignore differences of problematic resources. The diffing customization can be configured for single or multiple application resources or at a system level.
- [Read][Diffing Customization](https://argo-cd.readthedocs.io/en/stable/user-guide/diffing/)
- [Read][Application Level Configuration](https://argo-cd.readthedocs.io/en/stable/user-guide/diffing/#application-level-configuration)
- [Read][System Level Confgiguration](https://argo-cd.readthedocs.io/en/stable/user-guide/diffing/#system-level-configuration)

##### Assignmetn 
:computer: Use this sample k8s application [repo](https://github.com/shehbaz-pathan/simple-microservices-app/tree/master/manifests) and deploy this application using ArgoCD and later configure the diffing customization to ingoner the count of replicas for web-frontend deployment.
<details>
<summary>Answer</summary></br>

- Deploy the application using ArgoCD
- Set the replica count of web-frontend deployment to 2 by editing the web-frontend deployment manually, now check the sync status of the app it will show OutOfSync due to replica count changed for web-frontend deployment.
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

## b) Notifications
Argo CD Notifications continuously monitors Argo CD applications and provides a flexible way to notify users about important changes in the application state. Using a flexible mechanism of triggers and templates you can configure when the notification should be sent as well as notification content
- [Read][Notifications](https://argo-cd.readthedocs.io/en/stable/operator-manual/notifications/)

##### Assignment
:computer: Use this sample k8s application [repo](https://github.com/shehbaz-pathan/simple-microservices-app/tree/master/manifests) and deploy this application using ArgoCD with notification configuration to sent notification on slack whenever sync is running, sync succeeded and sync failed for this app.

<details>
<summary>Answer</summary></br>

- Follow [this](https://argo-cd.readthedocs.io/en/stable/operator-manual/notifications/services/slack/) guide to setup slack write bot and notification channel
- Deploy the ArgoCD app manifest will look like this with notification configuration
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: customers
  namespace: default
  annotations:
     notifications.argoproj.io/subscriptions: |
     - trigger: [on-sync-failed, on-sync-running, on-sync-succeeded]
        destinations:
          - service: slack
            recipients: [argocd-notifications-test]        
spec:
  project: default
  source:
    repoURL: 'https://github.com/shehbaz-pathan/argocd-examples.git'
    path: customer-details
    targetRevision: HEAD
  destination:
    server: 'https://kubernetes.default.svc'
    namespace: default
  syncPolicy:
    syncOptions:
     - RespectIgnoreDifferences=true
  ignoreDifferences:
    - group: apps
      kind: Deployment
      name: web-frontend
      namespace: default
      jqPathExpressions:
        - .spec.replicas
```
once you first deploy above app after required slack related config you should get notifications like below while sync is running and when sync is succeeded

![Folder](./assets/argocd-notify.png)
</details>

## 05-ArgoCD Disaster Recovery (40 Minutes)
Argocd data are stored in the kubernetes custer one should consider taking backup of the argocd data regularly to avoid downtime and outages. Argocd configuration export can be done per individual application or by just exporting all of the applications to a YAML file.
It is generally recommended to store the applications individually and within the same git repository that the Kubernetes objects are defined so that they will be under revision control and available in the event of a disaster.
- [Read][Disaster-recovery](https://argo-cd.readthedocs.io/en/stable/operator-manual/disaster_recovery/#disaster-recovery)
- [Read][Disaster Recovery workflow](https://argoproj.github.io/argo-workflows/disaster-recovery/#disaster-recovery-dr)

##### Assignment(20 Minutes)
:computer: Backup and Restore [Helm-guestbook](https://github.com/rajatrj16/argocd-example-apps/tree/main/helm-guestbook) application by exporting backup files created using argocd command line tool.

<details>
<summary>Answer</summary></br>
backup:

```yaml
argocd app get argocd/helm-guestbook -o yaml > simple-app-backup.yaml
  ```

 _Delete the existing application_ or _deploy the application in another cluster_

restore:

```yaml
argocd app create -f simple-app-backup.yaml
```
</details>

## 06-ArgoCD with ArgoRollouts for progressive delivery
Argo Rollouts is a Kubernetes controller used for progressive delivery and is part of the Argo open source project. It includes a set of custom resource definitions (CRDs) that introduce advanced deployment capabilities to Kubernetes with features like progressive delivery, blue-green deployment, canary releases, and canary analysis.
- [READ][Argo Rollous](https://argoproj.github.io/argo-rollouts/)

<b>Progressive Delivery</b>

Progressive delivery is the process of releasing updates of a product in a controlled and gradual manner, thereby reducing the risk of the release.
- [READ][Progressive Delivery](https://argoproj.github.io/argo-rollouts/concepts/#progressive-delivery)

##### Hands-on activity
:computer: Deploy an Argo Rollout resource using ArgoCD, use ArgoRollouts canary strategy to deploy and promote new version of your app, you can use the same assignment from [jenkins](#12-end-to-end-cicd-pipeline-using-jenkinsci-and-argocdcd) and change the Deployment resource to the Argo Rollout resource with canary strategy.
<details>
<summary>Answer</summary></br>

- Update the customers.yaml file and change the deployment to rollout as below

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: customers
  labels:
    app: customers
spec:
  revisionHistoryLimit: 3
  replicas: 1
  selector:
    matchLabels:
      app: customers
  template:
    metadata:
      labels:
        app: customers
    spec:
      containers:
        - image: 6255/customer-info:customers-7efbd1643a0e3b8b957b5241dc3c444d886d5c8b
          imagePullPolicy: Always
          name: svc
          ports:
            - containerPort: 3000
  strategy:
    canary:
      steps:
      - setWeight: 10
      - pause:
          duration: 2m
      - setWeight: 20
      - pause:
          duration: 2m
      - setWeight: 50
      - pause:
          duration: 2m
```
- Update the web-frontend.yaml file and change the deployment to rollout as below

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: web-frontend
  labels:
    app: web-frontend
spec:
  revisionHistoryLimit: 3
  replicas: 1
  selector:
    matchLabels:
      app: web-frontend
  template:
    metadata:
      labels:
        app: web-frontend
    spec:
      containers:
        - image: 6255/customer-info:web-frontend-783157e89108fb6205b7a77920a7b44573a3e8aa
          imagePullPolicy: Always
          name: web
          ports:
            - containerPort: 8080
          env:
            - name: CUSTOMER_SERVICE_URL
              value: 'http://customers'
  strategy:
    canary:
      steps:
      - setWeight: 10
      - pause:
          duration: 2m
      - setWeight: 20
      - pause:
          duration: 2m
      - setWeight: 50
      - pause:
          duration: 2m
```
push these changes to argocd branch and sync the ArgoCD app.
- Now update the application code, e.g change the backgroud color of frontend or update customer details in customers.json file and push the changes, this would build and deploy new image. Argo Rollout will create replicas for new version based on the weight value in each step e.g if we have 2 replicas running for current version and we have set initial weight of new version to 50 then Argo Rollout will start a 2 replicas of new version to forward 50% of traffic to new version and will increase and decrease no of replicas based on weight of subsequent steps.

- once the new version of app get deployed, check and verify that new version of app getting traffic as per the wieghts specified in canary steps, use below command to check the status of Rollout.
```sh
kubectl argo rollouts get rollout <rollout name > -w
</details>
