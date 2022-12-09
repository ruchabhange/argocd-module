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
- [09-Understanding Application sets](#09-ApplicationSet) 
- [10-Assignment on AppicationSets]()
- [11-ArgoCD with HC Vault and Bitnami sealed secrets](#11-Using-Bitnami-sealed-secrets-for-storing-secrets-on-git-repos-securely)
- [12-ArgoCD integration with external secret operator]()
- [13-end-to-end CI/CD pipeline using Jenkins(CI) and ArgoCD(CD)]()

# Level-02
- [01-User Management](#user-management60-minutes)
    - [Local Users/Accounts](#a-local-usersaccounts20-minutes)
    - [SSO](#b-sso40-minutes)
- [02-ArgoCD with github actions for end-to-end CI/CD ]()
- [03-ArgCD Sync Waves and phases]()
- [04-ArgoCD Diff customizations, Notifications and Sync Windows]()
- [05-ArgoCD Disaster Recovery.]()
- [06-ArgoCD with ArgoRollouts for progressive delivery]()

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

<b>WIP</b>

## 05-Understanding HA Cluster Setup

<b>WIP</b>


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


#### 10-Assignment

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

## 11-Using Bitnami sealed secrets for storing secrets on git repos securely

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

</details>

## 13 End-to-end CI/CD pipeline using Jenkins(CI) and ArgoCD(CD)

Jenkins is a platform for creating a Continuous Integration/Continuous Delivery (CI/CD) environment. The system offers many different tools, languages, and automation tasks to aid in pipeline creation when developing and deploying programs. We can use jenkins with argocd for application.
  
- [Read][jenkinswith argocd](https://cloudyuga.guru/blog/jenkins-argo)
- [Read][jenkins with argocd](https://yetiops.net/posts/argocd-jenkins-pipeline/)
