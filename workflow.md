## Vcluster workflow for Argocd/Linkerd according to version based on Labels


The workflow contains action to create a vcluster according to the `PR Number` on Eks cluster depending on label POC (Proof of Concept). If POC label is specified it would create vcluster and on top of it would perform specific actions if required as installing `argocd` or `linkerd` depending on label and version as input.


### Labels required in workflow

#### `POC`

`POC` label indicates that this PR requires a Proof of Concept. Adding this label will provide you with a vCluster.

#### `argocd`

`argocd` label indicates that this PR is related to `argocd-knowledge-base`. It is mandatory to add this label in all `argocd` related PR's which require argocd to get installed on vcluster further with POC label.

#### `linkerd`

`linkerd` lable indicates that this PR is related to `linkerd-knowledge-base` . It is mandatory to add this label in all linkerd related PR's which require linkerd to get installed on vcluster. 

**NOTE**: Poc label is required of vcluster to get created for specific pr, argocd and linkerd labels will match the condition for argocd or linkerd installation,will have to specify both labels `POC + argocd` or `POC + linkerd`


### Specific version of Argocd or Linkerd for POC

According to the workflow condition we have seprate files for argocd ie `version-argocd.txt` where we should specify the version we wand to work on for example `v2.5.16` while creating the PR with labels, same for linkerd we have `version-linkerd.txt`

### Workflow Diagram


![Github actions flow diagram drawio](https://user-images.githubusercontent.com/32972207/231132648-4ba1740b-3cd9-482a-a2d5-c75290ca342a.png)
