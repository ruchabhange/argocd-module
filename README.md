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
- [02-ArgoCD with github actions for end-to-end CI/CD ]()
- [03-ArgCD Sync Waves and phases]()
- [04-ArgoCD Diff customizations, Notifications and Sync Windows]()
- [05-ArgoCD Disaster Recovery.](#disaster-recovery-60-minutes)
- [06-ArgoCD with ArgoRollouts for progressive delivery]()

# ArgoCD Level-02
## Disaster Recovery (40 Minutes)
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

