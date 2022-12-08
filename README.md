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
- [01-User Management]()
- [02-ArgoCD with github actions for end-to-end CI/CD](#02-argocd-with-github-actions-for-end-to-end-cicd)
- [03-ArgCD Sync Waves and phases]()
- [04-ArgoCD Diff customizations, Notifications and Sync Windows]()
- [05-ArgoCD Disaster Recovery.](#05-argocd-disaster-recovery-40-minutes)
- [06-ArgoCD with ArgoRollouts for progressive delivery]()

# ArgoCD Level-02

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
          tags: rajatrj16/nginx-test-app:latest
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

